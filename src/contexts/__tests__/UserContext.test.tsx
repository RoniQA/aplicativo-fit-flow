import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';
import { User, Workout, Meal, Progress } from '../UserContext';

// Componente de teste para usar o contexto
const TestComponent = () => {
  const { 
    user, 
    workouts, 
    meals, 
    progress, 
    setUser, 
    addWorkout, 
    addMeal, 
    addProgress, 
    updateUser, 
    clearData 
  } = useUser();
  
  const testUser: User = {
    id: '1',
    name: 'Test User',
    age: 25,
    weight: 70,
    height: 170,
    gender: 'male',
    goal: 'maintain',
    activityLevel: 'medium',
    workoutLocation: 'home',
    bodyTypeGoal: 'toned',
    experienceLevel: 'beginner',
    physicalLimitations: [],
    dietaryPreferences: 'none',
    availableTime: '45min',
    createdAt: new Date()
  };

  const testWorkout: Workout = {
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
  };

  const testMeal: Meal = {
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
  };

  const testProgress: Progress = {
    id: '1',
    date: new Date(),
    weight: 70,
    measurements: {
      chest: 95,
      waist: 80,
      hips: 95,
      arms: 30,
      thighs: 55
    }
  };
  
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'no-user'}</div>
      <div data-testid="workouts-count">{workouts.length}</div>
      <div data-testid="meals-count">{meals.length}</div>
      <div data-testid="progress-count">{progress.length}</div>
      
      <button onClick={() => setUser(testUser)} data-testid="set-user-btn">
        Set User
      </button>
      
      <button onClick={() => addWorkout(testWorkout)} data-testid="add-workout-btn">
        Add Workout
      </button>
      
      <button onClick={() => addMeal(testMeal)} data-testid="add-meal-btn">
        Add Meal
      </button>
      
      <button onClick={() => addProgress(testProgress)} data-testid="add-progress-btn">
        Add Progress
      </button>
      
      <button onClick={() => updateUser({ weight: 75 })} data-testid="update-user-btn">
        Update User
      </button>
      
      <button onClick={clearData} data-testid="clear-data-btn">
        Clear Data
      </button>
    </div>
  );
};

// Mock do localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  it('should provide user context to children', () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('user-name')).toBeInTheDocument();
    expect(screen.getByTestId('workouts-count')).toBeInTheDocument();
    expect(screen.getByTestId('meals-count')).toBeInTheDocument();
    expect(screen.getByTestId('progress-count')).toBeInTheDocument();
  });

  it('should set user when setUser is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByTestId('set-user-btn');
    
    act(() => {
      setUserButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    });
  });

  it('should add workout when addWorkout is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const addWorkoutButton = screen.getByTestId('add-workout-btn');
    
    act(() => {
      addWorkoutButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('workouts-count')).toHaveTextContent('1');
    });
  });

  it('should add meal when addMeal is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const addMealButton = screen.getByTestId('add-meal-btn');
    
    act(() => {
      addMealButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('meals-count')).toHaveTextContent('1');
    });
  });

  it('should add progress when addProgress is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const addProgressButton = screen.getByTestId('add-progress-btn');
    
    act(() => {
      addProgressButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('progress-count')).toHaveTextContent('1');
    });
  });

  it('should update user when updateUser is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Primeiro definir o usuário
    const setUserButton = screen.getByTestId('set-user-btn');
    act(() => {
      setUserButton.click();
    });

    // Depois atualizar
    const updateUserButton = screen.getByTestId('update-user-btn');
    act(() => {
      updateUserButton.click();
    });

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'fitflow_user',
        expect.stringContaining('"weight":75')
      );
    });
  });

  it('should clear all data when clearData is called', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Adicionar alguns dados primeiro
    const setUserButton = screen.getByTestId('set-user-btn');
    const addWorkoutButton = screen.getByTestId('add-workout-btn');
    
    act(() => {
      setUserButton.click();
      addWorkoutButton.click();
    });

    // Verificar que os dados foram adicionados
    await waitFor(() => {
      expect(screen.getByTestId('workouts-count')).toHaveTextContent('1');
    });

    // Limpar dados
    const clearDataButton = screen.getByTestId('clear-data-btn');
    act(() => {
      clearDataButton.click();
    });

    // Verificar que os dados foram limpos
    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('no-user');
      expect(screen.getByTestId('workouts-count')).toHaveTextContent('0');
      expect(screen.getByTestId('meals-count')).toHaveTextContent('0');
      expect(screen.getByTestId('progress-count')).toHaveTextContent('0');
    });

    // Verificar se localStorage foi limpo
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('fitflow_user');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('fitflow_workouts');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('fitflow_meals');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('fitflow_progress');
  });

  it('should load user data from localStorage on mount', async () => {
    const mockUserData = {
      id: '1',
      name: 'Saved User',
      age: 30,
      weight: 80,
      height: 175,
      gender: 'female',
      goal: 'lose',
      activityLevel: 'high',
      workoutLocation: 'gym',
      bodyTypeGoal: 'athletic',
      experienceLevel: 'intermediate',
      physicalLimitations: ['knee injury'],
      dietaryPreferences: 'vegetarian',
      availableTime: '60min',
      createdAt: new Date().toISOString()
    };

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'fitflow_user') {
        return JSON.stringify(mockUserData);
      }
      return null;
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-name')).toHaveTextContent('Saved User');
    });
  });

  it('should save data to localStorage when data changes', async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const setUserButton = screen.getByTestId('set-user-btn');
    
    act(() => {
      setUserButton.click();
    });

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'fitflow_user',
        expect.stringContaining('Test User')
      );
    });
  });

  it('should throw error when useUser is used outside UserProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useUser must be used within a UserProvider');
    
    consoleSpy.mockRestore();
  });
});
