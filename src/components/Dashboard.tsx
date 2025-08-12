import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Calendar, Target, Flame, Clock, Users } from 'lucide-react';
import EditUserForm from './EditUserForm';

const Dashboard: React.FC = () => {
  const { user, workouts, meals } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);

  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'lose': return 'Emagrecer';
      case 'gain': return 'Ganhar Massa';
      case 'maintain': return 'Manter Forma';
      default: return 'Fitness';
    }
  };

  const getActivityText = (level: string) => {
    switch (level) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'Médio';
    }
  };

  const getTodayWorkout = () => {
    const today = new Date().toDateString();
    return workouts.find(w => w.date.toDateString() === today);
  };

  const getTodayMeals = () => {
    const today = new Date().toDateString();
    return meals.filter(m => m.date.toDateString() === today);
  };

  const getWorkoutSuggestion = () => {
    if (!user) {
      return {
        type: 'info',
        duration: 0,
        focus: 'Complete seu perfil para receber sugestões personalizadas de treino.',
        exercises: [],
        day: ''
      };
    }

    if (!user.gender || !user.goal || !user.workoutLocation || !user.experienceLevel || !user.availableTime) {
      return {
        type: 'info',
        duration: 0,
        focus: 'Complete seu perfil para receber sugestões personalizadas de treino.',
        exercises: [],
        day: ''
      };
    }

    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayIdx = new Date().getDay();
    const todayName = weekDays[todayIdx];

    // Limitações físicas
    const hasLimitation = user.physicalLimitations && user.physicalLimitations.length > 0;

    // Sugestão para academia
    if (user.workoutLocation === 'gym') {
      if (user.goal === 'lose') {
        // Não existe rotina de hipertrofia para emagrecimento na academia, sugerir cardio
        return {
          type: 'gym',
          duration: 45,
          focus: 'Cardio e resistência para emagrecimento',
          exercises: ['Esteira', 'Bicicleta', 'Elíptico', 'HIIT', 'Abdominal'],
          day: todayName
        };
      }
      if (user.gender === 'male') {
        // Homens: rotina baseada no objetivo
        const maleRoutine: { [key: string]: { day: string; focus: string; exercises: string[]; }[] } = {
          gain: [
            { day: 'Segunda', focus: 'Peito e Tríceps', exercises: ['Supino reto', 'Supino inclinado', 'Crossover', 'Tríceps pulley', 'Mergulho'] },
            { day: 'Terça', focus: 'Costas e Bíceps', exercises: ['Puxada frente', 'Remada baixa', 'Remada unilateral', 'Rosca direta', 'Rosca alternada'] },
            { day: 'Quarta', focus: 'Pernas completo', exercises: ['Agachamento', 'Leg press', 'Cadeira extensora', 'Cadeira flexora', 'Panturrilha'] },
            { day: 'Quinta', focus: 'Ombro e Abdômen', exercises: ['Desenvolvimento', 'Elevação lateral', 'Elevação frontal', 'Abdominal', 'Prancha'] },
            { day: 'Sexta', focus: 'Peito e Costas', exercises: ['Supino reto', 'Puxada frente', 'Remada curvada', 'Crossover', 'Tríceps banco'] },
            { day: 'Sábado', focus: 'Pernas e Abdômen', exercises: ['Agachamento', 'Leg press', 'Abdominal', 'Prancha', 'Panturrilha'] },
            { day: 'Domingo', focus: 'Descanso ou cardio leve', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] }
          ],
          maintain: [
            { day: 'Segunda', focus: 'Full Body', exercises: ['Supino reto', 'Agachamento', 'Remada baixa', 'Desenvolvimento', 'Abdominal'] },
            { day: 'Terça', focus: 'Cardio e Core', exercises: ['Corrida', 'HIIT', 'Prancha', 'Abdominal'] },
            { day: 'Quarta', focus: 'Pernas e Ombro', exercises: ['Agachamento', 'Leg press', 'Desenvolvimento', 'Elevação lateral'] },
            { day: 'Quinta', focus: 'Costas e Bíceps', exercises: ['Remada curvada', 'Puxada frente', 'Rosca direta', 'Rosca alternada'] },
            { day: 'Sexta', focus: 'Peito e Tríceps', exercises: ['Supino reto', 'Supino inclinado', 'Tríceps pulley', 'Mergulho'] },
            { day: 'Sábado', focus: 'Cardio leve', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] },
            { day: 'Domingo', focus: 'Descanso', exercises: [] }
          ]
        };
        const routine = maleRoutine[user.goal] || maleRoutine['gain'];
        const todayRoutine = routine.find((r) => r.day === todayName) || routine[0];
        return {
          type: 'gym',
          duration: 60,
          focus: todayRoutine.focus + (hasLimitation ? ' (Considere suas limitações)' : ''),
          exercises: todayRoutine.exercises,
          day: todayRoutine.day
        };
      } else {
        // Mulheres: rotina baseada no objetivo
        const femaleRoutine: { [key: string]: { day: string; focus: string; exercises: string[]; }[] } = {
          gain: [
            { day: 'Segunda', focus: 'Quadríceps', exercises: ['Agachamento', 'Cadeira extensora', 'Leg press', 'Afundo', 'Avanço'] },
            { day: 'Terça', focus: 'Posterior e Glúteo', exercises: ['Cadeira flexora', 'Stiff', 'Glúteo máquina', 'Elevação pélvica', 'Abdução'] },
            { day: 'Quarta', focus: 'Superior completo', exercises: ['Desenvolvimento', 'Puxada frente', 'Remada baixa', 'Rosca direta', 'Tríceps pulley'] },
            { day: 'Quinta', focus: 'Quadríceps e Abdômen', exercises: ['Agachamento', 'Leg press', 'Abdominal', 'Prancha', 'Cadeira extensora'] },
            { day: 'Sexta', focus: 'Posterior/Glúteo e Abdômen', exercises: ['Stiff', 'Glúteo máquina', 'Abdução', 'Abdominal', 'Prancha'] },
            { day: 'Sábado', focus: 'Superior completo', exercises: ['Desenvolvimento', 'Puxada frente', 'Remada curvada', 'Rosca alternada', 'Tríceps banco'] },
            { day: 'Domingo', focus: 'Descanso ou cardio leve', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] }
          ],
          maintain: [
            { day: 'Segunda', focus: 'Full Body', exercises: ['Agachamento', 'Desenvolvimento', 'Remada baixa', 'Abdominal', 'Prancha'] },
            { day: 'Terça', focus: 'Cardio e Core', exercises: ['Corrida', 'HIIT', 'Prancha', 'Abdominal'] },
            { day: 'Quarta', focus: 'Glúteo e Posterior', exercises: ['Stiff', 'Glúteo máquina', 'Abdução', 'Cadeira flexora'] },
            { day: 'Quinta', focus: 'Quadríceps e Ombro', exercises: ['Agachamento', 'Cadeira extensora', 'Desenvolvimento', 'Elevação lateral'] },
            { day: 'Sexta', focus: 'Superior completo', exercises: ['Desenvolvimento', 'Puxada frente', 'Remada curvada', 'Rosca alternada', 'Tríceps banco'] },
            { day: 'Sábado', focus: 'Cardio leve', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] },
            { day: 'Domingo', focus: 'Descanso', exercises: [] }
          ]
        };
        const routine = femaleRoutine[user.goal] || femaleRoutine['gain'];
        const todayRoutine = routine.find((r) => r.day === todayName) || routine[0];
        return {
          type: 'gym',
          duration: 60,
          focus: todayRoutine.focus + (hasLimitation ? ' (Considere suas limitações)' : ''),
          exercises: todayRoutine.exercises,
          day: todayRoutine.day
        };
      }
    }

    // Sugestão para outros locais de treino
    if (user.workoutLocation === 'home') {
      return {
        type: 'home',
        duration: 40,
        focus: user.goal === 'gain' ? 'Treino funcional para hipertrofia' : user.goal === 'lose' ? 'Cardio e resistência' : 'Manutenção física',
        exercises: user.goal === 'gain'
          ? ['Flexão', 'Agachamento', 'Avanço', 'Prancha', 'Burpee']
          : user.goal === 'lose'
            ? ['Polichinelo', 'Corrida estacionária', 'Mountain climber', 'Abdominal', 'Prancha']
            : ['Agachamento', 'Prancha', 'Abdominal', 'Flexão', 'Alongamento'],
        day: todayName
      };
    }

    // Sugestão padrão
    return {
      type: 'default',
      duration: 30,
      focus: 'Treino leve para saúde geral',
      exercises: ['Caminhada', 'Alongamento', 'Abdominal'],
      day: todayName
    };
  };

  const getDietSuggestion = () => {
    if (!user) return null;

    const suggestions = {
      lose: {
        calories: Math.round(user.weight * 25),
        focus: 'Déficit calórico moderado',
        tips: ['Priorize proteínas magras', 'Consuma muitas fibras', 'Evite açúcares refinados']
      },
      gain: {
        calories: Math.round(user.weight * 35),
        focus: 'Superávit calórico controlado',
        tips: ['Aumente o consumo de proteínas', 'Inclua carboidratos complexos', 'Consuma gorduras boas']
      },
      maintain: {
        calories: Math.round(user.weight * 30),
        focus: 'Equilíbrio calórico',
        tips: ['Mantenha uma dieta balanceada', 'Varie os alimentos', 'Hidrate-se bem']
      }
    };

    return suggestions[user.goal];
  };

  const workoutSuggestion = getWorkoutSuggestion();
  const dietSuggestion = getDietSuggestion();
  const todayWorkout = getTodayWorkout();
  const todayMeals = getTodayMeals();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modal de edição de usuário */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Fechar"
            >
              <span style={{fontSize: 24, fontWeight: 'bold'}}>&times;</span>
            </button>
            <EditUserForm />
          </div>
        </div>
      )}
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                Olá, {user?.name}! 👋
                <button
                  onClick={() => setShowEditModal(true)}
                  className="ml-2 px-3 py-1 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 border border-white/30 transition"
                >
                  Editar Perfil
                </button>
              </h1>
              <p className="text-white/90">Vamos alcançar seus objetivos de fitness hoje!</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Objetivo</div>
              <div className="font-semibold">{getGoalText(user?.goal || '')}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{user?.weight}kg</div>
              <div className="text-sm text-white/80">Peso Atual</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{user?.height}cm</div>
              <div className="text-sm text-white/80">Altura</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{getActivityText(user?.activityLevel || '')}</div>
              <div className="text-sm text-white/80">Nível de Atividade</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sugestão de Treino */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold">Treino de Hoje</h3>
            </div>
            
            {todayWorkout ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Treino registrado para hoje</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="font-medium text-green-800">✅ Treino Concluído!</div>
                  <div className="text-sm text-green-600">{todayWorkout.type} - {todayWorkout.duration}min</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="font-medium text-primary-800 mb-2">
                    {user?.workoutLocation === 'home' ? '🏠 Treino em Casa' :
                     user?.workoutLocation === 'gym' ? '🏋️ Treino na Academia' :
                     user?.workoutLocation === 'crossfit' ? '🔥 Treino CrossFit' :
                     user?.workoutLocation === 'outdoor' ? '🌳 Treino ao Ar Livre' :
                     '🔄 Treino Misto'}
                  </div>
                  {workoutSuggestion?.day && (
                    <div className="text-xs text-primary-600 mb-1">Dia: <strong>{workoutSuggestion.day}</strong></div>
                  )}
                  <div className="text-sm text-primary-700 mb-3">
                    {workoutSuggestion?.focus}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-primary-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{workoutSuggestion?.duration} minutos</span>
                  </div>
                  <div className="text-xs text-primary-600">
                    <strong>Duração sugerida:</strong> {user?.availableTime === 'flexible' ? 'Ajuste conforme sua disponibilidade' : user?.availableTime}
                    {user?.experienceLevel === 'beginner' && ' • Comece com intensidade moderada'}
                    {user?.experienceLevel === 'advanced' && ' • Aumente a intensidade gradualmente'}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-2">Exercícios sugeridos:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {workoutSuggestion?.exercises.map((exercise, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg px-3 py-2 text-center text-sm">
                        {exercise}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sugestão de Dieta */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-accent-100 rounded-lg">
                <Flame className="w-5 h-5 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold">Nutrição de Hoje</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <div className="font-medium text-accent-800 mb-2">
                  🍽️ Plano Alimentar
                  {user?.dietaryPreferences !== 'none' && (
                    <span className="ml-2 text-xs bg-accent-200 text-accent-800 px-2 py-1 rounded-full">
                      {user?.dietaryPreferences === 'vegetarian' ? '🥬 Vegetariano' :
                       user?.dietaryPreferences === 'vegan' ? '🌱 Vegano' :
                       user?.dietaryPreferences === 'glutenFree' ? '🌾 Sem Glúten' :
                       user?.dietaryPreferences === 'lactoseFree' ? '🥛 Sem Lactose' :
                       user?.dietaryPreferences === 'keto' ? '🥑 Keto' :
                       user?.dietaryPreferences === 'paleo' ? '🦴 Paleo' : ''}
                    </span>
                  )}
                </div>
                <div className="text-sm text-accent-700 mb-3">
                  {dietSuggestion?.focus}
                </div>
                <div className="flex items-center space-x-2 text-sm text-accent-600 mb-2">
                  <Flame className="w-4 h-4" />
                  <span>{dietSuggestion?.calories} kcal/dia</span>
                </div>
                <div className="text-xs text-accent-600">
                  <strong>Tipo de corpo desejado:</strong> {user?.bodyTypeGoal === 'athletic' ? '🏃 Atlético' :
                   user?.bodyTypeGoal === 'lean' ? '💪 Magro e definido' :
                   user?.bodyTypeGoal === 'muscular' ? '🔥 Musculoso' :
                   user?.bodyTypeGoal === 'toned' ? '✨ Tonificado' :
                   user?.bodyTypeGoal === 'flexible' ? '🧘 Flexível' : '✨ Equilibrado'}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-2">Dicas importantes:</div>
                <ul className="space-y-1">
                  {dietSuggestion?.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-accent-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo do Dia */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Resumo do Dia</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {todayWorkout ? '✅' : '⏳'}
              </div>
              <div className="text-sm text-gray-600 mt-1">Treino</div>
              <div className="text-xs text-gray-500">
                {todayWorkout ? 'Concluído' : 'Pendente'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-accent-600">
                {todayMeals.length}/4
              </div>
              <div className="text-sm text-gray-600 mt-1">Refeições</div>
              <div className="text-xs text-gray-500">
                {todayMeals.length === 4 ? 'Completo' : 'Pendente'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-secondary-600">
                {Math.round((workouts.length / Math.max(1, Math.ceil((Date.now() - (user?.createdAt.getTime() || Date.now())) / (1000 * 60 * 60 * 24)))) * 100)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Consistência</div>
              <div className="text-xs text-gray-500">Esta semana</div>
            </div>
          </div>
        </div>

        {/* Dica do Dia */}
        <div className="card bg-gradient-to-r from-secondary-50 to-primary-50 border-secondary-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Users className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-secondary-800 mb-2">Dica do Dia</h4>
              <p className="text-secondary-700 text-sm leading-relaxed">
                {user?.goal === 'lose' && 
                  `Lembre-se: a consistência é mais importante que a intensidade. ${user?.workoutLocation === 'home' ? 'Um treino de 30 minutos em casa todos os dias' : 'Um treino regular'} é melhor que um treino longo esporádico. ${user?.experienceLevel === 'beginner' ? 'Como iniciante, comece devagar e aumente gradualmente.' : ''}`
                }
                {user?.goal === 'gain' && 
                  `Para ganhar massa muscular, priorize o descanso adequado e a alimentação rica em proteínas. ${user?.dietaryPreferences === 'vegetarian' || user?.dietaryPreferences === 'vegan' ? 'Como vegetariano, foque em proteínas vegetais como quinoa, lentilhas e tofu.' : 'O músculo cresce durante o repouso, não durante o treino.'} ${user?.workoutLocation === 'gym' ? 'Aproveite os equipamentos da academia para exercícios compostos.' : ''}`
                }
                {user?.goal === 'maintain' && 
                  `Manter a forma física é um estilo de vida. ${user?.bodyTypeGoal === 'flexible' ? 'Para um corpo flexível, inclua alongamentos e yoga em sua rotina.' : user?.bodyTypeGoal === 'athletic' ? 'Para um corpo atlético, equilibre força e cardio.' : 'Encontre atividades que você realmente goste para manter a motivação a longo prazo.'}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
