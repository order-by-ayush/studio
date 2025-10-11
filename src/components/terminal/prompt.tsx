'use client';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { fuzzyCommandAutocomplete } from '@/ai/flows/fuzzy-command-autocomplete';
import { commandList } from '@/lib/commands';

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
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);
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
        availableCommands: commandList,
      });
      if (suggestions && suggestions.length > 0) {
        setSuggestion(suggestions[0]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setInput(newText);
    
    if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
    }
    
    suggestionTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newText);
    }, 150); // debounce requests
  };

  const setCursorToEnd = () => {
    if (inputRef.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      if (inputRef.current.childNodes.length > 0) {
        const textNode = inputRef.current.childNodes[0];
        // Ensure the range does not exceed the length of the text node
        range.setStart(textNode, Math.min(input.length, textNode.length));
      } else {
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
      }
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };


  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      let commandToSubmit = input;
      // Use the full suggestion if tab hasn't been pressed but there's a suggestion.
      if (suggestion && input.trim() !== '') {
        commandToSubmit = suggestion;
      }
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
        setTimeout(setCursorToEnd, 0);
      }
    } else if (e.key === 'Escape') {
      setInput('');
      setSuggestion('');
      setAutocompleteSuggestions([]);
    } else if (e.key.length !== 1 && e.key !== 'Backspace') {
       // Not a character key, do nothing with suggestions
    }
  };

  useEffect(() => {
    if (inputRef.current && inputRef.current.textContent !== input) {
      inputRef.current.textContent = input;
      setCursorToEnd();
    }
  }, [input]);

  useEffect(() => {
    return () => {
        if(suggestionTimeoutRef.current) {
            clearTimeout(suggestionTimeoutRef.current);
        }
    }
  }, [])

  return (
    <div>
        <div className="flex w-full items-center" aria-label="Command input">
        <span className="text-green-500 shrink-0">{promptText}</span>
        <div className="relative flex-grow pl-2">
            <div
            ref={inputRef}
            contentEditable={!disabled}
            onInput={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent focus:outline-none z-10 relative caret-transparent"
            aria-label="command-input"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            />
            {suggestion && input && (
            <div className="absolute top-0 left-2 text-muted-foreground pointer-events-none">
                <span className="text-transparent">{input}</span>
                <span>{suggestion.substring(input.length)}</span>
            </div>
            )}
            {!disabled && (
            <span
                className="absolute top-0 left-2 pointer-events-none"
                style={{ transform: `translateX(${input.length}ch)` }}
            >
                <span className="cursor-blink bg-foreground w-2 h-[1.2em] inline-block"></span>
            </span>
            )}
        </div>
        </div>
        {autocompleteSuggestions.length > 0 && input.trim() && (
            <div className="pl-2 mt-1 text-muted-foreground text-sm">
                Suggestions: {autocompleteSuggestions.join(' | ')}
            </div>
        )}
    </div>
  );
});

Prompt.displayName = 'Prompt';

export default Prompt;
