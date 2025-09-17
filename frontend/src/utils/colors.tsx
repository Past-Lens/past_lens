// Site color themes and gray palette
export const themes = [
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
      text: "#1b1b1d",
      accent: "#FFD700",
      buttonBg: "#1b1b1d",
      buttonText: "#eeeff1",
      cardBg: "#ffffff",
      cardShadow: "0 8px 32px #64646422",
      border: "#eeeff1",
      error: "#E53E3E",
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
