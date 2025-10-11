import React from 'react';
import { isTheme, themes } from '@/lib/themes';
import { commandList } from './index';
import { manPages } from './manpages';
import { findNode, root } from '@/lib/filesystem';

export const commandDescriptions: Record<string, string> = {
  '?': 'Alias for help.',
  'help': 'Show available commands or details for a specific command. Usage: help [command]',
  'ayush': 'Opens my personal portfolio website in a new tab.',
  'age': 'Calculate age from a given date. Usage: age YYYY-MM-DD',
  'ascii': 'Convert text to ASCII art. Usage: ascii [text] [font?]',
  'asciiqr': 'Generate an ASCII QR code from text. Usage: asciiqr [text]',
  'base64': 'Encode or decode text using Base64. Usage: base64 [encode|decode] [text]',
  'calendar': 'Display a calendar for the current month or a specified month/year. Usage: calendar [month year?]',
  'cat': 'Display content of a file. Usage: cat [filename]',
  'cd': 'Change directory. Usage: cd [directory]',
  'clear': 'Clear the terminal screen, history, or both. Usage: clear [screen|history|both]',
  'coin': 'Flip a virtual coin.',
  'commands': 'Show a detailed list of all commands with descriptions.',
  'contact': 'Display my contact information.',
  'countdays': 'Count days from today to a specific date. Usage: countdays YYYY-MM-DD',
  'country': 'Get information about a country. Usage: country [name?]',
  'curl': 'Fetch and display the content of a URL. Usage: curl [url]',
  'date': 'Display the current date and time.',
  'dice': 'Roll a virtual dice. Usage: dice [sides?]',
  'dns': 'Perform a DNS lookup for a domain. Usage: dns [domain]',
  'dnslookup': 'Alias for dns.',
  'geo': 'Get address from latitude and longitude. Usage: geo [lat,lon]',
  'github': 'Show GitHub profile information. Usage: github [username?]',
  'hash': 'Generate a SHA-256 hash of a text. Usage: hash [text]',
  'history': 'Show command history. Usage: history [count?]',
  'ip': 'Get information about an IP address. Usage: ip [address?]',
  'json': 'Fetch and pretty-print JSON from a URL. Usage: json [url]',
  'ls': 'List files and directories. Usage: ls [-a]',
  'man': 'Display the manual page for a command. Usage: man [command]',
  'matrix': 'Toggle the matrix animation background.',
  'ping': 'Measure latency to a URL. Usage: ping [url]',
  'pwd': 'Print working directory.',
  'qr': 'Generate a QR code image from text. Usage: qr [text]',
  'remind': 'Set a reminder. Usage: remind [seconds] [message]',
  'reset': 'Reset terminal settings and reload.',
  'resume': 'Displays my resume.',
  'rps': 'Play Rock, Paper, Scissors. Usage: rps [rock|paper|scissors]',
  'set': 'Configure terminal options. Usage: set <option> [value]',
  'shorten': 'Shorten a URL using TinyURL. Usage: shorten [url]',
  'shutdown': 'Shuts down the terminal interface.',
  'social': 'Display links to my social media profiles.',
  'stopwatch': 'A simple stopwatch. Usage: stopwatch [start|stop]',
  'sysinfo': 'Displays detailed system and IP information.',
  'theme': 'List available themes. Use "set theme <name>" to change.',
  'time': 'Display the current time or time in a specific timezone. Usage: time [timezone?]',
  'timer': 'Set a countdown timer. Usage: timer [seconds|hh:mm:ss]',
  'uptime': 'Show terminal session uptime.',
  'username': 'View the current terminal username.',
  'uuid': 'Generate a random UUID.',
  'weather': 'Show weather for your location or a city. Usage: weather [city?]',
  'whoami': 'Display current user and system info.',
  'about': 'Displays my biography, education, and skills.',
  'projects': 'Showcase of my key projects.'
};

export const help = async (args: string[]) => {
  if (args.length > 0) {
    const cmd = args[0].toLowerCase();
    if (commandDescriptions[cmd]) {
      return `Usage: ${commandDescriptions[cmd]}`;
    }
    return `Command not found: ${cmd}`;
  }

  const allCommands = commandList.sort();
  const maxLength = 12;
  const numColumns = 8;
  const numRows = Math.ceil(allCommands.length / numColumns);
  let output = 'Available commands:\n';
  const columns: string[][] = Array(numColumns).fill(0).map(() => []);

  for (let i = 0; i < allCommands.length; i++) {
    columns[i % numColumns].push(allCommands[i]);
  }

  const flattened = columns.reduce((acc, val) => acc.concat(val), []);
  
  let resultGrid = '';
  for (let i = 0; i < numRows; i++) {
    let row = '';
    for (let j = 0; j < numColumns; j++) {
      const index = j * numRows + i;
      if (flattened[index]) {
         row += flattened[index].padEnd(maxLength);
      }
    }
    resultGrid += row + '\n';
  }


  return (
    <div>
      <pre className="whitespace-pre-wrap">{resultGrid}</pre>
      <p className="mt-2">Type 'help [command]' for more details on a specific command.</p>
      <p>Type 'commands' to see a list with descriptions.</p>
      <p>Type 'man [command]' to see a detailed manual for a command.</p>
       <div className="mt-2">
        <p>Available folders: home, admin, bin, etc, usr, root</p>
        <p>Use `cd`, `ls`, and `cat` to explore.</p>
      </div>
    </div>
  );
};

