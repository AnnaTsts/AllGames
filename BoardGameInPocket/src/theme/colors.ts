export const colors = {
  primary: "#578769",
  cream: "#FDF0AE",
  orange: "#F4B354",
  rust: "#A95031",
  brown: "#833012",

  success: "#578769",
  warning: "#F4B354",
  error: "#A95031",
  info: "#587F91",

  background: "#FAF9F5",
  surface: "#F4F1EA",
  border: "#E0D4C9",
  foreground: "#1D1A1A",
  mutedForeground: "#786459",

  gray900: "#332C2B",
  gray700: "#5B4B46",
  gray500: "#947E72",
  gray300: "#CFC0B4",
  gray50: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
