'use server';

import { identifyHerbAndProvideDetails } from '@/app/ai/flows/identify-herb-details';
import { categorizeHerb } from '@/app/ai/flows/categorize-herb-flow';
import { provideAyurvedicApplications } from '@/app/ai/flows/ayurvedic-applications';
import { HerbInfoState } from '@/types/herb';

export async function getHerbInformation(
  prevState: HerbInfoState,
  formData: FormData
): Promise<HerbInfoState> {
  try {
    const herbImage = formData.get('herbImage') as string;
    const location = formData.get('location') as string;
    const weather = formData.get('weather') as string;

    if (!herbImage) {
      return {
        success: false,
        error: 'Please provide an herb image.',
      };
    }

    // Call AI flows in parallel
    const [identificationResult, categorizationResult] = await Promise.all([
      // Main identification flow
      identifyHerbAndProvideDetails({
        herbPhotoDataUri: herbImage,
        locationDescription: location || undefined,
        weatherDescription: weather || undefined,
      }),
      // We'll get the herb name first then categorize
      identifyHerbAndProvideDetails({
        herbPhotoDataUri: herbImage,
        locationDescription: location || undefined,
        weatherDescription: weather || undefined,
      }).then(result => categorizeHerb({ herbName: result.identification.commonName })),
    ]);

    // Get Ayurvedic applications after we have the herb name and description
    const ayurvedicResult = await provideAyurvedicApplications({
      herbName: identificationResult.identification.commonName,
      herbDescription: identificationResult.details.uses || '',
    });

    return {
      success: true,
      identification: {
        commonName: identificationResult.identification.commonName,
        latinName: identificationResult.identification.latinName,
        confidenceLevel: `${Math.round(identificationResult.identification.confidenceLevel * 100)}%`,
        description: identificationResult.details.uses,
      },
      details: {
        uses: identificationResult.details.uses,
        chemicalConstituents: identificationResult.details.chemicalConstituents?.join(', ') || 'Not available',
        cultivation: identificationResult.details.cultivation,
        preservation: identificationResult.details.preservationTechniques || 'Not available',
        origin: identificationResult.details.origin,
        historicalContext: identificationResult.details.history || 'Not available',
      },
      category: {
        medicinalProperties: categorizationResult.medicinalProperties,
        cultivationMethods: categorizationResult.cultivationMethods,
        climaticRequirements: categorizationResult.preservationTechniques,
        category: categorizationResult.category,
      },
      ayurvedic: {
        ayurvedicApplications: ayurvedicResult.ayurvedicApplications,
      },
      location,
      weather,
    };
  } catch (error) {
    console.error('Error analyzing herb:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze herb. Please try again.',
    };
  }
}
