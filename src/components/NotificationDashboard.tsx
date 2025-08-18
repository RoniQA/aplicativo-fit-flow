import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Bell, X, CheckCircle, AlertCircle, Info, Star } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const NotificationDashboard: React.FC = () => {
  const { user, workouts, meals } = useUser();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Adicionar toast
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto-remover toast após duração
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  // Remover toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Verificar conquistas e mostrar notificações
  useEffect(() => {
    if (!user) return;

    // Verificar primeiro treino
    if (workouts.length === 1) {
      addToast({
        type: 'success',
        message: '🎉 Parabéns! Você completou seu primeiro treino!',
        duration: 6000
      });
    }

    // Verificar sequência de treinos
    if (workouts.length >= 3) {
      const recentWorkouts = workouts.slice(-3);
      const isConsecutive = recentWorkouts.every((workout, index) => {
        if (index === 0) return true;
        const prevDate = new Date(recentWorkouts[index - 1].date);
        const currDate = new Date(workout.date);
        const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays === 1;
      });

      if (isConsecutive) {
        addToast({
          type: 'info',
          message: '🔥 Incrível! Você treinou 3 dias consecutivos!',
          duration: 5000
        });
      }
    }

    // Verificar primeira refeição
    if (meals.length === 1) {
      addToast({
        type: 'success',
        message: '🍽️ Ótimo! Você registrou sua primeira refeição!',
        duration: 5000
      });
    }

    // Verificar objetivo de peso (simulado)
    if (user.goal === 'lose' && user.weight > 70) {
      addToast({
        type: 'warning',
        message: '💪 Continue firme! A consistência é a chave para alcançar seu objetivo.',
        duration: 7000
      });
    }

  }, [workouts.length, meals.length, user]);

  // Estatísticas de notificações
  const getNotificationStats = () => {
    const today = new Date().toDateString();
    const todayWorkouts = workouts.filter(w => w.date.toDateString() === today);
    const todayMeals = meals.filter(m => m.date.toDateString() === today);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekWorkouts = workouts.filter(w => w.date > weekAgo);
    const weekMeals = meals.filter(m => m.date > weekAgo);

    return {
      todayWorkouts: todayWorkouts.length,
      todayMeals: todayMeals.length,
      weekWorkouts: weekWorkouts.length,
      weekMeals: weekMeals.length,
      totalWorkouts: workouts.length,
      totalMeals: meals.length
    };
  };

  const stats = getNotificationStats();

  // Dicas motivacionais baseadas no progresso
  const getMotivationalTip = () => {
    if (stats.weekWorkouts >= 5) {
      return {
        icon: '🏆',
        message: 'Você é um guerreiro da semana! Mantenha essa energia!',
        color: 'text-yellow-600'
      };
    } else if (stats.weekWorkouts >= 3) {
      return {
        icon: '🔥',
        message: 'Bom trabalho! Você está construindo um hábito saudável.',
        color: 'text-orange-600'
      };
    } else if (stats.weekWorkouts >= 1) {
      return {
        icon: '⭐',
        message: 'Cada treino conta! Continue assim!',
        color: 'text-blue-600'
      };
    } else {
      return {
        icon: '💪',
        message: 'Que tal começar hoje? Um pequeno passo faz uma grande diferença!',
        color: 'text-green-600'
      };
    }
  };

  const motivationalTip = getMotivationalTip();

  return (
    <>
      {/* Sistema de Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type} animate-slide-in flex items-center space-x-3 min-w-80`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-sm font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Dashboard de Notificações */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold">Notificações e Lembretes</h3>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
          >
            {showNotifications ? 'Ocultar' : 'Ver todas'}
          </button>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 form-grid-mobile">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{stats.todayWorkouts}</div>
            <div className="text-xs text-blue-600">Treinos Hoje</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{stats.todayMeals}</div>
            <div className="text-xs text-green-600">Refeições Hoje</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{stats.weekWorkouts}</div>
            <div className="text-xs text-purple-600">Treinos Semana</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{stats.weekMeals}</div>
            <div className="text-xs text-orange-600">Refeições Semana</div>
          </div>
        </div>

        {/* Dica motivacional */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{motivationalTip.icon}</div>
            <div>
              <p className={`text-sm font-medium ${motivationalTip.color}`}>
                {motivationalTip.message}
              </p>
            </div>
          </div>
        </div>

        {/* Notificações expandidas */}
        {showNotifications && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            {/* Lembretes baseados no objetivo */}
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-1 bg-primary-100 rounded-full">
                <Star className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">
                  {user?.goal === 'lose' && 'Lembrete de Emagrecimento'}
                  {user?.goal === 'gain' && 'Lembrete de Hipertrofia'}
                  {user?.goal === 'maintain' && 'Lembrete de Manutenção'}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {user?.goal === 'lose' && 
                    'Mantenha o déficit calórico e faça cardio regularmente. Hidrate-se bem!'
                  }
                  {user?.goal === 'gain' && 
                    'Priorize proteínas e descanso. O músculo cresce durante o repouso!'
                  }
                  {user?.goal === 'maintain' && 
                    'Equilibre treino e alimentação. A consistência é fundamental!'
                  }
                </div>
              </div>
            </div>

            {/* Lembretes de hidratação */}
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-1 bg-blue-100 rounded-full">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800">
                  Lembrete de Hidratação
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Beba pelo menos 2L de água por dia. A hidratação é essencial para o desempenho!
                </div>
              </div>
            </div>

            {/* Lembretes de sono */}
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-1 bg-purple-100 rounded-full">
                <Info className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-800">
                  Lembrete de Sono
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  Durma 7-9 horas por noite. A recuperação muscular acontece durante o sono!
                </div>
              </div>
            </div>

            {/* Próximas metas */}
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-green-800">
                  Próximas Metas
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {stats.weekWorkouts < 5 && `Faltam ${5 - stats.weekWorkouts} treinos para completar a semana!`}
                  {stats.weekWorkouts >= 5 && 'Parabéns! Você completou a meta semanal de treinos!'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botão para adicionar lembretes personalizados */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => addToast({
              type: 'info',
              message: '🔔 Funcionalidade de lembretes personalizados em desenvolvimento!',
              duration: 4000
            })}
            className="w-full py-2 px-4 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm"
          >
            + Adicionar Lembrete Personalizado
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDashboard;
