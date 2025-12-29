'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { FormContent } from './form-content';
import { Results } from './results';
import { AILoadingScreen } from './ai-loading-screen';
import { getHerbInformation } from '@/app/actions';
import { HerbInfoState } from '@/types/herb';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const initialState: HerbInfoState = {
  success: false,
};

function CaptureForm({
  formAction,
  state,
}: {
  formAction: (payload: FormData) => void;
  state: HerbInfoState;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      {/* AI Loading Screen */}
      {pending && <AILoadingScreen message="Analyzing herb with Gemini AI..." />}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="md:sticky md:top-24 md:self-start">
          <form action={formAction}>
            <FormContent pending={pending} />
          </form>
        </div>

        {/* Right Column - Results */}
        <div>
          <Results state={state} pending={pending} />
        </div>
      </div>
    </>
  );
}

export default function Capture() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const lastToastStateRef = useRef<string>('');

  const [state, formAction] = useActionState(getHerbInformation, initialState);

  // Check authentication
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
      });
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  // Show toast notifications based on state changes
  useEffect(() => {
    const stateKey = state.error || (state.success && state.identification?.commonName) || '';
    
    // Only show toast if state has changed
    if (stateKey && stateKey !== lastToastStateRef.current) {
      lastToastStateRef.current = stateKey;
      
      if (state.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: state.error,
        });
      } else if (state.success && state.identification) {
        toast({
          title: 'Analysis Complete',
          description: `${state.identification.commonName} has been identified.`,
        });
      }
    }
  }, [state, toast]);

  const handleConvert = async () => {
    if (!state.success || !state.identification || !user) {
      toast({
        variant: 'destructive',
        title: 'No Data to Convert',
        description: 'Please complete an analysis first.',
      });
      return;
    }

    setIsConverting(true);

    try {
      // Generate a simple canvas (in production, use html2canvas for full report)
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not create canvas context');

      // Simple report rendering (enhance this in production)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Herb Analysis Report', 50, 50);
      ctx.font = '24px Arial';
      ctx.fillText(state.identification.commonName, 50, 100);
      ctx.font = 'italic 18px Arial';
      ctx.fillText(state.identification.latinName, 50, 130);
      ctx.font = '16px Arial';
      ctx.fillText(`Confidence: ${state.identification.confidenceLevel}`, 50, 160);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      // Upload to Supabase Storage
      const fileName = `${state.identification.commonName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('herb-images')
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('herb-images').getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase.from('herb_analyses').insert({
        user_id: user.id,
        user_email: user.email,
        common_name: state.identification.commonName,
        latin_name: state.identification.latinName,
        confidence_level: state.identification.confidenceLevel,
        uses: state.details?.uses || '',
        chemical_constituents: state.details?.chemicalConstituents || '',
        cultivation: state.details?.cultivation || '',
        preservation: state.details?.preservation || '',
        origin: state.details?.origin || '',
        historical_context: state.details?.historicalContext || '',
        medicinal_properties: state.category?.medicinalProperties || '',
        cultivation_methods: state.category?.cultivationMethods || '',
        climatic_requirements: state.category?.climaticRequirements || '',
        category: state.category?.category || '',
        ayurvedic_applications: state.ayurvedic?.ayurvedicApplications || '',
        location: state.location || '',
        weather: state.weather || '',
        image_url: publicUrl,
      });

      if (dbError) throw dbError;

      toast({
        title: 'Report Converted Successfully',
        description: 'Your herb analysis report has been saved to your profile.',
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        variant: 'destructive',
        title: 'Conversion Failed',
        description: error instanceof Error ? error.message : 'Failed to save report.',
      });
    } finally {
      setIsConverting(false);
    }
  };

  if (loading) {
    return (
      <div id="capture" className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div id="capture" className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Herb Identification</h1>
          <p className="text-gray-600">
            Capture or upload an image of an herb to identify it and learn about its properties.
          </p>
        </div>

        <CaptureForm formAction={formAction} state={state} />

        {/* Convert Button */}
        {state.success && state.identification && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleConvert}
              disabled={isConverting}
              size="lg"
              className="min-w-50"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Converting...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Save Report
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