export const man = async (args: string[]) => {
  if (args.length === 0) {
    return 'What manual page do you want?';
  }
  const cmd = args[0].toLowerCase();
  const page = manPages[cmd];

  if (!page) {
    return `No manual entry for ${cmd}`;
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="font-bold text-accent">NAME</p>
        <p className="ml-4">{page.name} - {page.description}</p>
      </div>
      <div>
        <p className="font-bold text-accent">SYNOPSIS</p>
        <p className="ml-4 font-mono">{page.usage}</p>
      </div>
      <div>
        <p className="font-bold text-accent">DESCRIPTION</p>
        <p className="ml-4 whitespace-pre-wrap">{page.longDescription}</p>
      </div>
      {page.example && (
         <div>
          <p className="font-bold text-accent">EXAMPLE</p>
          <div className="ml-4">
            <p>The following command:</p>
            <pre className="p-2 my-1 bg-muted rounded font-mono text-sm whitespace-pre-wrap">> {page.example.command}</pre>
            <p>Will produce the following output:</p>
            <pre className="p-2 my-1 bg-muted rounded font-mono text-sm whitespace-pre-wrap">{page.example.output}</pre>
          </div>
        </div>
      )}
    </div>
  );
};


export const commands = async () => {
    const allCommands = commandList.sort();
    const maxLength = Math.max(...allCommands.map(cmd => cmd.length));
    const commandDetails = allCommands.map(cmd => {
      const description = commandDescriptions[cmd]?.split('.')[0] || 'No description available.';
      return `${cmd.padEnd(maxLength + 4)}${description}`;
    }).join('\n');
    
    return (
        <div>
            <p>Available commands:</p>
            <pre className="mt-2 whitespace-pre-wrap">{commandDetails}</pre>
        </div>
    );
};

export const ayush = async () => {
    if (typeof window !== 'undefined') {
        window.open('https://ayush11profile.netlify.app/', '_blank');
    }
    return 'Opening portfolio...';
};

const getFileContent = (path: string) => {
    const node = findNode(path, root);
    if (node && node.type === 'file') {
        if (typeof node.content === 'function') {
            return (node.content as () => React.ReactNode)();
        }
        return <pre className="whitespace-pre-wrap">{node.content}</pre>;
    }
    return `Error: File not found at ${path}`;
}

export const about = async () => {
    return getFileContent('home/aayush/about.md');
};

export const resume = async () => {
    return getFileContent('home/aayush/resume.md');
};

export const contact = async () => {
  return (
    <div>
      <p>You can reach me via:</p>
      <p>- Email: <a href="mailto:aayushxidsu.11am@gmail.com" className="text-accent underline">aayushxidsu.11am@gmail.com</a></p>
      <p>- Mobile: +91 7894038559</p>
      <p>- LinkedIn: <a href="https://linkedin.com/in/ayushdas-11am" target="_blank" rel="noopener noreferrer" className="text-accent underline">https://linkedin.com/in/ayushdas-11am</a></p>
    </div>
  );
};

export const projects = async () => {
    return getFileContent('home/aayush/projects.md');
};

export const social = async (args: string[]) => {
    const socialLinks: Record<string, string> = {
        'linkedin': 'https://linkedin.com/in/ayushdas-11am',
        'github': 'https://github.com/aayush-xid-su',
        'instagram': 'https://instagram.com/aayush_xid_su',
        'twitter': 'https://x.com/aayushxidsu',
        'codepen': 'https://codepen.io/aayush_xid_su',
    };
    if(args.length > 0){
        const platform = args[0].toLowerCase();
        if(socialLinks[platform]){
            if (typeof window !== 'undefined') {
                window.open(socialLinks[platform], '_blank');
            }
            return `Opening ${platform}...`;
        }
        return `Unknown platform: ${platform}. Available: ${Object.keys(socialLinks).join(', ')}`;
    }

    return (
        <div>
            <p>Here are my Social media:</p>
            {Object.entries(socialLinks).map(([platform, link]) => (
                 <p key={platform}>- {platform}: <a href={link} target="_blank" rel="noopener noreferrer" className="text-accent underline">{link}</a></p>
            ))}
        </div>
    )
};

export const theme = async () => {
    return (
        <div>
            <p>Available themes:</p>
            <ul className="list-disc list-inside grid grid-cols-3 gap-x-4">
                {themes.map(t => <li key={t}>{t}</li>)}
            </ul>
            <p className="mt-2">Usage: set theme [theme-name]</p>
        </div>
    );
};


export const staticCommands = {
    help,
    commands,
    ayush,
    about,
    contact,
    projects,
    resume,
    social,
    theme,
    man,
    '?': help,
};
