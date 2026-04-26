export const Colors = {
  primary: {
    50:  "#eff6ff",
    100: "#dbeafe",
    300: "#93c5fd",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },

  neutral: {
    50:  "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    900: "#111827",
  },

  success: { bg: "#d1fae5", text: "#065f46", border: "#34d399" },
  warning: { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  danger:  { bg: "#fee2e2", text: "#991b1b", border: "#f87171" },
  info:    { bg: "#dbeafe", text: "#1e40af", border: "#60a5fa" },

  background: "#f9fafb",
  surface:    "#ffffff",
  textPrimary:   "#111827",
  textSecondary: "#6b7280",
  border:        "#e5e7eb",
  white:         "#ffffff",
  black:         "#000000",
};

export const Typography = {
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 22,
    "2xl": 28,
    "3xl": 36,
  },
  fontWeight: {
    regular: "400" as const,
    medium:  "500" as const,
    semibold:"600" as const,
    bold:    "700" as const,
    black:   "900" as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const Radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
