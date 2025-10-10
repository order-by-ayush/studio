export const themes = [
  "blood",
  "cobalt",
  "corporate",
  "cosmic",
  "dark",
  "dracula",
  "forest",
  "gruvbox",
  "hacker",
  "iceberg",
  "light",
  "matrix",
  "monokai",
  "nord",
  "pirate",
  "pride",
  "retro",
  "solarized",
  "sunset",
  "tokyo",
  "ubuntu",
];

export type Theme = (typeof themes)[number];

export const isTheme = (theme: string): theme is Theme => themes.includes(theme);
