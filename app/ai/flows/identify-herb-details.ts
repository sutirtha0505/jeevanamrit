
'use server';

/**
 * @fileOverview An AI agent that identifies an herb from an image and provides details about it.
 *
 * - identifyHerbAndProvideDetails - A function that handles the herb identification and detail retrieval process.
 * - IdentifyHerbAndProvideDetailsInput - The input type for the identifyHerbAndProvideDetails function.
 * - IdentifyHerbAndProvideDetailsOutput - The return type for the identifyHerbAndProvideDetails function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const IdentifyHerbAndProvideDetailsInputSchema = z.object({
  herbPhotoDataUri: z
    .string()
    .describe(
      "A photo of an herb, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  locationDescription: z
    .string()
    .optional()
    .describe('A description of the location where the herb was found.'),
  weatherDescription: z
    .string()
    .optional()
    .describe('A description of the weather conditions when the herb was found.'),
});
export type IdentifyHerbAndProvideDetailsInput = z.infer<
  typeof IdentifyHerbAndProvideDetailsInputSchema
>;

const IdentifyHerbAndProvideDetailsOutputSchema = z.object({
  identification: z.object({
    commonName: z.string().describe('The most common, well-known name of the identified herb.'),
    latinName: z.string().describe('The Latin name of the identified herb.'),
    confidenceLevel: z
      .number()
      .describe('A confidence level (0-1) of the identification.'),
  }),
  details: z.object({
    uses: z.string().describe('The uses of the herb.'),
    cultivation: z.string().describe('How to cultivate the herb.'),
    origin: z.string().describe('The region of origin of the herb.'),
    medicinalProperties: z.string().optional().describe('The medicinal properties of the herb.'),
    cultivationMethods: z.string().optional().describe('The cultivation methods of the herb.'),
    preservationTechniques: z.string().optional().describe('The preservation techniques for the herb.'),
    ayurvedicApplication: z.string().optional().describe('How the herb can be used in Ayurvedic medicine, including preparation processes.'),
    chemicalConstituents: z.array(z.string()).optional().describe('A list of major chemical constituents found in the herb.'),
    history: z.string().optional().describe('The historical background and significance of the herb.'),
    ancientUses: z.string().optional().describe('The ancient or traditional uses of the herb, particularly in folklore or early medicine.'),
    medicinalPreparations: z.string().optional().describe('How the herb is traditionally prepared and taken as medicine (e.g., decoction, tincture, poultice).'),
  }),
});
export type IdentifyHerbAndProvideDetailsOutput = z.infer<
  typeof IdentifyHerbAndProvideDetailsOutputSchema
>;

export async function identifyHerbAndProvideDetails(
  input: IdentifyHerbAndProvideDetailsInput
): Promise<IdentifyHerbAndProvideDetailsOutput> {
  return identifyHerbAndProvideDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyHerbAndProvideDetailsPrompt',
  input: {schema: IdentifyHerbAndProvideDetailsInputSchema},
  output: {schema: IdentifyHerbAndProvideDetailsOutputSchema},
  prompt: `You are an expert botanist specializing in herb identification and providing detailed information about herbs.

You will use the provided image and any additional information to identify the herb and provide details about its uses, cultivation, and origin.

Identify the herb in the photo:
{{media url=herbPhotoDataUri}}

Location description: {{locationDescription}}
Weather description: {{weatherDescription}}

Provide the following information about the identified herb:
- Common name (the most well-known, common name, not a formal name)
- Latin name
- Confidence level (0-1)
- Uses
- Cultivation
- Origin
- Medicinal properties (if applicable)
- Major chemical constituents (as a list of strings, if applicable)
- Cultivation methods (if applicable)
- Preservation techniques (if applicable)
- Ayurvedic application, including preparation processes (if applicable)
- Historical background and significance (if applicable)
- Ancient uses from folklore or early medicine (if applicable)
- How the herb is traditionally prepared and taken as a medicine (e.g., decoction, tincture, poultice, if applicable)
`,
});

const identifyHerbAndProvideDetailsFlow = ai.defineFlow(
  {
    name: 'identifyHerbAndProvideDetailsFlow',
    inputSchema: IdentifyHerbAndProvideDetailsInputSchema,
    outputSchema: IdentifyHerbAndProvideDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
