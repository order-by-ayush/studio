'use server';

/**
 * @fileOverview A Genkit flow for fuzzy command autocompletion in a terminal emulator.
 *
 * This file exports:
 * - `fuzzyCommandAutocomplete`: The main function to perform autocompletion.
 * - `FuzzyAutocompleteInput`: The input type for the `fuzzyCommandAutocomplete` function.
 * - `FuzzyAutocompleteOutput`: The output type for the `fuzzyCommandAutocomplete` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FuzzyAutocompleteInputSchema = z.object({
  partialCommand: z
    .string()
    .describe('The partially entered command string to autocomplete.'),
  availableCommands: z.array(z.string()).describe('List of available commands.'),
});
export type FuzzyAutocompleteInput = z.infer<typeof FuzzyAutocompleteInputSchema>;

const FuzzyAutocompleteOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested commands based on the input.'),
});
export type FuzzyAutocompleteOutput = z.infer<typeof FuzzyAutocompleteOutputSchema>;

export async function fuzzyCommandAutocomplete(
  input: FuzzyAutocompleteInput
): Promise<FuzzyAutocompleteOutput> {
  return fuzzyCommandAutocompleteFlow(input);
}

const fuzzyAutocompletePrompt = ai.definePrompt({
  name: 'fuzzyAutocompletePrompt',
  input: {schema: FuzzyAutocompleteInputSchema},
  output: {schema: FuzzyAutocompleteOutputSchema},
  prompt: `You are a command line assistant helping users find commands.  Given a list of possible commands, suggest the best matches for the partial command entered by the user.  Return ONLY the array of suggestions.

Partial command: {{{partialCommand}}}
Available commands: {{availableCommands}}

Suggestions:`,
});

const fuzzyCommandAutocompleteFlow = ai.defineFlow(
  {
    name: 'fuzzyCommandAutocompleteFlow',
    inputSchema: FuzzyAutocompleteInputSchema,
    outputSchema: FuzzyAutocompleteOutputSchema,
  },
  async input => {
    const {output} = await fuzzyAutocompletePrompt(input);
    return output!;
  }
);
