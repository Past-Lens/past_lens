import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { themes } from '../utils/colors';

export type ThemeName = typeof themes[number]['name'];
export type ThemeColors = typeof themes[number]['colors'];

interface ThemeContextType {
  themeName: ThemeName;
  themeColors: ThemeColors;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    return (localStorage.getItem('themeName') as ThemeName) || 'roseFlower';
  });

  useEffect(() => {
    localStorage.setItem('themeName', themeName);
  }, [themeName]);

  const themeObj = themes.find(t => t.name === themeName) || themes[0];
  const themeColors = themeObj.colors;

  return (
    <ThemeContext.Provider value={{ themeName, themeColors, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
