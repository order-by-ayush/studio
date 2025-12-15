
'use client';

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
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
  const [suggestion, setSuggestion] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const getSuggestion = useCallback((currentInput: string) => {
    if (!currentInput) return '';
    const matchingCommand = commandList.find(c => c.startsWith(currentInput.toLowerCase()));
    return matchingCommand || '';
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.currentTarget.value || '';
    setInput(newText);
    setSuggestion(getSuggestion(newText));
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const commandToSubmit = input.trim();
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
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
        if (suggestion && input) {
            e.preventDefault();
            setInput(suggestion);
            setSuggestion('');
        }
    } else if (e.key === 'Escape') {
      setInput('');
      setSuggestion('');
    }
  };

  return (
    <div>
      <div className="flex w-full items-center" aria-label="Command input" onClick={() => inputRef.current?.focus()}>
        <span className="text-primary shrink-0">{promptText}</span>
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
    </div>
  );
});

Prompt.displayName = 'Prompt';

export default Prompt;
