'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { processCommand } from '@/lib/commands';
import { themes, isTheme, Theme } from '@/lib/themes';
import AsciiHeader from './ascii-header';
import Prompt, { type PromptHandle } from './prompt';
import MatrixCanvas from './matrix-canvas';

export type Output = {
  id: number;
  content: React.ReactNode;
  isCommand?: boolean;
  command?: string;
};

const Terminal = () => {
  const [username, setUsername] = useLocalStorage('terminal-username', 'guest');
  const [theme, setTheme] = useLocalStorage<Theme>('terminal-theme', 'hacker');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('terminal-sound', true);
  const [typingSpeed, setTypingSpeed] = useLocalStorage('terminal-speed', 20);
  const [history, setHistory] = useLocalStorage<string[]>('terminal-history', []);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [commandInProgress, setCommandInProgress] = useState(false);
  const [shutdown, setShutdown] = useLocalStorage('terminal-shutdown', false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<PromptHandle>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'enter' | 'error') => {
    if (!soundEnabled || !window.AudioContext) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const audioCtx = audioCtxRef.current;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(type === 'enter' ? 440 : 220, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }, [soundEnabled]);

  const addOutput = useCallback((content: React.ReactNode, isCommand?: boolean, command?: string) => {
    setOutputs(prev => [...prev, { id: Date.now() + Math.random(), content, isCommand, command }]);
  }, []);

  const runCommand = async (command: string) => {
    if (shutdown) return;
    
    setCommandInProgress(true);
    addToHistory(command);
    addOutput(command, true, username);
    playSound('enter');
    
    await processCommand({
      command,
      username,
      addOutput,
      clearOutputs: () => setOutputs([]),
      setTheme: (newTheme) => {
        if (isTheme(newTheme)) setTheme(newTheme);
      },
      setUsername,
      setSoundEnabled,
      setTypingSpeed,
      clearHistory: () => setHistory([]),
      setShutdown,
      playSound,
      typingSpeed
    });
    
    setCommandInProgress(false);
  };
  
  const addToHistory = (command: string) => {
    if (command.trim() === '') return;
    setHistory(prev => [command, ...prev.slice(0, 499)]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputs]);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'l')) {
            e.preventDefault();
            runCommand('clear');
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!shutdown) {
      addOutput(<AsciiHeader />);
      addOutput(`Initializing terminal... Welcome to Ayush's Portfolio.`);
      addOutput('Type "help" for a list of available commands.');
    } else {
      addOutput("System is shut down. Type 'poweron' to restart.");
    }
  }, []);


  const handleTerminalClick = () => {
    if (promptRef.current) {
      promptRef.current.focus();
    }
  };

  return (
    <div
      ref={terminalRef}
      className="h-screen w-full p-4 overflow-y-auto font-mono text-foreground"
      onClick={handleTerminalClick}
      role="log"
      aria-live="polite"
    >
      {theme === 'matrix' && <MatrixCanvas />}
      
      {outputs.map((output) => (
        <div key={output.id} className="output-line">
          {output.isCommand ? (
            <div className="flex">
              <span className="text-accent">[{output.command}@terminal:~$]</span>
              <span className="flex-1 pl-2">{output.content}</span>
            </div>
          ) : (
            output.content
          )}
        </div>
      ))}
      
      {!commandInProgress && (
        <Prompt
            ref={promptRef}
            username={username}
            onSubmit={runCommand}
            history={history}
            disabled={shutdown}
        />
      )}
      
      <div className="text-center text-xs text-muted-foreground mt-8">
        Permissions (e.g., location) require explicit consent. No data is stored or shared. This is an educational demonstration.
      </div>
    </div>
  );
};

export default Terminal;
