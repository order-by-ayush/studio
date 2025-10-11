import React from 'react';
import { isTheme, themes } from '@/lib/themes';
import figlet from 'figlet';
import qrcode from 'qrcode';
import * as actions from '@/app/actions';

// Helper for date parsing
const parseDate = (dateStr: string): Date | null => {
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
  ];
  if (formats[0].test(dateStr)) return new Date(dateStr);
  if (formats[1].test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
};

export const age = async (args: string[]) => {
  if (!args.length) return 'Usage: age [YYYY-MM-DD|DD/MM/YYYY]';
  const date = parseDate(args[0]);
  if (!date) return 'Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY.';
  const ageDifMs = Date.now() - date.getTime();
  const ageDate = new Date(ageDifMs);
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  return `You are ${years} years old.`;
};

export const ascii = async (args: string[]) => {
    if (!args.length) return 'Usage: ascii [text] [font?]';
    const text = args[0];
    const font = args.length > 1 ? args[1] as figlet.Fonts : 'Standard';
    
    try {
        const data = await new Promise<string>((resolve, reject) => {
            figlet.text(text, { font }, (err, data) => {
                if (err) return reject(new Error('Invalid font or Figlet error.'));
                resolve(data || '');
            });
        });
        return <pre>{data}</pre>;
    } catch(e: any) {
        return e.message;
    }
};

export const asciiqr = async (args: string[]) => {
    if (!args.length) return 'Usage: asciiqr [text/url]';
    const text = args.join(' ');
    try {
        const ascii = await new Promise<string>((resolve, reject) => {
            qrcode.toString(text, {type: 'terminal', small: true }, (err, url) => {
                if (err) reject(err);
                resolve(url);
            });
        });
        return <pre>{ascii}</pre>
    } catch (e) {
        return 'Error generating ASCII QR code.';
    }
};

export const base64 = async (args: string[]) => {
  const [op, ...textParts] = args;
  const text = textParts.join(' ');
  if (!op || !text) return 'Usage: base64 [encode|decode] [text]';

  if (typeof window === 'undefined') return 'This command is only available on the client.';

  if (op === 'encode') {
    return window.btoa(text);
  } else if (op === 'decode') {
    try {
      return window.atob(text);
    } catch {
      return 'Invalid Base64 string.';
    }
  }
  return 'Invalid operation. Use "encode" or "decode".';
};

export const calendar = async (args: string[]) => {
    const now = new Date();
    let targetDate = now;

    if (args.length > 0) {
        const dateString = args.join(' ');
        const parsedDate = new Date(dateString);
        
        if (!isNaN(parsedDate.getTime()) && dateString.trim().split(' ').length > 1) {
            targetDate = parsedDate;
        } else {
             return `Invalid date format: "${dateString}". Try "september 2025" or leave blank for current month.`;
        }
    }

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let header = `   ${targetDate.toLocaleString('default', { month: 'long' })} ${year}\n`;
    header += 'Su Mo Tu We Th Fr Sa\n';

    let calendarGrid = '';
    let day = 1;

    // ANSI escape code for highlighting
    const highlightStart = `\x1b[7m`;
    const highlightEnd = `\x1b[0m`;

    const isCurrentMonthAndYear = month === now.getMonth() && year === now.getFullYear();

    for(let i=0; i<6; i++){
        let row = '';
        for(let j=0; j<7; j++){
            if(i === 0 && j < firstDayOfWeek){
                row += '   ';
            } else if (day > daysInMonth){
                break;
            } else {
                let dayStr = day.toString().padStart(2, ' ');
                if (isCurrentMonthAndYear && day === now.getDate()) {
                     row += `${highlightStart}${dayStr}${highlightEnd} `;
                } else {
                    row += `${dayStr} `;
                }
                day++;
            }
        }
        calendarGrid += row.trimEnd() + '\n';
        if(day > daysInMonth) break;
    }
    
    return <pre>{header + calendarGrid}</pre>;
};

export const clear = async (args: string[], { clearOutputs, clearHistory, showStartupMessages }) => {
  const mode = args[0] || 'screen';
  if (mode === 'screen') {
      // Handled in parent
  }
  if (mode === 'history') {
    clearHistory();
    return 'History cleared.';
  }
  if (mode === 'both') {
    clearHistory();
    return 'History cleared.';
  }
  // No return value, handled by processCommand
};

export const coin = async () => (Math.random() < 0.5 ? 'Heads 🪙' : 'Tails 🪙');

export const countdays = async (args: string[]) => {
  if (!args.length) return 'Usage: countdays [YYYY-MM-DD|DD/MM/YYYY]';
  const date = parseDate(args[0]);
  if (!date) return 'Invalid date format.';
  const diffTime = date.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `${diffDays} days until ${args[0]}.`;
  if (diffDays < 0) return `${-diffDays} days since ${args[0]}.`;
  return `Today is ${args[0]}!`;
};

