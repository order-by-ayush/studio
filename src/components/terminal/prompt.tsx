'use client';
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { fuzzyCommandAutocomplete } from '@/ai/flows/fuzzy-command-autocomplete';
import { commandList } from '@/lib/commands';

interface PromptProps {
  username: string;
  onSubmit: (command: string) => void;
  history: string[];
  disabled?: boolean;
}

export interface PromptHandle {
  focus: () => void;
}

const Prompt = forwardRef<PromptHandle, PromptProps>(({ username, onSubmit, history, disabled }, ref) => {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    setInput(e.currentTarget.textContent || '');
    setSuggestion('');
  };

  const setCursorToEnd = () => {
    if (inputRef.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(inputRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      if (e.key === 'Enter') {
          if (input.trim().toLowerCase() === 'poweron') {
              onSubmit('poweron');
              setInput('');
          }
          e.preventDefault();
      }
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      let commandToSubmit = input;
      if (suggestion && input.trim() !== '') {
        commandToSubmit = suggestion;
      }
      onSubmit(commandToSubmit);
      setInput('');
      setSuggestion('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        setSuggestion('');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        setSuggestion('');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
        setSuggestion('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion('');
        setTimeout(setCursorToEnd, 0);
      } else if (input.trim()) {
        const { suggestions } = await fuzzyCommandAutocomplete({
          partialCommand: input,
          availableCommands: commandList,
        });
        if (suggestions && suggestions.length > 0) {
          setSuggestion(suggestions[0]);
        }
      }
    } else if (e.key === 'Escape') {
      setInput('');
      setSuggestion('');
    } else if (e.key.length === 1 || e.key === 'Backspace') {
      setSuggestion('');
    }
  };

  useEffect(() => {
    if (inputRef.current && inputRef.current.textContent !== input) {
      inputRef.current.textContent = input;
      setCursorToEnd();
    }
  }, [input]);

  return (
    <div className="flex w-full" aria-label="Command input">
      <span className="text-accent shrink-0">[{username}@terminal:~$]</span>
      <div className="relative flex-grow pl-2">
        <div
          ref={inputRef}
          contentEditable={!disabled}
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent focus:outline-none z-10 relative"
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
      </div>
      {!disabled && <span className="cursor-blink bg-foreground w-2 h-[1.2em] inline-block ml-1"></span>}
    </div>
  );
});

Prompt.displayName = 'Prompt';

export default Prompt;
