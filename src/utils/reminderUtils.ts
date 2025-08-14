import { User } from '../contexts/UserContext';

export interface SuggestedReminder {
  type: 'exercise' | 'meal' | 'hydration' | 'progress' | 'goal';
  title: string;
  message: string;
  time: string;
  days: number[];
  priority: 'low' | 'medium' | 'high';
  category: string;
  icon: string;
  color: string;
  reason: string;
}

export const generateSuggestedReminders = (user: User): SuggestedReminder[] => {
  const suggestions: SuggestedReminder[] = [];

  // Horários baseados no objetivo e perfil
  if (user.goal === 'lose') {
    // Para emagrecimento: treino matinal + refeições controladas
    suggestions.push(
      {
        type: 'exercise',
        title: '🌅 Treino Matinal para Emagrecer',
        message: 'Comece o dia queimando calorias! Treino matinal acelera o metabolismo.',
        time: '06:30',
        days: [1, 2, 3, 4, 5], // Segunda a Sexta
        priority: 'high',
        category: 'Fitness',
        icon: '🏃',
        color: 'primary',
        reason: 'Treino matinal acelera o metabolismo e queima mais gordura'
      },
      {
        type: 'meal',
        title: '🍳 Café da Manhã Proteico',
        message: 'Proteína no café da manhã ajuda a controlar o apetite o dia todo.',
        time: '07:30',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'high',
        category: 'Nutrição',
        icon: '🥚',
        color: 'accent',
        reason: 'Proteína no café controla o apetite e mantém massa muscular'
      },
      {
        type: 'meal',
        title: '🥗 Almoço Equilibrado',
        message: 'Foco em proteínas magras e vegetais para saciedade duradoura.',
        time: '12:30',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'medium',
        category: 'Nutrição',
        icon: '🥗',
        color: 'accent',
        reason: 'Almoço equilibrado evita lanches calóricos à tarde'
      },
      {
        type: 'hydration',
        title: '💧 Hidratação Matinal',
        message: 'Beba água com limão para desintoxicar e acelerar o metabolismo.',
        time: '06:00',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'medium',
        category: 'Saúde',
        icon: '💧',
        color: 'secondary',
        reason: 'Água com limão desintoxica e acelera o metabolismo'
      }
    );
  } else if (user.goal === 'gain') {
    // Para ganho de massa: treino à tarde + refeições frequentes
    suggestions.push(
      {
        type: 'exercise',
        title: '🏋️ Treino para Hipertrofia',
        message: 'Horário ideal para treino de força! Seus hormônios estão no pico.',
        time: '17:00',
        days: [1, 2, 3, 4, 5], // Segunda a Sexta
        priority: 'high',
        category: 'Fitness',
        icon: '💪',
        color: 'primary',
        reason: 'Tarde é o pico de testosterona para ganho muscular'
      },
      {
        type: 'meal',
        title: '🥛 Shake Pós-Treino',
        message: 'Proteína + carboidrato nas primeiras 2 horas pós-treino.',
        time: '19:00',
        days: [1, 2, 3, 4, 5], // Segunda a Sexta
        priority: 'high',
        category: 'Nutrição',
        icon: '🥛',
        color: 'accent',
        reason: 'Janela anabólica para máxima absorção de nutrientes'
      },
      {
        type: 'meal',
        title: '🌙 Ceia Proteica',
        message: 'Proteína caseína para recuperação muscular durante o sono.',
        time: '21:30',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'medium',
        category: 'Nutrição',
        icon: '🌙',
        color: 'accent',
        reason: 'Proteína caseína repara músculos durante o sono'
      }
    );
  } else {
    // Para manutenção: equilíbrio entre treino e alimentação
    suggestions.push(
      {
        type: 'exercise',
        title: '⚖️ Treino de Manutenção',
        message: 'Mantenha a consistência! Treino regular é melhor que intenso.',
        time: '18:00',
        days: [1, 2, 3, 4, 5], // Segunda a Sexta
        priority: 'medium',
        category: 'Fitness',
        icon: '⚖️',
        color: 'primary',
        reason: 'Horário equilibrado para manter forma física'
      },
      {
        type: 'meal',
        title: '🍽️ Refeições Regulares',
        message: 'Mantenha horários regulares para estabilizar o metabolismo.',
        time: '08:00',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'medium',
        category: 'Nutrição',
        icon: '🍽️',
        color: 'accent',
        reason: 'Horários regulares estabilizam o metabolismo'
      }
    );
  }

  // Adicionar lembretes baseados no local de treino
  if (user.workoutLocation === 'gym') {
    suggestions.push({
      type: 'exercise',
      title: '🏋️ Preparar para Academia',
      message: 'Separe roupas e prepare sua garrafa de água para o treino.',
      time: '16:30',
      days: [1, 2, 3, 4, 5], // Segunda a Sexta
      priority: 'low',
      category: 'Preparação',
      icon: '🎒',
      color: 'primary',
      reason: 'Preparação antecipada aumenta a chance de ir treinar'
    });
  } else if (user.workoutLocation === 'home') {
    suggestions.push({
      type: 'exercise',
      title: '🏠 Preparar Espaço de Treino',
      message: 'Organize o espaço e prepare os equipamentos para treinar em casa.',
      time: '06:00',
      days: [1, 2, 3, 4, 5], // Segunda a Sexta
      priority: 'low',
      category: 'Preparação',
      icon: '🏠',
      color: 'primary',
      reason: 'Ambiente organizado motiva o treino em casa'
    });
  }

  // Adicionar lembretes baseados no nível de experiência
  if (user.experienceLevel === 'beginner') {
    suggestions.push({
      type: 'progress',
      title: '📊 Medir Progresso Semanal',
      message: 'Como iniciante, medir progresso semanal te motiva a continuar.',
      time: '09:00',
      days: [0], // Domingo
      priority: 'medium',
      category: 'Progresso',
      icon: '📊',
      color: 'success',
      reason: 'Medir progresso motiva iniciantes a manter consistência'
    });
  } else if (user.experienceLevel === 'advanced') {
    suggestions.push({
      type: 'goal',
      title: '🎯 Revisar Metas Mensais',
      message: 'Como avançado, revise e ajuste suas metas mensais.',
      time: '20:00',
      days: [0], // Domingo
      priority: 'medium',
      category: 'Metas',
      icon: '🎯',
      color: 'warning',
      reason: 'Revisão mensal mantém avançados focados em evolução'
    });
  }

  // Adicionar lembretes de hidratação baseados no nível de atividade
  if (user.activityLevel === 'high') {
    suggestions.push(
      {
        type: 'hydration',
        title: '💧 Hidratação Intensiva',
        message: 'Nível alto de atividade requer hidratação extra.',
        time: '10:00',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'medium',
        category: 'Saúde',
        icon: '💧',
        color: 'secondary',
        reason: 'Atividade alta requer hidratação extra'
      },
      {
        type: 'hydration',
        title: '💧 Hidratação Intensiva',
        message: 'Continue hidratando para recuperação muscular.',
        time: '15:00',
        days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
        priority: 'medium',
        category: 'Saúde',
        icon: '💧',
        color: 'secondary',
        reason: 'Hidratação contínua para recuperação muscular'
      }
    );
  }

  // Adicionar lembretes baseados em preferências dietéticas
  if (user.dietaryPreferences === 'vegetarian' || user.dietaryPreferences === 'vegan') {
    suggestions.push({
      type: 'meal',
      title: '🥬 Suplementação Vegetariana',
      message: 'Considere suplementar vitamina B12 e ômega-3.',
      time: '08:30',
      days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
      priority: 'low',
      category: 'Nutrição',
      icon: '🥬',
      color: 'accent',
      reason: 'Vegetarianos precisam suplementar B12 e ômega-3'
    });
  }

  return suggestions;
};

export const getOptimalWorkoutTime = (user: User): string => {
  if (user.goal === 'lose') {
    return '06:30'; // Manhã para acelerar metabolismo
  } else if (user.goal === 'gain') {
    return '17:00'; // Tarde para pico hormonal
  } else {
    return '18:00'; // Meio da tarde para equilíbrio
  }
};

export const getOptimalMealTimes = (user: User): string[] => {
  if (user.goal === 'lose') {
    return ['07:30', '12:30', '18:00']; // 3 refeições principais
  } else if (user.goal === 'gain') {
    return ['07:00', '10:00', '13:00', '16:00', '19:00', '21:30']; // 6 refeições
  } else {
    return ['08:00', '12:00', '18:00']; // 3 refeições equilibradas
  }
};

export const getOptimalHydrationTimes = (user: User): string[] => {
  if (user.activityLevel === 'high') {
    return ['06:00', '10:00', '15:00', '20:00']; // 4 vezes ao dia
  } else {
    return ['08:00', '12:00', '18:00']; // 3 vezes ao dia
  }
};
