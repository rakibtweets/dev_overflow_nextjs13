'use client';

import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

// create context
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState('');
  // const handleThemeChange = () => {
  //   if (mode === 'dark') {
  //     setMode('light');
  //     document.documentElement.classList.add('light');
  //   } else {
  //     setMode('dark');
  //     document.documentElement.classList.add('dark');
  //   }
  // };

  // useEffect(() => {
  //   handleThemeChange();
  // }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
