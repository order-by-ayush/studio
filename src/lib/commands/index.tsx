import React from 'react';
import { staticCommands } from './static';
import * as apiCmds from './api';
import * as dynamicCmds from './dynamic';

type MatrixState = {
    active: boolean;
    color: string;
};

type StopwatchState = {
    running: boolean;
    startTime: number;
    elapsed: number;
};

type CommandContext = {
    command: string;
    username: string;
    addOutput: (content: React.ReactNode) => void;
    clearOutputs: () => void;
    setTheme: (theme: string) => void;
    setUsername: (username: string) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setTypingSpeed: (speed: number) => void;
    clearHistory: () => void;
    setShutdown: (shutdown: boolean) => void;
    playSound: (type: 'enter' | 'error') => void;
    typingSpeed: number;
    showStartupMessages?: () => void;
    setMatrix: React.Dispatch<React.SetStateAction<MatrixState>>;
    setStopwatch: React.Dispatch<React.SetStateAction<StopwatchState>>;
};

type CommandHandler = (args: string[], context: CommandContext) => Promise<React.ReactNode | string | void>;

const commands: Record<string, CommandHandler> = {
    ...staticCommands,
    ...apiCmds,
    ...dynamicCmds,
};

export const commandList = Object.keys(commands).filter(c => c !== '?'); // Exclude alias from the main list

const showError = (cmd: string, context: CommandContext) => {
    context.playSound('error');
    return `Command not found: ${cmd}. Type 'help' for a list of commands.`;
}

export const processCommand = async (cmd: string, args: string[], context: CommandContext) => {
    const { addOutput } = context;

    if (!cmd) {
        return;
    }
    
    const handler = commands[cmd.toLowerCase()];

    if (!handler) {
        const outputContent = showError(cmd, context);
        addOutput(outputContent);
        return;
    }

    try {
        const outputContent = await handler(args, context);
        if(outputContent) {
           addOutput(outputContent);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const outputContent = `Error executing '${cmd}': ${errorMessage}`;
        addOutput(outputContent);
        context.playSound('error');
    }
};
