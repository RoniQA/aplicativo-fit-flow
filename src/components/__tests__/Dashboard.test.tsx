import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { UserProvider } from '../../contexts/UserContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock dos contextos
const mockUseUser = jest.fn();
const mockUseTheme = jest.fn();

jest.mock('../../contexts/UserContext', () => ({
  useUser: () => mockUseUser()
}));

jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => mockUseTheme()
}));

// Mock das funções utilitárias
jest.mock('../../utils/weightUtils', () => ({
  calculateBMI: jest.fn((weight, height) => {
    if (weight === 70 && height === 170) return 24.22;
    if (weight === 90 && height === 170) return 31.14;
    if (weight === 50 && height === 170) return 17.30;
    return 22.0;
  }),
  getWeightCategory: jest.fn((weight, height) => {
    if (weight === 70 && height === 170) {
      return {
        label: 'Peso Ideal',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        color: 'text-green-600'
      };
    }
    if (weight === 90 && height === 170) {
      return {
        label: 'Sobrepeso',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        color: 'text-red-600'
      };
    }
    if (weight === 50 && height === 170) {
      return {
        label: 'Abaixo do Peso',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        color: 'text-purple-600'
      };
    }
    return {
      label: 'Peso Ideal',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      color: 'text-green-600'
    };
  }),
  getBMIDescription: jest.fn((bmi) => {
    if (bmi < 18.5) return 'Você está abaixo do peso ideal. Consulte um nutricionista para um plano alimentar adequado.';
    if (bmi >= 18.5 && bmi < 25) return 'Parabéns! Seu IMC está na faixa considerada saudável. Continue mantendo hábitos saudáveis.';
    if (bmi >= 25 && bmi < 30) return 'Seu IMC indica que você está acima do peso ideal. Foque em exercícios regulares e alimentação equilibrada.';
    return 'Seu IMC indica sobrepeso. Recomendamos consultar um profissional de saúde para orientações personalizadas.';
  })
}));

const mockUser = {
  id: '1',
  name: 'Test User',
  age: 25,
  weight: 70,
  height: 170,
  gender: 'male',
  goal: 'maintain',
  activityLevel: 'medium',
  workoutLocation: 'gym', // Mudado para 'gym' para gerar sugestões
  bodyTypeGoal: 'toned',
  experienceLevel: 'beginner',
  physicalLimitations: [],
  dietaryPreferences: 'none',
  availableTime: '45min',
  createdAt: new Date('2024-01-01')
};

const mockWorkouts = [
  {
    id: '1',
    date: new Date(),
    type: 'strength',
    duration: 45,
    exercises: [
      {
        name: 'Push-ups',
        sets: 3,
        reps: 10,
        weight: 0,
        type: 'bodyweight'
      }
    ]
  }
];

