'use server';

import { ai } from '@/app/ai/genkit';
import { z } from 'genkit';

// Input schema for the flow
const GenerateLocationsInputSchema = z.object({
  commonName: z.string().describe("The common name of the herb"),
  latinName: z.string().optional().describe("The scientific/Latin name of the herb"),
  currentWeather: z
    .object({
      temperature: z.number(),
      humidity: z.number(),
      location: z.string(),
    })
    .optional()
    .describe("Current weather conditions for context"),
  currentLocation: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional()
    .describe("User's current location for reference"),
});

export type GenerateLocationsInput = z.infer<typeof GenerateLocationsInputSchema>;

// Output schema - array of predicted locations
const GenerateLocationsOutputSchema = z.object({
  locations: z.array(
    z.object({
      latitude: z.number().describe("Latitude coordinate"),
      longitude: z.number().describe("Longitude coordinate"),
      regionName: z.string().describe("Name of the region (e.g., Western Ghats, Himalayas)"),
      climateType: z.string().describe("Climate type (e.g., Tropical, Subtropical, Temperate)"),
      elevationRange: z.string().describe("Elevation range (e.g., 500-1500m)"),
      suitableConditions: z.string().describe("Brief description of suitable growing conditions"),
      confidenceScore: z.number().min(0).max(1).describe("Confidence score between 0 and 1"),
    })
  ),
});

export type GenerateLocationsOutput = z.infer<typeof GenerateLocationsOutputSchema>;

// Define the prompt
const generateLocationsPrompt = ai.definePrompt({
  name: 'generateHerbLocationsPrompt',
  input: { schema: GenerateLocationsInputSchema },
  output: { schema: GenerateLocationsOutputSchema },
  prompt: `You are an expert botanist and geographer specializing in Indian medicinal plants and Ayurvedic herbs.

TASK: Generate 8-12 realistic geographic locations across India where the herb "{{commonName}}"{{#if latinName}} ({{latinName}}){{/if}} can naturally be found or successfully cultivated.

{{#if currentWeather}}
Current weather context: Temperature {{currentWeather.temperature}}°C, Humidity {{currentWeather.humidity}}%, Location: {{currentWeather.location}}
{{/if}}
{{#if currentLocation}}
User's current location: {{currentLocation.lat}}, {{currentLocation.lng}}
{{/if}}

REQUIREMENTS:
1. Geographic Coverage: Spread locations across different regions of India (8°N-37°N latitude, 68°E-97°E longitude)
2. Consider traditional Ayurvedic regions: Western Ghats, Eastern Ghats, Himalayas, Vindhyas, Central India, Coastal regions
3. Climate Diversity: Include locations from different climate zones (Tropical, Subtropical, Temperate, Arid) where applicable
4. Elevation Variety: Mix lowland (0-500m), mid-elevation (500-1500m), and highland (1500m+) locations if the herb grows across ranges
5. Botanical Accuracy: Consider the herb's actual growing requirements (soil type, rainfall, temperature range)
6. Traditional Knowledge: Prioritize regions historically known for this herb in Ayurvedic texts
7. Confidence Scoring: Assign higher confidence (0.7-0.9) to well-documented regions, lower (0.5-0.7) to suitable but less verified areas

OUTPUT FORMAT:
For each location, provide:
- Exact latitude and longitude (6 decimal places)
- Region name (e.g., "Nilgiri Hills", "Aravalli Range", "Sundarbans")
- Climate type
- Elevation range
- Brief suitable conditions (1-2 sentences)
- Confidence score (0.5-0.9)

Generate locations that create a realistic density map showing where this herb is most likely to be found in India.`,
});

// Define the flow
const generateHerbLocationsFlow = ai.defineFlow(
  {
    name: 'generateHerbLocationsFlow',
    inputSchema: GenerateLocationsInputSchema,
    outputSchema: GenerateLocationsOutputSchema,
  },
  async (input) => {
    const { output } = await generateLocationsPrompt(input);
    return output!;
  }
);

// Helper function to run the flow
export async function generateHerbLocations(input: GenerateLocationsInput): Promise<GenerateLocationsOutput> {
  return generateHerbLocationsFlow(input);
}
