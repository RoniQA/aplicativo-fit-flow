import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { UserProvider } from '../UserContext';
import { getWeightTheme } from '../../utils/weightUtils';

// Mock das funções
jest.mock('../../utils/weightUtils');
const mockGetWeightTheme = getWeightTheme as jest.MockedFunction<typeof getWeightTheme>;

// Componente de teste para usar o contexto
const TestComponent = () => {
  const { theme, updateTheme, getThemeColor } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-gradient">{theme?.gradient || 'no-theme'}</div>
      <div data-testid="theme-primary-500">{theme?.primary[500] || 'no-color'}</div>
      <div data-testid="theme-accent-500">{theme?.accent[500] || 'no-color'}</div>
      <button 
        onClick={() => updateTheme({ 
          id: '1', 
          name: 'Test User', 
          age: 25, 
          weight: 70, 
          height: 170, 
          gender: 'male' as const, 
          goal: 'maintain' as const, 
          activityLevel: 'medium' as const, 
          workoutLocation: 'home' as const, 
          bodyTypeGoal: 'toned' as const, 
          experienceLevel: 'beginner' as const, 
          physicalLimitations: [], 
          dietaryPreferences: 'none' as const, 
          availableTime: '45min' as const, 
          createdAt: new Date() 
        })}
        data-testid="update-theme-btn"
      >
        Update Theme
      </button>
      <div data-testid="theme-color">{getThemeColor('primary', '500')}</div>
    </div>
  );
};

// Mock do document.documentElement
const mockSetProperty = jest.fn();
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: mockSetProperty
    }
  },
  writable: true
});

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetWeightTheme.mockReturnValue({
      primary: {
        50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
        400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
        800: '#166534', 900: '#14532d'
      },
      accent: {
        50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
        400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
        800: '#9a3412', 900: '#7c2d12'
      },
      gradient: 'from-green-500 to-green-700',
      cardBg: 'bg-green-50',
      cardBorder: 'border-green-200'
    });
  });

  it('should provide theme context to children', () => {
    render(
      <UserProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </UserProvider>
    );

    expect(screen.getByTestId('theme-gradient')).toBeInTheDocument();
    expect(screen.getByTestId('theme-primary-500')).toBeInTheDocument();
    expect(screen.getByTestId('theme-accent-500')).toBeInTheDocument();
  });

  it('should update theme when updateTheme is called', () => {
    render(
      <UserProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </UserProvider>
    );

    const updateButton = screen.getByTestId('update-theme-btn');
    
    act(() => {
      updateButton.click();
    });

    expect(mockGetWeightTheme).toHaveBeenCalledWith(70, 170);
    expect(mockSetProperty).toHaveBeenCalled();
  });

  it('should set CSS custom properties when theme is updated', () => {
    render(
      <UserProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </UserProvider>
    );

    const updateButton = screen.getByTestId('update-theme-btn');
    
    act(() => {
      updateButton.click();
    });

    // Verificar se as variáveis CSS foram definidas
    expect(mockSetProperty).toHaveBeenCalledWith('--color-primary-50', '#f0fdf4');
    expect(mockSetProperty).toHaveBeenCalledWith('--color-primary-500', '#22c55e');
    expect(mockSetProperty).toHaveBeenCalledWith('--color-accent-500', '#f97316');
    expect(mockSetProperty).toHaveBeenCalledWith('--gradient-primary', expect.stringContaining('linear-gradient'));
  });

  it('should return theme color when getThemeColor is called', () => {
    render(
      <UserProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </UserProvider>
    );

    const updateButton = screen.getByTestId('update-theme-btn');
    
    act(() => {
      updateButton.click();
    });

    expect(screen.getByTestId('theme-color')).toHaveTextContent('#22c55e');
  });

  it('should handle theme update with different weight/height values', () => {
    mockGetWeightTheme.mockReturnValue({
      primary: {
        50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe',
        400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7c3aed',
        800: '#6b21a8', 900: '#581c87'
      },
      accent: {
        50: '#fdf4ff', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
        400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
        800: '#9d174d', 900: '#831843'
      },
      gradient: 'from-purple-500 to-purple-700',
      cardBg: 'bg-purple-50',
      cardBorder: 'border-purple-200'
    });

    render(
      <UserProvider>
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      </UserProvider>
    );

    const updateButton = screen.getByTestId('update-theme-btn');
    
    act(() => {
      updateButton.click();
    });

    expect(mockGetWeightTheme).toHaveBeenCalledWith(70, 170);
    expect(screen.getByTestId('theme-gradient')).toHaveTextContent('from-purple-500 to-purple-700');
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
