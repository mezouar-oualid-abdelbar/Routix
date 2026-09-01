const theme = {
  colors: {
    background: "#1E2824",
    surface: "#2A362E",
    primary: "#6FCF97", // softer green, not neon
    secondary: "#57805f",

    text: "#F2F2F2", // light text for dark background
    textSecondary: "#A0A8A3",
    textInverse: "#1E2824",

    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f1c40f",
    info: "#3498db",

    border: "#3a4a3f",
    disabled: "#6b6b6b",
    overlay: "rgba(0,0,0,0.5)",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    round: 999, // fully rounded (circular buttons/avatars)
  },
};

export default theme;
