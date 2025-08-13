import React, { createContext, useContext, useEffect, useState } from 'react';
import { WeightTheme, getWeightTheme } from '../utils/weightUtils';
import { User, useUser } from './UserContext';

interface ThemeContextType {
  theme: WeightTheme | null;
  updateTheme: (user: User) => void;
  getThemeColor: (colorKey: string, shade: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<WeightTheme | null>(null);
  const { user, registerThemeCallback } = useUser();

  const updateTheme = (user: User) => {
    const newTheme = getWeightTheme(user.weight, user.height);
    setTheme(newTheme);
    
    // Aplicar variáveis CSS customizadas para o tema
    const root = document.documentElement;
    Object.entries(newTheme.primary).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });
    
    Object.entries(newTheme.accent).forEach(([shade, color]) => {
      root.style.setProperty(`--color-accent-${shade}`, color);
    });
    
    root.style.setProperty('--gradient-primary', `linear-gradient(to right, ${newTheme.primary[500]}, ${newTheme.primary[700]})`);
  };

  // Registrar o callback quando o componente montar
  useEffect(() => {
    if (registerThemeCallback) {
      registerThemeCallback(updateTheme);
    }
  }, [registerThemeCallback]);

  // Aplicar tema quando o usuário mudar
  useEffect(() => {
    if (user) {
      updateTheme(user);
    }
  }, [user]);

  const getThemeColor = (colorKey: string, shade: string): string => {
    if (!theme) return '';
    
    const shadeKey = shade as '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    
    if (colorKey === 'primary' && theme.primary[shadeKey]) {
      return theme.primary[shadeKey];
    }
    
    if (colorKey === 'accent' && theme.accent[shadeKey]) {
      return theme.accent[shadeKey];
    }
    
    return '';
  };

  const value: ThemeContextType = {
    theme,
    updateTheme,
    getThemeColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
