import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  goal: 'lose' | 'gain' | 'maintain';
  activityLevel: 'low' | 'medium' | 'high';
  workoutLocation: 'home' | 'gym' | 'crossfit' | 'outdoor' | 'mixed';
  bodyTypeGoal: 'athletic' | 'lean' | 'muscular' | 'toned' | 'flexible';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  physicalLimitations: string[];
  dietaryPreferences: 'none' | 'vegetarian' | 'vegan' | 'glutenFree' | 'lactoseFree' | 'keto' | 'paleo';
  availableTime: '15min' | '30min' | '45min' | '60min' | '90min' | 'flexible';
  createdAt: Date;
}

export interface Workout {
  id: string;
  date: Date;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  duration: number; // em minutos
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // para exercícios de tempo
}

export interface Meal {
  id: string;
  date: Date;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  notes?: string;
}

export interface Food {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Progress {
  id: string;
  date: Date;
  weight: number;
  measurements: {
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    thighs: number;
  };
}

interface UserContextType {
  user: User | null;
  workouts: Workout[];
  meals: Meal[];
  progress: Progress[];
  setUser: (user: User) => void;
  addWorkout: (workout: Workout) => void;
  addMeal: (meal: Meal) => void;
  addProgress: (progress: Progress) => void;
  updateUser: (updates: Partial<User>) => void;
  clearData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      try {
        const savedUser = localStorage.getItem('fitflow_user');
        const savedWorkouts = localStorage.getItem('fitflow_workouts');
        const savedMeals = localStorage.getItem('fitflow_meals');
        const savedProgress = localStorage.getItem('fitflow_progress');

        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData.createdAt = new Date(userData.createdAt);
          // Adicionar campos padrão para usuários existentes
          if (!userData.workoutLocation) userData.workoutLocation = 'home';
          if (!userData.bodyTypeGoal) userData.bodyTypeGoal = 'toned';
          if (!userData.experienceLevel) userData.experienceLevel = 'beginner';
          if (!userData.physicalLimitations) userData.physicalLimitations = [];
          if (!userData.dietaryPreferences) userData.dietaryPreferences = 'none';
          if (!userData.availableTime) userData.availableTime = '45min';
          setUserState(userData);
        }

        if (savedWorkouts) {
          const workoutsData = JSON.parse(savedWorkouts);
          workoutsData.forEach((workout: any) => {
            workout.date = new Date(workout.date);
          });
          setWorkouts(workoutsData);
        }

        if (savedMeals) {
          const mealsData = JSON.parse(savedMeals);
          mealsData.forEach((meal: any) => {
            meal.date = new Date(meal.date);
          });
          setMeals(mealsData);
        }

        if (savedProgress) {
          const progressData = JSON.parse(savedProgress);
          progressData.forEach((prog: any) => {
            prog.date = new Date(prog.date);
          });
          setProgress(progressData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    if (user) {
      localStorage.setItem('fitflow_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fitflow_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitflow_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fitflow_progress', JSON.stringify(progress));
  }, [progress]);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUserState({ ...user, ...updates });
    }
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => [workout, ...prev]);
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [meal, ...prev]);
  };

  const addProgress = (newProgress: Progress) => {
    setProgress(prev => [newProgress, ...prev]);
  };

  const clearData = () => {
    setUserState(null);
    setWorkouts([]);
    setMeals([]);
    setProgress([]);
    localStorage.removeItem('fitflow_user');
    localStorage.removeItem('fitflow_workouts');
    localStorage.removeItem('fitflow_meals');
    localStorage.removeItem('fitflow_progress');
  };

  const value: UserContextType = {
    user,
    workouts,
    meals,
    progress,
    setUser,
    addWorkout,
    addMeal,
    addProgress,
    updateUser,
    clearData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
