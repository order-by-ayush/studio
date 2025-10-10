import React from 'react';
import { themes } from '@/lib/themes';
import { commandList } from './index';
import { manPages } from './manpages';

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
  'commands': 'Show a detailed list of all commands with descriptions.',
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
  'man': 'Display the manual page for a command. Usage: man [command]',
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
  const maxLength = Math.max(...allCommands.map(cmd => cmd.length)) + 2; // a little extra padding
  const numColumns = 4;
  const numRows = Math.ceil(allCommands.length / numColumns);
  let output = 'Available commands:\n';
  const columns: string[][] = Array(numColumns).fill(0).map(() => []);

  for (let i = 0; i < allCommands.length; i++) {
    columns[Math.floor(i / numRows)].push(allCommands[i]);
  }

  for (let i = 0; i < numRows; i++) {
    let row = '';
    for (let j = 0; j < numColumns; j++) {
      if (columns[j][i]) {
        row += columns[j][i].padEnd(maxLength);
      }
    }
    output += row + '\n';
  }
  
  return (
    <div>
      <pre>{output}</pre>
      <p className="mt-2">Type 'help [command]' for more details on a specific command.</p>
      <p>Type 'commands' to see a list with descriptions.</p>
      <p>Type 'man [command]' to see a detailed manual for a command.</p>
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
            <pre className="p-2 my-1 bg-muted rounded font-mono text-sm">> {page.example.command}</pre>
            <p>Will produce the following output:</p>
            <pre className="p-2 my-1 bg-muted rounded font-mono text-sm">{page.example.output}</pre>
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
            <pre className="mt-2">{commandDetails}</pre>
        </div>
    );
};

export const ayush = async () => {
    if (typeof window !== 'undefined') {
        window.open('https://ayushsingh.net', '_blank');
    }
    return 'Opening portfolio...';
};

export const about = async () => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-accent font-bold text-lg">Digital Identity</p>
        <p>name: "Ayush Das"</p>
        <p>headline: "Cybersecurity Enthusiast"</p>
        <p>location: "Odisha, India"</p>
        <p>shortBio: "I protect systems and data from cyber threats."</p>
        <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
{`I’m Ayush Das, a passionate Cybersecurity Enthusiast and BCA student focused on mastering both Offensive and Defensive Security techniques. My journey in tech began with a deep curiosity for bug hunting, ethical hacking, and OSINT investigations, which gradually evolved into building real-world cybersecurity projects that blend code, creativity, and problem-solving. I thrive on challenges and am constantly seeking opportunities to learn and grow in the ever-evolving field of cybersecurity.`}
        </p>
      </div>

      <div>
        <p className="text-accent font-bold text-lg">Education</p>
        <p>degree: "High school", school: "Navjyoti Vidyalaya", year: "2021", percentage: "84"</p>
        <p>degree: "Higher secondary", school: "The Dronacharya School", year: "2023", percentage: "60"</p>
        <p>degree: "Undergraduation", college: "YCAT", year: "2026", percentage: "8.4 sgpa"</p>
      </div>
      
      <div>
        <p className="text-accent font-bold text-lg">CERTIFICATES</p>
        <ul className="list-disc list-inside">
          <li>Cyber Job Simulation by Deloitte</li>
          <li>ANZ Cyber Security Management</li>
        </ul>
      </div>

       <div>
        <p className="text-accent font-bold text-lg">COURSES</p>
        <ul className="list-disc list-inside">
          <li>Tata Cybersecurity Analyst Completion Certificate</li>
          <li>Mastercard Cybersecurity Completion Certificate</li>
        </ul>
      </div>

      <div>
        <p className="text-accent font-bold text-lg">PROJECTS</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <p><span className="font-bold">Packet Sniffer based on Java:</span> Developed a network packet sniffer in Java to capture, analyze, and display real-time network traffic, aiding in network monitoring and security analysis.</p>
          </li>
          <li>
            <p><span className="font-bold">Online Odisha eCommerce website:</span> Designed and developed an e-commerce platform focused on selling traditional and locally-made clothing in Odisha, supporting regional artisans and promoting traditional fashion through a user-friendly online store.</p>
          </li>
          <li>
            <p><span className="font-bold">HTTP Server for Wireless File Transfer:</span> Built a lightweight HTTP server to enable remote file transfer over a network without cables, allowing seamless sharing between devices using only a web browser.</p>
          </li>
          <li>
            <p><span className="font-bold">Image Encryption & Decryption Tool:</span> Created a secure tool to encrypt and decrypt images using custom algorithms, ensuring data privacy and protection during storage and transfer.</p>
          </li>
           <li>
            <p><span className="font-bold">Global Health Expenditure Analysis using Power BI:</span> Analyzed global health spending trends using data visualization and statistical methods to highlight disparities and support policy insights.</p>
          </li>
        </ul>
      </div>
      
      <div>
        <p className="text-accent font-bold text-lg">Key Skills</p>
        <p>Java, C, C++, Python, HTML, CSS, JS, React, PHP, Linux, AWS, Git/GitHub, API Development</p>
      </div>
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


export const staticCommands = {
    help,
    commands,
    ayush,
    about,
    contact,
    projects,
    social,
    theme,
    man,
    '?': help,
};
