# **App Name**: Terminal Portfolio

## Core Features:

- Terminal Emulator: Simulate a retro computer terminal with command-line interface.
- Command Execution: Execute 50+ commands (help, about, age, antonym, ascii, etc.) with specific functionalities and error handling.
- Dynamic Theming: Allow users to switch between 21 pre-defined themes (hacker, matrix, pride, etc.).
- Theme Management: Implement matrix theme toggle animation of ASCII characters via HTML5 Canvas API.
- Portfolio Display: Display personal portfolio information including bio, projects, and contact details using static data.
- Data Persistence: Implement local storage functionality to remember recent history of inputs, chosen theme and chosen user name.
- Autocomplete and suggestions: LLM Tool for fuzzy command matching in order to provide helpful, context-aware autocompletion.

## Style Guidelines:

- Primary color: Green (#00FF00) for the classic 'hacker' terminal look.
- Background color: Black (#000000) for the terminal background.
- Accent color: Lime (#00CC00) for command highlights and user prompts.
- Font: 'Inconsolata' (monospace, sans-serif) via Google Fonts, for terminal-style text.
- Full-viewport terminal layout with a blinking cursor effect.
- Minimal use of icons, primarily using ASCII art for the header and QR codes.
- Typewriter effect for output text with customizable speed. Subtle CSS transitions for theme switches and UI elements.