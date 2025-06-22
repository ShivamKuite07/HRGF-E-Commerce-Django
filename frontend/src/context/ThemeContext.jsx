// src/context/ThemeContext.js
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Use stored value or system preference
    const stored = localStorage.getItem('app-theme');
    if (stored) return stored;

    const systemPrefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    return systemPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    // Clear existing class and apply new one
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);

    // Persist to localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
