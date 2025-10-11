'use client';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { fuzzyCommandAutocomplete, FuzzyAutocompleteOutput } from '@/ai/flows/fuzzy-command-autocomplete';
import { commandDescriptions } from '@/lib/commands/static';
import { cn } from '@/lib/utils';

interface PromptProps {
  promptText: string;
  onSubmit: (command: string) => void;
  history: string[];
  disabled?: boolean;
}

export interface PromptHandle {
  focus: () => void;
}

const Prompt = forwardRef<PromptHandle, PromptProps>(({ promptText, onSubmit, history, disabled }, ref) => {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<FuzzyAutocompleteOutput['suggestions']>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const fetchSuggestions = useCallback(async (partialCommand: string) => {
    if (!partialCommand) {
      setAutocompleteSuggestions([]);
      setSuggestion('');
      return;
    }
    try {
      const { suggestions } = await fuzzyCommandAutocomplete({
        partialCommand,
        availableCommands: commandDescriptions,
      });
      if (suggestions && suggestions.length > 0) {
        setSuggestion(suggestions[0].command);
        setAutocompleteSuggestions(suggestions.slice(0, 3));
      } else {
        setSuggestion('');
        setAutocompleteSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestion('');
      setAutocompleteSuggestions([]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.currentTarget.value || '';
    setInput(newText);
    
    if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
    }
    
    suggestionTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newText);
    }, 150); // debounce requests
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const commandToSubmit = suggestion && input.trim() !== '' ? suggestion : input;
      onSubmit(commandToSubmit);
      setInput('');
      setSuggestion('');
      setAutocompleteSuggestions([]);
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        setSuggestion('');
        setAutocompleteSuggestions([]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        setSuggestion('');
        setAutocompleteSuggestions([]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
        setSuggestion('');
        setAutocompleteSuggestions([]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion('');
        setAutocompleteSuggestions([]);
      }
    } else if (e.key === 'Escape') {
      setInput('');
      setSuggestion('');
      setAutocompleteSuggestions([]);
    }
  };

  useEffect(() => {
    return () => {
        if(suggestionTimeoutRef.current) {
            clearTimeout(suggestionTimeoutRef.current);
        }
    }
  }, [])

  return (
    <div>
      <div className="flex w-full items-center" aria-label="Command input" onClick={() => inputRef.current?.focus()}>
        <span className="text-green-500 shrink-0">{promptText}</span>
        <div className="relative flex-grow pl-2 flex items-center">
            <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={cn("bg-transparent focus:outline-none z-10 relative w-full", disabled ? 'caret-transparent' : '')}
            aria-label="command-input"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={disabled}
            />
            {suggestion && input && (
            <div className="absolute top-0 left-2 text-muted-foreground pointer-events-none">
                <span className="text-transparent">{input}</span>
                <span>{suggestion.substring(input.length)}</span>
            </div>
            )}
        </div>
      </div>
      {autocompleteSuggestions.length > 0 && input.trim() && (
          <div className="pl-2 mt-1 text-muted-foreground text-sm">
              <div>Suggestions:</div>
              {autocompleteSuggestions.map(s => (
                  <div key={s.command}>- {s.command}: {s.description}</div>
              ))}
          </div>
      )}
    </div>
  );
});

Prompt.displayName = 'Prompt';

export default Prompt;
