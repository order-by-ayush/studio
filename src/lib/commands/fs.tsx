import React from 'react';
import { CommandContext } from './index';
import { Directory, findNode, getPath, root } from '@/lib/filesystem';

const prankFolders = ['admin', 'bin', 'etc', 'root', 'usr'];
const homeDir = findNode('home/aayush') as Directory;


export const cd = async (args: string[], { currentDirectory, setCurrentDirectory, setCurrentPath, currentPath, playSound, addOutput }: CommandContext) => {
    const path = args[0];
    if (!path || path === '~' || path === '~/') {
        setCurrentDirectory(homeDir);
        setCurrentPath('~/');
        return;
    }
    
    // Check if trying to access a prank folder from root
    if (currentPath === '/' && prankFolders.includes(path.split('/')[0])) {
         playSound('error');
         addOutput(
             <div className="text-red-500">
                 <p>YOU ARE NOT THE SUPER USER OR ADMIN OF THIS SITE</p>
                 <p>YOU NEED SUDO PRIVILEGE TO ACCESS THESE THINGS</p>
             </div>
         );
         return;
    }

    if (path === '..') {
        if (currentDirectory.parent) {
            setCurrentDirectory(currentDirectory.parent);
            setCurrentPath(getPath(currentDirectory.parent));
        }
        return;
    }

    const newNode = findNode(path, currentDirectory);

    if (newNode && newNode.type === 'directory') {
        if (prankFolders.includes(newNode.name) && newNode.parent === root) {
             playSound('error');
             addOutput(
                 <div className="text-red-500">
                     <p>YOU ARE NOT THE SUPER USER OR ADMIN OF THIS SITE</p>
                     <p>YOU NEED SUDO PRIVILEGE TO ACCESS THESE THINGS</p>
                 </div>
             );
             return;
        }
        setCurrentDirectory(newNode);
        setCurrentPath(getPath(newNode));
    } else {
        return `cd: no such file or directory: ${path}`;
    }
};

export const ls = async (args: string[], { currentDirectory }: CommandContext) => {
    const showHidden = args.includes('-a');
    let content = Object.keys(currentDirectory.children);
    if (!showHidden) {
        content = content.filter(name => !name.startsWith('.'));
    }

    return (
        <div className="grid grid-cols-3 gap-x-4">
            {content.map(name => {
                const node = currentDirectory.children[name];
                const isDir = node.type === 'directory';
                return (
                    <span key={name} className={isDir ? 'text-blue-400' : ''}>
                        {name}{isDir ? '/' : ''}
                    </span>
                );
            })}
        </div>
    );
};

export const cat = async (args: string[], { currentDirectory }: CommandContext) => {
    const filename = args[0];
    if (!filename) {
        return 'Usage: cat [filename]';
    }

    const node = currentDirectory.children[filename];

    if (!node) {
        return `cat: ${filename}: No such file or directory`;
    }

    if (node.type === 'directory') {
        return `cat: ${filename}: Is a directory`;
    }
    
    if (typeof node.content === 'function') {
        const content = node.content();
        return <pre className="whitespace-pre-wrap">{content}</pre>;
    }

    return <pre className="whitespace-pre-wrap">{node.content}</pre>;
};

export const pwd = async (args: string[], { currentPath }: CommandContext) => {
    if (currentPath.startsWith('~/')) {
        return `/home/aayush${currentPath.substring(1)}`;
    }
    if (currentPath === '~') {
        return '/home/aayush';
    }
    return currentPath;
};
