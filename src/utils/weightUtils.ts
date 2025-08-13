export interface WeightCategory {
  category: 'abaixo' | 'ideal' | 'acima' | 'sobrepeso';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface WeightTheme {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  gradient: string;
  cardBg: string;
  cardBorder: string;
}

export const calculateBMI = (weight: number, height: number): number => {
  // Altura em metros (height está em cm)
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getWeightCategory = (weight: number, height: number): WeightCategory => {
  const bmi = calculateBMI(weight, height);
  
  if (bmi < 18.5) {
    return {
      category: 'abaixo',
      label: 'Abaixo do Peso',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: 'ideal',
      label: 'Peso Ideal',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: 'acima',
      label: 'Acima do Peso',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    };
  } else {
    return {
      category: 'sobrepeso',
      label: 'Sobrepeso',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    };
  }
};

export const getWeightTheme = (weight: number, height: number): WeightTheme => {
  const bmi = calculateBMI(weight, height);
  
  if (bmi < 18.5) {
    // Tema Roxo para abaixo do peso
    return {
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
      accent: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef',
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
      },
      gradient: 'from-purple-500 to-purple-700',
      cardBg: 'bg-purple-50',
      cardBorder: 'border-purple-200'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    // Tema Verde para peso ideal (mantém o original)
    return {
      primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      accent: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      gradient: 'from-green-500 to-green-700',
      cardBg: 'bg-green-50',
      cardBorder: 'border-green-200'
    };
  } else if (bmi >= 25 && bmi < 30) {
    // Tema Laranja para acima do peso
    return {
      primary: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
      },
      accent: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      gradient: 'from-orange-500 to-orange-700',
      cardBg: 'bg-orange-50',
      cardBorder: 'border-orange-200'
    };
  } else {
    // Tema Vermelho para sobrepeso
    return {
      primary: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      accent: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
      },
      gradient: 'from-red-500 to-red-700',
      cardBg: 'bg-red-50',
      cardBorder: 'border-red-200'
    };
  }
};

export const getBMIDescription = (bmi: number): string => {
  if (bmi < 18.5) {
    return 'Seu IMC indica que você está abaixo do peso ideal. Considere consultar um nutricionista para um plano alimentar adequado.';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Parabéns! Seu IMC está na faixa considerada saudável. Continue mantendo hábitos saudáveis.';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Seu IMC indica que você está acima do peso ideal. Foque em exercícios regulares e alimentação equilibrada.';
  } else {
    return 'Seu IMC indica sobrepeso. Recomendamos consultar um profissional de saúde para orientações personalizadas.';
  }
};
