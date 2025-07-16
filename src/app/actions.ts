'use server';

import { generateMathProblems, GenerateMathProblemsInput } from '@/ai/flows/generate-math-problems';

export async function getMathProblems(history: string[]): Promise<string[]> {
  if (history.length === 0) {
    return ["Perform some calculations first to get personalized problems!"];
  }

  const input: GenerateMathProblemsInput = {
    history: history.join('\n'),
  };

  try {
    const result = await generateMathProblems(input);
    return result.problems;
  } catch (error) {
    console.error('An error occurred while generating math problems. This might be due to a missing or invalid API key.');
    console.error('Full error details:', error);
    return ['Sorry, there was an error generating problems. Please check the server logs for more details.'];
  }
}