export const date = async () => new Date().toLocaleString();

export const dice = async (args: string[]) => {
  const sides = args[0] ? parseInt(args[0], 10) : 6;
  if (isNaN(sides) || sides < 1) return 'Invalid number of sides.';
  const roll = Math.floor(Math.random() * sides) + 1;
  return `Rolled a ${sides}-sided die: ${roll} 🎲`;
};

export const hash = async (args: string[]) => {
    if(!args.length) return "Usage: hash [text]";
    if(typeof window === 'undefined' || !window.crypto?.subtle) return "Crypto API not available.";
    const text = args.join(' ');
    const data = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `SHA-256: ${hashHex}`;
};

export const history = async (args: string[], context) => {
    if (typeof window === 'undefined') return 'History is not available on the server.';
    const historyStr = window.localStorage.getItem('terminal-history');
    if (!historyStr) return 'No history found.';
    const history = JSON.parse(historyStr);
    const count = args[0] ? parseInt(args[0], 10) : 10;
    return history.slice(0, count).reverse().join('\n');
};

export const matrix = async (args: string[], { setMatrix }) => {
    const color = args[0] || '#0F0';
    setMatrix({ active: true, color: color });
    return 'Entering matrix... Press ESC to exit.';
};

export const qr = async (args: string[]) => {
    if(!args.length) return "Usage: qr [text/url]";
    const text = args.join(' ');
    try {
        const dataUrl = await qrcode.toDataURL(text);
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={dataUrl} alt={`QR code for ${text}`} className="w-32 h-32 bg-white p-1 rounded" />;
    } catch {
        return "Error generating QR code.";
    }
};

export const remind = async (args: string[], context) => {
    if(args.length < 2) return "Usage: remind [seconds] [message]";
    const seconds = parseInt(args[0], 10);
    if(isNaN(seconds)) return "Invalid number of seconds.";
    const message = args.slice(1).join(' ');
    setTimeout(() => {
        context.addOutput(`\nReminder: ${message}`);
        context.playSound('enter');
    }, seconds * 1000);
    return `Reminder set for ${seconds} seconds.`;
};

export const reset = async (args: string[], { setShutdown }) => {
    if(typeof window !== 'undefined') {
        window.localStorage.clear();
        setShutdown(false);
        window.location.reload();
    }
    return "Resetting terminal...";
};

let rpsScore = { player: 0, ai: 0 };
if (typeof window !== 'undefined') {
    const score = window.localStorage.getItem('rps-score');
    if (score) {
      try {
        rpsScore = JSON.parse(score);
      } catch (e) {
        rpsScore = { player: 0, ai: 0 };
      }
    }
}
export const rps = async (args: string[]) => {
    const choices = ['rock', 'paper', 'scissors'];
    const playerChoice = args[0]?.toLowerCase();
    if(!playerChoice || !choices.includes(playerChoice)) return `Usage: rps [rock|paper|scissors]. Current score: Player ${rpsScore.player} - AI ${rpsScore.ai}`;

    const aiChoice = choices[Math.floor(Math.random() * 3)];
    let result = '';

    if (playerChoice === aiChoice) {
        result = "It's a tie!";
    } else if (
        (playerChoice === 'rock' && aiChoice === 'scissors') ||
        (playerChoice === 'scissors' && aiChoice === 'paper') ||
        (playerChoice === 'paper' && aiChoice === 'rock')
    ) {
        result = 'You win!';
        rpsScore.player++;
    } else {
        result = 'You lose!';
        rpsScore.ai++;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('rps-score', JSON.stringify(rpsScore));
    }
    return `You chose ${playerChoice}, AI chose ${aiChoice}. ${result} Score: Player ${rpsScore.player} - AI ${rpsScore.ai}`;
};


export const set = async (args: string[], { setTheme, setUsername, setSoundEnabled, setTypingSpeed }) => {
    const [key, ...valueParts] = args;
    const value = valueParts.join(' ');

    if (!key) {
        return `Usage:
set <theme|username|sound|speed> [value]
set theme - list available themes
set theme <theme_name> - change the terminal theme
set username <name> - set a new username
set sound <on|off> - toggle sound effects
set speed <ms> - set typing speed in milliseconds`;
    }

    switch (key) {
        case 'theme':
            if (!value) {
                return `Available themes: ${themes.join(', ')}`;
            }
            if (isTheme(value)) {
                setTheme(value);
                return `Theme set to ${value}.`;
            }
            return `Invalid theme. Available: ${themes.join(', ')}`;
        case 'username':
            if (!value) return 'Usage: set username <name>';
            setUsername(value);
            return `Username set to ${value}.`;
        case 'sound':
             if (!value) return 'Usage: set sound <on|off>';
            if (value === 'on') {
                setSoundEnabled(true);
                return 'Sound enabled.';
            } else if (value === 'off') {
                setSoundEnabled(false);
                return 'Sound disabled.';
            }
            return 'Invalid sound option. Use "on" or "off".';
        case 'speed':
            if (!value) return 'Usage: set speed <ms>';
            const speed = parseInt(value, 10);
            if (!isNaN(speed) && speed >= 0) {
                setTypingSpeed(speed);
                return `Typing speed set to ${speed}ms.`;
            }
            return 'Invalid speed. Please provide a non-negative number.';
        default:
            return `Invalid setting: '${key}'. Use 'theme', 'username', 'sound', or 'speed'.`;
    }
};

