import React from 'react';
import { staticCommands } from './static';
import * as apiCmds from './api';
import * as dynamicCmds from './dynamic';
import { themes, isTheme, Theme } from '@/lib/themes';
import Typewriter from '@/components/terminal/typewriter';
import CommandOutput from '@/components/terminal/command-output';

type CommandContext = {
    command: string;
    username: string;
    addOutput: (content: React.ReactNode, isCommand?: boolean, command?: string) => void;
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
};

type CommandHandler = (args: string[], context: CommandContext) => Promise<React.ReactNode | string>;

const commands: Record<string, CommandHandler> = {
    ...staticCommands,
    ...apiCmds,
    ...dynamicCmds,
};

export const commandList = Object.keys(commands);

const showError = (cmd: string, context: CommandContext) => {
    context.playSound('error');
    return `Command not found: ${cmd}. Type 'help' for a list of commands.`;
}

export const processCommand = async (context: CommandContext) => {
    const { command: fullCommand, addOutput, typingSpeed } = context;
    const [cmd, ...args] = fullCommand.trim().toLowerCase().split(' ').filter(Boolean);

    if (!cmd) {
        return;
    }
    
    const handler = commands[cmd];

    if (!handler) {
        const outputContent = showError(cmd, context);
        addOutput(<CommandOutput content={outputContent} typingSpeed={typingSpeed} />);
        return;
    }

    try {
        const outputContent = await handler(args, context);
        if(outputContent) {
           addOutput(<CommandOutput content={outputContent} typingSpeed={typingSpeed} />);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const outputContent = `Error executing '${cmd}': ${errorMessage}`;
        addOutput(<CommandOutput content={outputContent} typingSpeed={typingSpeed} />);
        context.playSound('error');
    }
};
