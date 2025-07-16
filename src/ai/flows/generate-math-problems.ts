'use server';

/**
 * @fileOverview Generates math problems from the user's history.
 *
 * - generateMathProblems - A function that generates math problems based on history.
 * - GenerateMathProblemsInput - The input type for the generateMathProblems function.
 * - GenerateMathProblemsOutput - The return type for the generateMathProblems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMathProblemsInputSchema = z.object({
  history: z
    .string()
    .describe('The history of calculations performed by the user.'),
});
export type GenerateMathProblemsInput = z.infer<typeof GenerateMathProblemsInputSchema>;

const GenerateMathProblemsOutputSchema = z.object({
  problems: z.array(z.string()).describe('An array of math problems generated from the history.'),
});
export type GenerateMathProblemsOutput = z.infer<typeof GenerateMathProblemsOutputSchema>;

export async function generateMathProblems(input: GenerateMathProblemsInput): Promise<GenerateMathProblemsOutput> {
  return generateMathProblemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMathProblemsPrompt',
  input: {schema: GenerateMathProblemsInputSchema},
  output: {schema: GenerateMathProblemsOutputSchema},
  prompt: `You are a math tutor. Generate a list of math problems based on the user's calculation history.

  History: {{{history}}}

  Make sure the problems are similar to the calculations in the history, but with different numbers.  Give different problems to challenge the user.
  Return the problems as a JSON array of strings.
  `,
});

const generateMathProblemsFlow = ai.defineFlow(
  {
    name: 'generateMathProblemsFlow',
    inputSchema: GenerateMathProblemsInputSchema,
    outputSchema: GenerateMathProblemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
