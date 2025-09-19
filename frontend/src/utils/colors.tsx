// Site color themes and gray palette
export const themes = [
  {
    name: "default",
    colors: {
      primary: "#64748b", // slate-500
      background: "#f8fafc", // slate-50
      cardBackground: "#f1f5f9", // slate-100
      cardBg: "#f1f5f9", // slate-100
      text: "#232325", // gray-600
      buttonBg: "#64748b", // slate-500
      buttonText: "#f8fafc", // slate-50
      border: "#e2e8f0", // slate-200
      accent: "#94a3b8", // slate-400
      error: "#E53E3E",
      hover: "#e2e8f0", // slate-200
      cardShadow: "0 8px 32px #64748b22",
    },
  },
  {
    name: "coffee",
    colors: {
      primary: "#4F3325",
      background: "#B39885",
      cardBackground: "#F5F5E9",
      hover: "#7E5C4E",
      error: "#E53E3E",
      border: "#D1C6BB",
    },
  },
  {
    name: "roseFlower",
    colors: {
      primary: "#b83260", // deep rose
      background: "#fff0f6", // light rose
      cardBackground: "#ffe5ef", // rose-50
      cardBg: "#ffe5ef", // rose-50
      text: "#1b1b1d",
      buttonBg: "#b83260",
      buttonText: "#fff0f6",
      border: "#FFD6E0",
      accent: "#FFD700",
      error: "#E53E3E",
      hover: "#FFD6E0",
      cardShadow: "0 8px 32px #b8326022",
    },
  },
];

export const grayTheme = {
  gray100: "#f3f4f5",
  gray200: "#eeeff1",
  gray300: "#e0e7ef",
  gray400: "#d1d5db",
  gray500: "#646464",
  gray600: "#232325",
  gray700: "#1b1b1d",
};

export type Theme = (typeof themes)[number]["colors"];
