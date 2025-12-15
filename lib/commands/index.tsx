
import React from 'react';
import { staticCommands } from './static';
import * as apiCmds from './api';
import * as dynamicCmds from './dynamic';
import * as fsCmds from './fs';
import { sysinfo } from './sysinfo';
import { Directory } from 'lib/filesystem';
import { Theme } from 'lib/themes';
import { fuzzyCommandAutocomplete } from 'ai/flows/fuzzy-command-autocomplete';
import { commandDescriptions } from './static';

type MatrixState = {
    active: boolean;
    color: string;
};

type StopwatchState = {
    running: boolean;
    startTime: number;
    elapsed: number;
};

export type CommandContext = {
    command: string;
    username: string;
    addOutput: (content: React.ReactNode) => void;
    clearOutputs: () => void;
    setTheme: (theme: Theme) => void;
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
    currentDirectory: Directory;
    setCurrentDirectory: (dir: Directory) => void;
    currentPath: string;
    setCurrentPath: (path: string) => void;
};

type CommandHandler = (args: string[], context: CommandContext) => Promise<React.ReactNode | string | void>;

const forbiddenCommands = ['sudo', 'passwd', 'su', 'useradd', 'adduser', 'chmod', 'install', 'rm'];

const ai = async (args: string[]) => {
    const partialCommand = args.join(' ');
    if (!partialCommand) {
        return 'Usage: ai [partial command]';
    }
    try {
        const { suggestions } = await fuzzyCommandAutocomplete({
            partialCommand,
            availableCommands: commandDescriptions,
        });

        if (!suggestions || suggestions.length === 0) {
            return 'No suggestions found.';
        }

        return (
            <div>
                <p>AI Suggestions for "{partialCommand}":</p>
                {suggestions.map((s, i) => (
                    <p key={i}>- {s.command}: {s.description}</p>
                ))}
            </div>
        );
    } catch (error: any) {
        console.error(error);
        if (error.message && error.message.includes('429')) {
             return 'Error: You have exceeded the API quota for AI suggestions. Please check your plan and billing details.';
        }
        return 'An error occurred while fetching AI suggestions.';
    }
};


const commands: Record<string, CommandHandler> = {
    ...staticCommands,
    ...apiCmds,
    ...dynamicCmds,
    ...fsCmds,
    sysinfo,
    ai,
};

export const commandList = Object.keys(commands).filter(c => c !== '?'); // Exclude alias from the main list

const showError = (cmd: string, context: CommandContext) => {
    context.playSound('error');
    return `Command not found: ${cmd}. Type 'help' for a list of commands.`;
}

export const processCommand = async (cmd: string, args: string[], context: CommandContext) => {
    const { addOutput, playSound } = context;

    if (!cmd) {
        return;
    }
    
    const lowerCmd = cmd.toLowerCase();

    if (forbiddenCommands.includes(lowerCmd)) {
        addOutput(<span style={{ color: 'red' }}>You don't have permission to use this command.</span>);
        playSound('error');
        return;
    }
    

    let handler = commands[lowerCmd];

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
        playSound('error');
    }
};
