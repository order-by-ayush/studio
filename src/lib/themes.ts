export const themes = [
  "blood",
  "dark",
  "light",
  "cosmic",
  "matrix",
];

export type Theme = (typeof themes)[number];

export const isTheme = (theme: string): theme is Theme => themes.includes(theme);
