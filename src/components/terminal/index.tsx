'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { processCommand } from '@/lib/commands';
import { themes, isTheme, Theme } from '@/lib/themes';
import AsciiHeader from './ascii-header';
import Prompt, { type PromptHandle } from './prompt';
import MatrixCanvas from './matrix-canvas';
import TopBar from './top-bar';
import SystemSuspended from './system-suspended';

export type Output = {
  id: number;
  content: React.ReactNode;
  isCommand?: boolean;
  command?: string;
};

const Terminal = () => {
  const [username, setUsername] = useLocalStorage('terminal-username', 'visitor');
  const [hostname, setHostname] = useLocalStorage('terminal-hostname', 'aayush-xid-su');
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

  const focusPrompt = useCallback(() => {
    if (promptRef.current) {
      promptRef.current.focus();
    }
  }, []);

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

  const runCommand = useCallback(async (command: string) => {
    if (command.trim().toLowerCase() === 'poweron') {
        setShutdown(false);
        setOutputs([]); // Clear outputs on poweron
        addOutput(<AsciiHeader />);
        addOutput(`Type '?' or 'help' to view a list of available commands.`);
        return;
    }
    
    setCommandInProgress(true);
    addToHistory(command);
    addOutput(command, true, `${username}@${hostname}`);
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
  }, [username, hostname, playSound, addOutput, setTheme, setUsername, setSoundEnabled, setTypingSpeed, setHistory, setShutdown, typingSpeed]);
  
  const addToHistory = (command: string) => {
    if (command.trim() === '') return;
    setHistory(prev => [command, ...prev.slice(0, 499)]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    if(!commandInProgress) {
      focusPrompt();
    }
  }, [outputs, commandInProgress, focusPrompt]);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (shutdown) return;
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'l')) {
            e.preventDefault();
            runCommand('clear');
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runCommand, shutdown]);

  useEffect(() => {
    if (!shutdown) {
        if (outputs.length === 0) { // Only add initial messages if outputs are empty
            addOutput(<AsciiHeader />);
            addOutput(`Type '?' or 'help' to view a list of available commands.`);
        }
    } else {
        setOutputs([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shutdown]);

  const handlePowerOn = () => {
    runCommand('poweron');
  };

  return (
    <>
      <TopBar />
      <div
        ref={terminalRef}
        className="h-screen w-full p-4 overflow-y-auto font-mono text-foreground pt-12"
        onClick={focusPrompt}
        role="log"
        aria-live="polite"
      >
        {theme === 'matrix' && !shutdown && <MatrixCanvas />}
        
        {shutdown ? (
          <SystemSuspended onPowerOn={handlePowerOn} />
        ) : (
          <>
            {outputs.map((output) => (
              <div key={output.id} className="output-line">
                {output.isCommand ? (
                  <div className="flex">
                    <span className="text-accent">{output.command}:~$</span>
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
                  username={`${username}@${hostname}`}
                  onSubmit={runCommand}
                  history={history}
                  disabled={false}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Terminal;
