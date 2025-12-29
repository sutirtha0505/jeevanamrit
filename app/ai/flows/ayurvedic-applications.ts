'use server';

/**
 * @fileOverview A flow to provide Ayurvedic applications of an herb, if applicable.
 *
 * - provideAyurvedicApplications - A function that provides information on the Ayurvedic applications of an herb.
 * - ProvideAyurvedicApplicationsInput - The input type for the provideAyurvedicApplications function.
 * - ProvideAyurvedicApplicationsOutput - The return type for the provideAyurvedicApplications function.
 */

import {ai} from '@/app/ai/genkit';
import {z} from 'genkit';

const ProvideAyurvedicApplicationsInputSchema = z.object({
  herbName: z.string().describe('The name of the herb.'),
  herbDescription: z.string().describe('A detailed description of the herb.'),
});
export type ProvideAyurvedicApplicationsInput = z.infer<
  typeof ProvideAyurvedicApplicationsInputSchema
>;

const ProvideAyurvedicApplicationsOutputSchema = z.object({
  ayurvedicApplications: z
    .string()
    .describe('Information on how the herb can be used in Ayurvedic medicine, including preparation processes.'),
});
export type ProvideAyurvedicApplicationsOutput = z.infer<
  typeof ProvideAyurvedicApplicationsOutputSchema
>;

export async function provideAyurvedicApplications(
  input: ProvideAyurvedicApplicationsInput
): Promise<ProvideAyurvedicApplicationsOutput> {
  return provideAyurvedicApplicationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAyurvedicApplicationsPrompt',
  input: {schema: ProvideAyurvedicApplicationsInputSchema},
  output: {schema: ProvideAyurvedicApplicationsOutputSchema},
  prompt: `You are an expert in Ayurvedic medicine. Given the herb name and description, provide information on its uses and preparation processes in Ayurvedic medicine, if applicable. If the herb does not have applications in Ayurvedic medicine, respond with 'Not applicable'.

Herb Name: {{{herbName}}}
Herb Description: {{{herbDescription}}}`,
});

const provideAyurvedicApplicationsFlow = ai.defineFlow(
  {
    name: 'provideAyurvedicApplicationsFlow',
    inputSchema: ProvideAyurvedicApplicationsInputSchema,
    outputSchema: ProvideAyurvedicApplicationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
