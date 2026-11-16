import React, { createContext, useContext, useState, useMemo } from 'react';
import { SkeletonThemeProvider } from 'skellx';
import { lightColors, darkColors, typography, spacing, borderRadius } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [animationMode, setAnimationMode] = useState('shimmer'); // 'shimmer' | 'pulse' | 'static'
  const [cartCount, setCartCount] = useState(0);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = useMemo(() => {
    return themeMode === 'light' ? lightColors : darkColors;
  }, [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      toggleTheme,
      colors,
      typography,
      spacing,
      borderRadius,
      animationMode,
      setAnimationMode,
      cartCount,
      setCartCount,
      addToCart: (qty = 1) => setCartCount((prev) => prev + qty),
    }),
    [themeMode, colors, animationMode, cartCount]
  );

  return (
    <ThemeContext.Provider value={value}>
      <SkeletonThemeProvider theme={themeMode}>
        {children}
      </SkeletonThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
