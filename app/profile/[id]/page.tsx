'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import CardExample from '@/components/ui/card-example';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { X, MapPin, Cloud } from 'lucide-react';
import Image from 'next/image';

interface HerbAnalysis {
  id: string;
  user_id: string;
  user_email: string;
  common_name: string;
  latin_name: string;
  confidence_level: string;
  uses: string;
  chemical_constituents: string;
  cultivation: string;
  preservation: string;
  origin: string;
  historical_context: string;
  medicinal_properties: string;
  cultivation_methods: string;
  climatic_requirements: string;
  category: string;
  ayurvedic_applications: string;
  location: string;
  weather: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const [, setUser] = useState<User | null>(null);
  const [herbAnalyses, setHerbAnalyses] = useState<HerbAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHerb, setSelectedHerb] = useState<HerbAnalysis | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const { data, error: fetchError } = await supabase
          .from('herb_analyses')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setHerbAnalyses(data || []);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCardClick = (herb: HerbAnalysis) => {
    setSelectedHerb(herb);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-8xl text-center font-bold mb-2">User Profile</h1>

          {/* Herb Analyses Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">My Herb Analyses</h2>
            
            {error && (
              <p className="text-red-500">Error loading herb analyses: {error}</p>
            )}

            {!herbAnalyses || herbAnalyses.length === 0 ? (
              <p className="text-gray-500">No herb analyses found. Start by capturing your first herb!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {herbAnalyses.map((herb: HerbAnalysis) => (
                  <CardExample
                    key={herb.id}
                    imageSrc={herb.image_url}
                    imageAlt={`${herb.common_name} - ${herb.latin_name}`}
                    cardTitle={herb.common_name}
                    cardDescription={`${herb.latin_name} • ${herb.confidence_level} confidence • ${herb.category || 'Medicinal Herb'}`}
                    onClick={() => handleCardClick(herb)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Herb Details Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <div className="flex w-full justify-between items-center">
              <div className="flex-1">
                <AlertDialogTitle className="text-3xl font-bold mb-2">
                  {selectedHerb?.common_name}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg italic">
                  {selectedHerb?.latin_name}
                </AlertDialogDescription>
              </div>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </AlertDialogHeader>

          {selectedHerb && (
            <div className="space-y-6 mt-4">
              {/* Image */}
              {selectedHerb.image_url && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={selectedHerb.image_url}
                    alt={selectedHerb.common_name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Confidence Level */}
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-green-700">
                  Confidence Level: {selectedHerb.confidence_level}
                </p>
              </div>

              {/* Context Information */}
              {(selectedHerb.location || selectedHerb.weather) && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {selectedHerb.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{selectedHerb.location}</span>
                    </div>
                  )}
                  {selectedHerb.weather && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Cloud size={16} />
                      <span>{selectedHerb.weather}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Details Sections */}
              {selectedHerb.uses && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Primary Uses</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.uses}</p>
                </div>
              )}

              {selectedHerb.medicinal_properties && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Medicinal Properties</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.medicinal_properties}</p>
                </div>
              )}

              {selectedHerb.ayurvedic_applications && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Ayurvedic Applications</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.ayurvedic_applications}</p>
                </div>
              )}

              {selectedHerb.chemical_constituents && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Chemical Constituents</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.chemical_constituents}</p>
                </div>
              )}

              {selectedHerb.cultivation && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Cultivation Methods</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.cultivation}</p>
                </div>
              )}

              {selectedHerb.cultivation_methods && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Cultivation Details</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.cultivation_methods}</p>
                </div>
              )}

              {selectedHerb.climatic_requirements && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Climatic Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.climatic_requirements}</p>
                </div>
              )}

              {selectedHerb.preservation && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Preservation Methods</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.preservation}</p>
                </div>
              )}

              {selectedHerb.origin && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Origin</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.origin}</p>
                </div>
              )}

              {selectedHerb.historical_context && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Historical Context</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedHerb.historical_context}</p>
                </div>
              )}

              {selectedHerb.category && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-700">Category</h3>
                  <p className="text-gray-700">{selectedHerb.category}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-sm text-gray-500 pt-4 border-t">
                <p>Created: {new Date(selectedHerb.created_at).toLocaleString()}</p>
                <p>Updated: {new Date(selectedHerb.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}