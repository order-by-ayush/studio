
export const themes = [
  "blood",
  "dark",
  "light",
  "cosmic",
  "matrix",
];

export type Theme = "blood" | "dark" | "light" | "cosmic" | "matrix";

export const isTheme = (theme: string): theme is Theme => themes.includes(theme);