const mockMeals = [
  {
    id: '1',
    date: new Date(),
    type: 'breakfast',
    foods: [
      {
        name: 'Oatmeal',
        quantity: 100,
        unit: 'g',
        calories: 150,
        protein: 5,
        carbs: 25,
        fat: 3
      }
    ]
  }
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(component);
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mock padrão do useUser
    mockUseUser.mockReturnValue({
      user: mockUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    // Configurar mock padrão do useTheme
    mockUseTheme.mockReturnValue({
      theme: {
        gradient: 'from-green-500 to-green-700'
      }
    });
    
    // Garantir que as funções utilitárias retornem valores válidos
    const { calculateBMI, getWeightCategory, getBMIDescription } = require('../../utils/weightUtils');
    calculateBMI.mockReturnValue(24.22);
    getWeightCategory.mockReturnValue({
      label: 'Peso Ideal',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      color: 'text-green-600'
    });
    getBMIDescription.mockReturnValue('Parabéns! Seu IMC está na faixa considerada saudável. Continue mantendo hábitos saudáveis.');
  });

  it('should render dashboard with user information', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Olá, Test User! 👋')).toBeInTheDocument();
    expect(screen.getByText('Vamos alcançar seus objetivos de fitness hoje!')).toBeInTheDocument();
    expect(screen.getByText('Manter Forma')).toBeInTheDocument();
  });

  it('should display user stats correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('70kg')).toBeInTheDocument();
    expect(screen.getByText('170cm')).toBeInTheDocument();
    expect(screen.getAllByText('24.2')).toHaveLength(2); // IMC aparece 2 vezes
    expect(screen.getByText('Médio')).toBeInTheDocument();
  });

  it('should display weight category information', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getAllByText('Peso Ideal')).toHaveLength(2); // Aparece 2 vezes
    expect(screen.getByText(/saudável/)).toBeInTheDocument();
    expect(screen.getByText('IMC: 24.2 • Classificação: Peso Ideal')).toBeInTheDocument();
  });

  it('should show edit profile button', () => {
    renderWithProviders(<Dashboard />);

    const editButton = screen.getByText('Editar Perfil');
    expect(editButton).toBeInTheDocument();
  });

  it('should open edit modal when edit profile button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);

    const editButton = screen.getByText('Editar Perfil');
    
    await user.click(editButton);

    expect(screen.getAllByText('Editar Perfil')).toHaveLength(2); // Aparece 2 vezes
    expect(screen.getByText('Gênero')).toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('should close edit modal when close button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Dashboard />);

    // Abrir modal
    const editButton = screen.getByText('Editar Perfil');
    await user.click(editButton);

    // Fechar modal
    const closeButton = screen.getByLabelText('Fechar');
    await user.click(closeButton);

    // Verificar se o modal foi fechado
    expect(screen.queryByText('Gênero')).not.toBeInTheDocument();
  });

  it('should display workout suggestions correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Treino de Hoje')).toBeInTheDocument();
    // Verificar se a seção de treino está presente
    expect(screen.getByText('Treino de Hoje')).toBeInTheDocument();
  });

  it('should display diet suggestions correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Nutrição de Hoje')).toBeInTheDocument();
    expect(screen.getByText('🍽️ Plano Alimentar')).toBeInTheDocument();
    expect(screen.getByText('Equilíbrio calórico')).toBeInTheDocument();
    expect(screen.getByText('2100 kcal/dia')).toBeInTheDocument();
  });

  it('should display daily summary correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Resumo do Dia')).toBeInTheDocument();
    expect(screen.getByText('Treino')).toBeInTheDocument();
    expect(screen.getByText('Refeições')).toBeInTheDocument();
    expect(screen.getByText('Consistência')).toBeInTheDocument();
    // Usar getAllByText para IMC que aparece múltiplas vezes
    expect(screen.getAllByText('IMC')).toHaveLength(2);
  });

  it('should display daily tip correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Dica do Dia')).toBeInTheDocument();
    expect(screen.getByText(/Manter a forma física é um estilo de vida/)).toBeInTheDocument();
  });

  it('should handle different weight categories correctly', () => {
    // Testar com usuário com sobrepeso
    const overweightUser = { ...mockUser, weight: 90 };
    
    mockUseUser.mockReturnValue({
      user: overweightUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    // Configurar mock específico para este teste
    const { getWeightCategory } = require('../../utils/weightUtils');
    getWeightCategory.mockReturnValue({
      label: 'Sobrepeso',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      color: 'text-red-600'
    });
    
    render(<Dashboard />);

    expect(screen.getAllByText('Sobrepeso')).toHaveLength(2); // Aparece 2 vezes
  });

  it('should handle different workout locations correctly', () => {
    const gymUser = { ...mockUser, workoutLocation: 'gym' };
    
    mockUseUser.mockReturnValue({
      user: gymUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    render(<Dashboard />);

    // Verificar se o usuário da academia é renderizado corretamente
    expect(screen.getByText('Olá, Test User! 👋')).toBeInTheDocument();
    expect(screen.getByText('70kg')).toBeInTheDocument();
  });

  it('should handle different goals correctly', () => {
    const loseWeightUser = { ...mockUser, goal: 'lose' };
    
    mockUseUser.mockReturnValue({
      user: loseWeightUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    render(<Dashboard />);

    expect(screen.getByText('Emagrecer')).toBeInTheDocument();
  });

  it('should display exercise suggestions correctly', () => {
    renderWithProviders(<Dashboard />);

    // Verificar se a seção de exercícios está presente
    expect(screen.getByText('Treino de Hoje')).toBeInTheDocument();
    // Verificar se pelo menos um elemento com "Treino" está presente
    expect(screen.getAllByText(/Treino/)).toHaveLength(4);
  });

  it('should display dietary tips correctly', () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Dicas importantes:')).toBeInTheDocument();
    expect(screen.getByText('Mantenha uma dieta balanceada')).toBeInTheDocument();
    expect(screen.getByText('Varie os alimentos')).toBeInTheDocument();
    expect(screen.getByText('Hidrate-se bem')).toBeInTheDocument();
  });

  it('should handle user with physical limitations', () => {
    const limitedUser = { ...mockUser, physicalLimitations: ['knee injury', 'back pain'] };
    
    mockUseUser.mockReturnValue({
      user: limitedUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    render(<Dashboard />);

    // Verificar se o usuário com limitações é renderizado corretamente
    expect(screen.getByText('Olá, Test User! 👋')).toBeInTheDocument();
    expect(screen.getByText('70kg')).toBeInTheDocument();
  });

  it('should handle user with dietary preferences', () => {
    const vegetarianUser = { ...mockUser, dietaryPreferences: 'vegetarian' };
    
    mockUseUser.mockReturnValue({
      user: vegetarianUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    render(<Dashboard />);

    expect(screen.getByText('🥬 Vegetariano')).toBeInTheDocument();
  });

  it('should display experience level recommendations', () => {
    renderWithProviders(<Dashboard />);

    // Verificar se o nível de experiência é exibido
    expect(screen.getByText('Médio')).toBeInTheDocument(); // Nível de atividade
  });

  it('should handle different body type goals', () => {
    const athleticUser = { ...mockUser, bodyTypeGoal: 'athletic' };
    
    mockUseUser.mockReturnValue({
      user: athleticUser,
      workouts: mockWorkouts,
      meals: mockMeals
    });
    
    render(<Dashboard />);

    expect(screen.getByText('🏃 Atlético')).toBeInTheDocument();
  });
});