export const shutdown = async (args: string[], { setShutdown }) => {
  setShutdown(true);
};


export const poweron = async(args: string[], context) => {
    context.setShutdown(false);
    context.clearOutputs();
    return "System restarted.";
};

export const stopwatch = async (args: string[], context) => {
    const op = args[0] || 'start';
    if (op === 'start') {
        context.setStopwatch(prev => {
            if(prev.running) return prev;
            return { running: true, startTime: Date.now(), elapsed: 0 }
        });
        return 'Stopwatch started... Press ESC to stop.';
    }
    return 'Usage: stopwatch start';
};

export const time = async (args: string[]) => {
    const timezone = args.join(' ');
    if (!timezone) {
        return new Date().toLocaleTimeString();
    }
    try {
        return new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute:'2-digit', second: '2-digit' });
    } catch {
        return `Invalid timezone: ${timezone}. Try a valid IANA timezone name (e.g., "America/New_York").`;
    }
};

let countdownInterval: NodeJS.Timeout | null = null;
export const timer = async (args: string[], context) => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        return 'Previous timer cleared.';
    }
    if(!args.length) return 'Usage: timer [seconds|hh:mm:ss]';
    let totalSeconds = 0;
    if (args[0].includes(':')) {
        const parts = args[0].split(':').map(Number).reverse();
        totalSeconds += parts[0] || 0; // seconds
        totalSeconds += (parts[1] || 0) * 60; // minutes
        totalSeconds += (parts[2] || 0) * 3600; // hours
    } else {
        totalSeconds = parseInt(args[0], 10);
    }
    if (isNaN(totalSeconds) || totalSeconds <= 0) return 'Invalid time specified.';
    
    let remaining = totalSeconds;
    countdownInterval = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            clearInterval(countdownInterval!);
            countdownInterval = null;
            context.addOutput(`\nTimer finished!`);
            context.playSound('enter');
        }
    }, 1000);
    return `Timer set for ${totalSeconds} seconds.`;
};

let sessionStartTime = Date.now();
if (typeof window !== 'undefined' && window.sessionStorage.getItem('session-start-time')) {
    sessionStartTime = parseInt(window.sessionStorage.getItem('session-start-time')!, 10);
} else if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('session-start-time', String(sessionStartTime));
}
export const uptime = async () => {
    const uptimeMs = Date.now() - sessionStartTime;
    const seconds = Math.floor((uptimeMs / 1000) % 60);
    const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
    const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
    return `Session uptime: ${hours}h ${minutes}m ${seconds}s`;
};

export const username = async (args: string[], context) => {
    return `Current username is: ${context.username}`;
};

export const uuid = async () => {
    if(typeof window !== 'undefined' && window.crypto) {
        return window.crypto.randomUUID();
    }
    return 'Crypto API not available.';
};

export const whoami = async (args: string[], context) => {
    if (typeof window === 'undefined') return 'This command is only available on the client.';

    const getBrowser = () => {
        const ua = navigator.userAgent;
        if (ua.includes("Firefox")) return "Mozilla Firefox";
        if (ua.includes("SamsungBrowser")) return "Samsung Internet";
        if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
        if (ua.includes("Trident")) return "Microsoft Internet Explorer";
        if (ua.includes("Edge")) return "Microsoft Edge";
        if (ua.includes("Chrome")) return "Google Chrome or Chromium";
        if (ua.includes("Safari")) return "Apple Safari";
        return "Unknown";
    }

    const ipInfo: any = await actions.getIpInfo();
    const isp = (ipInfo.error || ipInfo.status === 'fail') ? 'Unknown' : ipInfo.isp;
    const isMobile = window.innerWidth < 768;

    const info = [
        `User: ${context.username}`,
        `OS: ${navigator.platform}`,
        `Browser: ${getBrowser()}`,
        `User Agent: ${navigator.userAgent}`,
        `Resolution: ${window.screen.width}x${window.screen.height}`,
        `Device Type: ${isMobile ? 'Mobile/Tablet' : 'Desktop/Laptop'}`,
        `Internet Provider: ${isp}`,
    ];

    return info.join('\n');
};
    
