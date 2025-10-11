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
  availableCommands: z.record(z.string()).describe('A map of available commands to their descriptions.'),
});
export type FuzzyAutocompleteInput = z.infer<typeof FuzzyAutocompleteInputSchema>;

const FuzzyAutocompleteOutputSchema = z.object({
  suggestions: z
    .array(z.object({
        command: z.string().describe('The suggested command.'),
        description: z.string().describe('A brief description of the command.'),
    }))
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
  prompt: `You are a command line assistant helping users find commands. Given a list of possible commands and their descriptions, suggest the best matches for the partial command entered by the user. Return an array of suggestion objects, each with a command and its description.

Partial command: {{{partialCommand}}}
Available commands and descriptions:
{{#each availableCommands}}
- {{this.name}}: {{this.description}}
{{/each}}

Respond with the JSON object containing the suggestions.`,
});

const fuzzyCommandAutocompleteFlow = ai.defineFlow(
  {
    name: 'fuzzyCommandAutocompleteFlow',
    inputSchema: FuzzyAutocompleteInputSchema,
    outputSchema: FuzzyAutocompleteOutputSchema,
  },
  async input => {
    // Format for prompt
    const promptInput = {
        ...input,
        availableCommands: Object.entries(input.availableCommands).map(([name, description]) => ({name, description}))
    };

    const {output} = await fuzzyAutocompletePrompt(promptInput);
    return output!;
  }
);
