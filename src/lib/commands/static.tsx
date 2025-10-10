import React from 'react';
import { themes } from '@/lib/themes';
import { commandList } from './index.tsx';

const commandDescriptions: Record<string, string> = {
  '?': 'Alias for help.',
  'help': 'Show available commands or details for a specific command. Usage: help [command]',
  'ayush': 'Opens my personal portfolio website in a new tab.',
  'about': "Displays my biography, education, and skills.",
  'age': 'Calculate age from a given date. Usage: age YYYY-MM-DD',
  'antonym': 'Find antonyms for a word. Usage: antonym [word]',
  'ascii': 'Convert text to ASCII art. Usage: ascii [text] [font?]',
  'asciiqr': 'Generate an ASCII QR code from text. Usage: asciiqr [text]',
  'base64': 'Encode or decode text using Base64. Usage: base64 [encode|decode] [text]',
  'calendar': 'Display a calendar for the current month or a specified month/year. Usage: calendar [MM/YYYY?]',
  'capitalize': 'Capitalize the first letter of each word in a text. Usage: capitalize [text]',
  'clear': 'Clear the terminal screen, history, or both. Usage: clear [screen|history|both]',
  'coin': 'Flip a virtual coin.',
  'commands': 'Alias for help.',
  'contact': 'Display my contact information.',
  'countdays': 'Count days from today to a specific date. Usage: countdays YYYY-MM-DD',
  'country': 'Get information about a country. Usage: country [name]',
  'curl': 'Fetch and display the content of a URL. Usage: curl [url]',
  'date': 'Display the current date.',
  'define': 'Get the definition of a word. Usage: define [word]',
  'dice': 'Roll a virtual dice. Usage: dice [sides?]',
  'dns': 'Perform a DNS lookup for a domain. Usage: dns [domain]',
  'emoji': 'Shows an emoji. (Static map for now) Usage: emoji [name]',
  'geo': 'Get address from latitude and longitude. Usage: geo [lat,lon]',
  'github': 'Show GitHub profile information. Usage: github [username?]',
  'hash': 'Generate a SHA-256 hash of a text. Usage: hash [text]',
  'history': 'Show command history. Usage: history [count?]',
  'ip': 'Get information about an IP address. Usage: ip [address?]',
  'json': 'Fetch and pretty-print JSON from a URL. Usage: json [url]',
  'lowercase': 'Convert text to lowercase. Usage: lowercase [text]',
  'matrix': 'Toggle the matrix animation background.',
  'ping': 'Measure latency to a URL. Usage: ping [url]',
  'projects': 'Display a list of my projects.',
  'qr': 'Generate a QR code image from text. Usage: qr [text]',
  'quote': 'Display a random quote.',
  'remind': 'Set a reminder. Usage: remind [seconds] [message]',
  'reset': 'Reset terminal settings and reload.',
  'reverse': 'Reverse a string. Usage: reverse [text]',
  'rps': 'Play Rock, Paper, Scissors. Usage: rps [rock|paper|scissors]',
  'set': 'Change terminal settings. Usage: set [theme|username|sound|speed] [value]',
  'shorten': 'Shorten a URL using TinyURL. Usage: shorten [url]',
  'shutdown': 'Shuts down the terminal interface.',
  'social': 'Display links to my social media profiles.',
  'stock': 'Get stock quote information. Usage: stock [ticker]',
  'stopwatch': 'A simple stopwatch. Usage: stopwatch [start|stop|reset]',
  'synonym': 'Find synonyms for a word. Usage: synonym [word]',
  'sysinfo': 'Display system information.',
  'theme': 'List all available themes.',
  'time': 'Display the current time or time in a specific timezone. Usage: time [timezone?]',
  'timer': 'Set a countdown timer. Usage: timer [seconds|hh:mm:ss]',
  'translate': 'Translate text to another language. Usage: translate [text] [to_lang?]',
  'ttt': 'Play Tic-Tac-Toe. Usage: ttt [position]',
  'uppercase': 'Convert text to uppercase. Usage: uppercase [text]',
  'uptime': 'Show terminal session uptime.',
  'username': 'View the current terminal username.',
  'uuid': 'Generate a random UUID.',
  'weather': 'Show weather for your location or a city. Usage: weather [city?]',
  'whoami': 'Display current user and system info.',
};

export const help = async (args: string[]) => {
  if (args.length > 0) {
    const command = args[0].toLowerCase();
    if (commandDescriptions[command]) {
      return `Usage: ${commandDescriptions[command]}`;
    }
    return `Command "${command}" not found.`;
  }

  const allCommands = commandList.sort();
  const maxLength = Math.max(...allCommands.map(cmd => cmd.length));
  const twoColumns = allCommands.map(cmd => {
    const description = commandDescriptions[cmd]?.split('.')[0] || 'No description available.';
    return `${cmd.padEnd(maxLength + 4)}${description}`;
  }).join('\n');
  
  return (
    <div>
      <p>Available commands:</p>
      <pre className="mt-2">{twoColumns}</pre>
      <p className="mt-2">Type 'help [command]' for more details on a specific command.</p>
    </div>
  );
};
export const commands = help;
export const '?' = help;

export const ayush = async () => {
    if (typeof window !== 'undefined') {
        window.open('https://ayushsingh.net', '_blank');
    }
    return 'Opening portfolio...';
};

export const about = async () => {
  return (
    <div>
      <p>Hi, I'm Ayush, a software developer with a passion for building creative and useful applications.</p>
      <br />
      <p><span className="text-accent">Education:</span> B.Tech in Computer Science from NIT Jalandhar.</p>
      <p><span className="text-accent">Skills:</span> React, Next.js, TypeScript, Node.js, Python, Firebase, GCP.</p>
    </div>
  );
};

export const contact = async () => {
  return (
    <div>
      <p>You can reach me via:</p>
      <p>- Email: <a href="mailto:ayush.singh.xda@gmail.com" className="text-accent underline">ayush.singh.xda@gmail.com</a></p>
      <p>- LinkedIn: <a href="https://linkedin.com/in/ayush-singh-629007170" target="_blank" rel="noopener noreferrer" className="text-accent underline">linkedin.com/in/ayush-singh-629007170</a></p>
      <p>- GitHub: <a href="https://github.com/ayushs-2k1" target="_blank" rel="noopener noreferrer" className="text-accent underline">github.com/ayushs-2k1</a></p>
    </div>
  );
};

export const projects = async () => {
    return (
        <div>
            <p className="text-accent">My Projects:</p>
            <ul className="list-disc list-inside">
                <li>
                    <span>Aura:</span> A privacy-focused location sharing app.
                    <a href="https://github.com/ayushs-2k1/aura" target="_blank" rel="noopener noreferrer" className="text-accent underline ml-2">[GitHub]</a>
                </li>
                <li>
                    <span>Portfolio Terminal:</span> The very terminal you are using right now.
                    <a href="https://github.com/ayushs-2k1/terminal-portfolio" target="_blank" rel="noopener noreferrer" className="text-accent underline ml-2">[GitHub]</a>
                </li>
                <li>
                    <span>More projects on my GitHub profile...</span>
                </li>
            </ul>
        </div>
    );
};

export const social = async (args: string[]) => {
    const socialLinks: Record<string, string> = {
        'twitter': 'https://twitter.com/ash_singh_xda',
        'linkedin': 'https://linkedin.com/in/ayush-singh-629007170',
        'github': 'https://github.com/ayushs-2k1',
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
        </div>
    );
};
