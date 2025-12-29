'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { FormContent } from './form-content';
import { Results } from './results';
import { AILoadingScreen } from './ai-loading-screen';
import { getHerbInformation } from '@/app/actions';
import { HerbInfoState } from '@/types/herb';
import { Button } from './ui/button';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-toastify';

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
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
        toast.error('Analysis Failed: ' + state.error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (state.success && state.identification) {
        toast.success(`Analysis Complete! ${state.identification.commonName} has been successfully identified.`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [state]);

  const handleConvert = async () => {
    if (!state.success || !state.identification || !user) {
      toast.error('No Data to Convert - Please complete an herb analysis first.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsConverting(true);
    setUploadProgress(0);

    // Show progress toast
    const progressToastId = toast.loading('Preparing your herb report...', {
      position: 'top-right',
    });

    try {
      // Step 1: Generate report
      toast.dismiss(progressToastId);
      toast.info('Generating report...', { autoClose: false, toastId: 'convert-progress' });
      setUploadProgress(25);

      // Generate a simple canvas (in production, use html2canvas for full report)
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not create canvas context');

      // Enhanced report rendering
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('🌿 Herb Analysis Report', 50, 60);

      // Herb details
      ctx.font = 'bold 28px Arial';
      ctx.fillText(state.identification.commonName, 50, 120);
      ctx.font = 'italic 20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(state.identification.latinName, 50, 150);

      // Confidence badge
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`Confidence: ${state.identification.confidenceLevel}`, 50, 180);

      // Additional details
      if (state.details?.uses) {
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Primary Uses:', 50, 220);
        ctx.font = '14px Arial';
        const usesLines = state.details.uses.substring(0, 200) + '...';
        ctx.fillText(usesLines, 50, 250);
      }

      // Timestamp
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Arial';
      ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, 50, canvas.height - 20);

      // Step 2: Convert to blob
      toast.update('convert-progress', { render: 'Converting report to image...' });
      setUploadProgress(50);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9);
      });

      // Step 3: Upload to Supabase
      toast.update('convert-progress', { render: 'Uploading to cloud storage...' });
      setUploadProgress(75);

      const fileName = `${state.identification.commonName.replace(/\\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
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

      // Step 4: Save to database
      toast.dismiss('convert-progress');
      toast.info('Saving to your profile...', { autoClose: false, toastId: 'save-progress' });
      setUploadProgress(90);

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

      // Success!
      setUploadProgress(100);
      toast.dismiss('save-progress');
      toast.success('Report saved successfully! 🎉 Your herb analysis has been saved to your profile.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      console.error('Conversion error:', error);
      toast.dismiss('convert-progress');
      toast.dismiss('save-progress');
      toast.error(`Failed to save report: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsConverting(false);
      setUploadProgress(0);
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
              className="min-w-50 relative overflow-hidden"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Saving Report...
                  {uploadProgress > 0 && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}
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
