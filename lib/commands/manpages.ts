type ManPage = {
    name: string;
    description: string;
    longDescription: string;
    usage: string;
    example?: {
        command: string;
        output: string;
    };
};

export const manPages: Record<string, ManPage> = {
    help: {
        name: 'help',
        description: 'Displays a list of available commands or help for a specific command.',
        longDescription: 'Provides a summary of all commands. When an argument is provided, it shows the usage for that specific command. For a more detailed view, use the `man` command.',
        usage: 'help [command]',
        example: {
            command: 'help clear',
            output: 'Usage: Clear the terminal screen, history, or both. Usage: clear [screen|history|both]',
        },
    },
    man: {
        name: 'man',
        description: 'Display the manual page for a command.',
        longDescription: 'Shows detailed information about a command, including its name, synopsis, a full description, and an example of its use.',
        usage: 'man <command>',
        example: {
            command: 'man theme',
            output: `NAME
    theme - Lists all available themes.

SYNOPSIS
    theme

DESCRIPTION
    Displays a list of all themes that can be applied to the terminal. Use 'set theme <theme-name>' to change the theme.`,
        },
    },
    clear: {
        name: 'clear',
        description: 'Clears the terminal screen or history.',
        longDescription: 'This command is used to clear the terminal content. It can clear the visible screen, the command history, or both.',
        usage: 'clear [screen|history|both]',
        example: {
            command: 'clear history',
            output: 'History cleared.',
        },
    },
    set: {
        name: 'set',
        description: 'Configure terminal options.',
        longDescription: `Allows customization of terminal settings.
- 'set theme [theme-name]' to change the theme. Without a name, it lists available themes.
- 'set username <name>' to change the displayed username.
- 'set sound <on|off>' to toggle sound effects.
- 'set speed <ms>' to adjust the typing animation speed.`,
        usage: 'set <option> [value]',
        example: {
            command: 'set theme blood',
            output: 'Theme set to blood.',
        },
    },
    theme: {
        name: 'theme',
        description: 'Lists all available themes.',
        longDescription: `Displays a list of all themes that can be applied to the terminal. Use 'set theme <theme-name>' to change the theme.`,
        usage: 'theme',
    },
     about: {
        name: 'about',
        description: 'Displays my biography, education, and skills.',
        longDescription: 'Provides a detailed professional summary, including biography, education history, certifications, projects, and a list of key skills.',
        usage: 'about',
    },
    contact: {
        name: 'contact',
        description: 'Display my contact information.',
        longDescription: 'Shows contact information, including email and links to professional profiles like LinkedIn and GitHub.',
        usage: 'contact',
    },
    social: {
        name: 'social',
        description: 'Display links to my social media profiles.',
        longDescription: 'Provides links to social media profiles. If a platform name is passed as an argument, it opens the profile in a new tab.',
        usage: 'social [platform?]',
        example: {
            command: 'social github',
            output: 'Opening github...',
        }
    },
     weather: {
        name: 'weather',
        description: 'Show weather for your location or a city.',
        longDescription: 'Fetches and displays the current weather. If no city is provided, it will attempt to use your browser\'s location. As a fallback, it uses IP-based geolocation.',
        usage: 'weather [city?]',
        example: {
            command: 'weather Balangir',
            output: `Weather for Balangir, odisha:
Currently: Partly cloudy, 15°C (feels like 14°C)
Wind: 10 km/h from SW
Humidity: 72%
Today's forecast: Sunny, high of 19°C, low of 12°C`
        }
    },
};
