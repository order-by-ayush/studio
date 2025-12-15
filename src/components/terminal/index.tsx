
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
import ShutdownScreen from './shutdown-screen';
import PowerOnScreen from './power-on-screen';
import { cn } from '@/lib/utils';
import CommandOutput from './command-output';
import { Directory, root } from '@/lib/filesystem';

export type Output = {
  id: number;
  content: React.ReactNode;
  isCommand?: boolean;
  promptText?: string;
};

type MatrixState = {
  active: boolean;
  color: string;
};

type StopwatchState = {
  running: boolean;
  startTime: number;
  elapsed: number;
};

const Terminal = () => {
  const [username, setUsername] = useLocalStorage('terminal-username', 'visitor');
  const [hostname, setHostname] = useLocalStorage('terminal-hostname', 'aayush-xid-su');
  const [theme, setTheme] = useLocalStorage<Theme>('terminal-theme', 'matrix');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('terminal-sound', true);
  const [typingSpeed, setTypingSpeed] = useLocalStorage('terminal-speed', 20);
  const [history, setHistory] = useLocalStorage<string[]>('terminal-history', []);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [commandInProgress, setCommandInProgress] = useState(false);
  const [shutdown, setShutdown] = useLocalStorage('terminal-shutdown', false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isPoweringOn, setIsPoweringOn] = useState(false);
  const [matrix, setMatrix] = useState<MatrixState>({ active: false, color: '#0F0' });
  const [stopwatch, setStopwatch] = useState<StopwatchState>({ running: false, startTime: 0, elapsed: 0 });
  
  const [currentDirectory, setCurrentDirectory] = useState<Directory>(root);
  const [currentPath, setCurrentPath] = useState<string>('/');


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

  const addOutput = useCallback((content: React.ReactNode, isCommand?: boolean, promptText?: string) => {
    setOutputs(prev => [...prev, { id: Date.now() + Math.random(), content, isCommand, promptText }]);
  }, []);

  const showHeader = useCallback(() => {
    setOutputs([
      { id: Date.now() + Math.random(), content: <AsciiHeader /> },
      { id: Date.now() + Math.random() + 1, content: `Type '?' or 'help' to view a list of available commands.` }
    ]);
  }, []);

  const handleStartShutdown = () => {
    setIsShuttingDown(true);
  };

  const handleFinishShutdown = () => {
    setIsShuttingDown(false);
    setShutdown(true);
  };

  const handleStartPowerOn = () => {
    setShutdown(false);
    setIsPoweringOn(true);
  };

  const handleFinishPowerOn = () => {
    setIsPoweringOn(false);
    showHeader();
  };
  
  const getPromptText = useCallback(() => {
    return `${username}@${hostname}:${currentPath}$`;
}, [username, hostname, currentPath]);


  const runCommand = useCallback(async (command: string) => {
    const [cmdName, ...args] = command.trim().split(' ');
    const promptText = getPromptText();
    
    setCommandInProgress(true);
    addToHistory(command);
    addOutput(command, true, promptText);
    playSound('enter');
    
    const context = {
      command,
      username,
      addOutput: (content: React.ReactNode) => addOutput(<CommandOutput content={content} typingSpeed={typingSpeed} />),
      clearOutputs: () => setOutputs([]),
      setTheme,
      setUsername,
      setSoundEnabled,
      setTypingSpeed,
      clearHistory: () => setHistory([]),
      setShutdown: handleStartShutdown,
      playSound,
      typingSpeed,
      setMatrix,
      setStopwatch,
      currentDirectory,
      setCurrentDirectory,
      currentPath,
      setCurrentPath
    };

    await processCommand(cmdName, args, context);
    
    if (cmdName.toLowerCase() === 'clear') {
       showHeader();
    }
    
    setCommandInProgress(false);
  }, [getPromptText, playSound, addOutput, typingSpeed, setTheme, setUsername, setSoundEnabled, setTypingSpeed, setHistory, showHeader, currentDirectory, currentPath]);
  
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

  // Stopwatch timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stopwatch.running) {
      interval = setInterval(() => {
        setStopwatch(prev => ({ ...prev, elapsed: Date.now() - prev.startTime }));
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stopwatch.running]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (matrix.active) {
                e.preventDefault();
                setMatrix({ active: false, color: '#0F0' });
                return;
            }
            if (stopwatch.running) {
                e.preventDefault();
                const finalTime = ((Date.now() - stopwatch.startTime) / 1000).toFixed(2);
                setStopwatch({ running: false, startTime: 0, elapsed: 0 });
                addOutput(`Stopwatch stopped. Final time: ${finalTime}s`);
                return;
            }
        }
        if (shutdown || matrix.active || stopwatch.running) return;
        if ((e.ctrlKey || e.metaKey) && (e.key === 'l')) {
            e.preventDefault();
            setOutputs([]);
            showHeader();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shutdown, showHeader, matrix.active, stopwatch, addOutput]);

  useEffect(() => {
    if (shutdown) {
      setOutputs([]);
    } else if (!isPoweringOn && !isShuttingDown && outputs.length === 0) {
      showHeader();
    }
  }, [shutdown, isPoweringOn, isShuttingDown, outputs.length, showHeader]);
  
  if (matrix.active) {
    return <MatrixCanvas color={matrix.color} />;
  }

  return (
    <>
      <TopBar />
      <div
        ref={terminalRef}
        className={cn("h-screen w-full p-4 overflow-y-auto font-mono text-foreground pt-12 transition-all duration-300", (shutdown || isShuttingDown || isPoweringOn) && 'backdrop-blur-sm')}
        onClick={focusPrompt}
        role="log"
        aria-live="polite"
      >
        {isPoweringOn ? (
          <PowerOnScreen onFinished={handleFinishPowerOn} />
        ) : isShuttingDown ? (
          <ShutdownScreen onFinished={handleFinishShutdown} playSound={() => playSound('enter')} />
        ) : shutdown ? (
          <SystemSuspended onPowerOn={handleStartPowerOn} />
        ) : (
          <>
            {outputs.map((output) => (
              <div key={output.id} className="output-line mb-2">
                {output.isCommand ? (
                  <div className="flex">
                    <span className="text-primary">{output.promptText}</span>
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
                  promptText={getPromptText()}
                  onSubmit={runCommand}
                  history={history}
                  disabled={stopwatch.running}
              />
            )}
            {stopwatch.running && (
                <div className="fixed bottom-4 left-4 bg-background border border-accent p-2 rounded">
                    Stopwatch: {(stopwatch.elapsed / 1000).toFixed(2)}s (Press ESC to stop)
                </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Terminal;
