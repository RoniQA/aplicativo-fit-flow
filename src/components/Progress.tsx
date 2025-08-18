import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Trophy, Star, Target, Flame, Calendar, TrendingUp, Award, Zap, Heart, Crown, Plus, Scale, Ruler, X } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
}

interface ProgressData {
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

const Progress: React.FC = () => {
  const { user, workouts, meals, progress, addProgress } = useUser();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [expandedCharts, setExpandedCharts] = useState({
    weight: false,
    measurements: false,
    workouts: false
  });
  const [metricsData, setMetricsData] = useState({
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: ''
  });

  // Sistema de badges e conquistas
  const getBadges = (): Badge[] => {
    if (!user) return [];

    const totalWorkouts = workouts.length;
    const totalMeals = meals.length;
    const daysSinceCreation = Math.ceil((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const workoutFrequency = totalWorkouts / Math.max(1, daysSinceCreation);
    
    // Badges de frequência de treino
    const workoutBadges: Badge[] = [
      {
        id: 'first_workout',
        name: 'Primeiro Passo',
        description: 'Complete seu primeiro treino',
        icon: <Star className="w-6 h-6" />,
        color: 'text-yellow-500',
        unlocked: totalWorkouts >= 1,
        progress: Math.min(totalWorkouts, 1),
        maxProgress: 1,
        unlockedAt: totalWorkouts >= 1 ? workouts[0]?.date : undefined
      },
      {
        id: 'week_warrior',
        name: 'Guerreiro da Semana',
        description: 'Treine 5 dias em uma semana',
        icon: <Target className="w-6 h-6" />,
        color: 'text-blue-500',
        unlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'month_master',
        name: 'Mestre do Mês',
        description: 'Treine 20 dias em um mês',
        icon: <Trophy className="w-6 h-6" />,
        color: 'text-purple-500',
        unlocked: false,
        progress: 0,
        maxProgress: 20
      },
      {
        id: 'streak_7',
        name: 'Sequência de 7',
        description: 'Treine 7 dias consecutivos',
        icon: <Flame className="w-6 h-6" />,
        color: 'text-orange-500',
        unlocked: false,
        progress: 0,
        maxProgress: 7
      },
      {
        id: 'streak_30',
        name: 'Sequência de 30',
        description: 'Treine 30 dias consecutivos',
        icon: <Crown className="w-6 h-6" />,
        color: 'text-yellow-600',
        unlocked: false,
        progress: 0,
        maxProgress: 30
      }
    ];

    // Badges de nutrição
    const nutritionBadges: Badge[] = [
      {
        id: 'meal_tracker',
        name: 'Rastreador de Refeições',
        description: 'Registre 10 refeições',
        icon: <Heart className="w-6 h-6" />,
        color: 'text-red-500',
        unlocked: totalMeals >= 10,
        progress: Math.min(totalMeals, 10),
        maxProgress: 10,
        unlockedAt: totalMeals >= 10 ? meals[9]?.date : undefined
      },
      {
        id: 'nutrition_consistency',
        name: 'Consistência Nutricional',
        description: 'Registre refeições por 7 dias consecutivos',
        icon: <Calendar className="w-6 h-6" />,
        color: 'text-green-500',
        unlocked: false,
        progress: 0,
        maxProgress: 7
      }
    ];

    // Badges de progresso
    const progressBadges: Badge[] = [
      {
        id: 'weight_goal',
        name: 'Objetivo de Peso',
        description: 'Alcance seu peso objetivo',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'text-blue-600',
        unlocked: false,
        progress: 0,
        maxProgress: 100
      },
      {
        id: 'fitness_level',
        name: 'Nível de Fitness',
        description: 'Mantenha consistência por 3 meses',
        icon: <Zap className="w-6 h-6" />,
        color: 'text-purple-600',
        unlocked: daysSinceCreation >= 90 && workoutFrequency >= 0.5,
        progress: Math.min(daysSinceCreation, 90),
        maxProgress: 90,
        unlockedAt: daysSinceCreation >= 90 ? new Date(user.createdAt.getTime() + 90 * 24 * 60 * 60 * 1000) : undefined
      }
    ];

    // Calcular progresso dinâmico para badges
    const calculateStreak = () => {
      if (workouts.length === 0) return 0;
      
      const sortedWorkouts = [...workouts].sort((a, b) => b.date.getTime() - a.date.getTime());
      let streak = 0;
      let currentDate = new Date();
      
      for (let i = 0; i < sortedWorkouts.length; i++) {
        const workoutDate = new Date(sortedWorkouts[i].date);
        const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
          streak++;
        } else if (diffDays > streak) {
          break;
        }
      }
      
      return streak;
    };

    const currentStreak = calculateStreak();
    
    // Atualizar badges de sequência
    workoutBadges[3].progress = Math.min(currentStreak, 7);
    workoutBadges[3].unlocked = currentStreak >= 7;
    workoutBadges[4].progress = Math.min(currentStreak, 30);
    workoutBadges[4].unlocked = currentStreak >= 30;

    return [...workoutBadges, ...nutritionBadges, ...progressBadges];
  };

  const badges = getBadges();
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  // Estatísticas do período selecionado
  const getTimeframeStats = () => {
    if (!user) return null;

    const now = new Date();
    let startDate: Date;

    switch (selectedTimeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const periodWorkouts = workouts.filter(w => w.date >= startDate);
    const periodMeals = meals.filter(m => m.date >= startDate);
    const periodProgress = progress.filter(p => p.date >= startDate);

    return {
      workouts: periodWorkouts.length,
      meals: periodMeals.length,
      progress: periodProgress.length,
      totalDuration: periodWorkouts.reduce((sum, w) => sum + w.duration, 0),
      avgWorkoutDuration: periodWorkouts.length > 0 ? periodWorkouts.reduce((sum, w) => sum + w.duration, 0) / periodWorkouts.length : 0
    };
  };

  const stats = getTimeframeStats();

  // Função para alternar gráficos
  const toggleChart = (chart: keyof typeof expandedCharts) => {
    setExpandedCharts(prev => ({
      ...prev,
      [chart]: !prev[chart]
    }));
  };

  // Função para atualizar métricas
  const handleMetricsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProgress: ProgressData = {
      id: Date.now().toString(),
      date: new Date(),
      weight: parseFloat(metricsData.weight),
      measurements: {
        chest: parseFloat(metricsData.chest),
        waist: parseFloat(metricsData.waist),
        hips: parseFloat(metricsData.hips),
        arms: parseFloat(metricsData.arms),
        thighs: parseFloat(metricsData.thighs)
      }
    };

    addProgress(newProgress);
    
    // Reset form
    setMetricsData({
      weight: '',
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    });
    
    setShowMetricsModal(false);
  };

  // Configurações dos gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Dados para o gráfico de peso
  const weightChartData = {
    labels: progress.length > 0 ? progress
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(p => p.date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })) : [],
    datasets: [
      {
        label: 'Peso (kg)',
        data: progress.length > 0 ? progress
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(p => p.weight) : [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  // Dados para o gráfico de medidas
  const measurementsChartData = {
    labels: progress.length > 0 ? progress
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(p => p.date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })) : [],
    datasets: [
      {
        label: 'Tórax (cm)',
        data: progress.length > 0 ? progress
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(p => p.measurements.chest) : [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Cintura (cm)',
        data: progress.length > 0 ? progress
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(p => p.measurements.waist) : [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Quadril (cm)',
        data: progress.length > 0 ? progress
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(p => p.measurements.hips) : [],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Braços (cm)',
        data: progress.length > 0 ? progress
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(p => p.measurements.arms) : [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Coxas (cm)',
        data: progress.length > 0 ? progress
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(p => p.measurements.thighs) : [],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  // Dados para o gráfico de frequência de treinos
  const workoutFrequencyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Treinos esta semana',
        data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => {
          const dayIndex = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].indexOf(day);
          return workouts.filter(w => w.date.getDay() === dayIndex).length;
        }),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  // Dados para o gráfico de distribuição de treinos por tipo
  const workoutTypeData = {
    labels: ['Cardio', 'Força', 'Flexibilidade', 'Misto'],
    datasets: [
      {
        data: [
          workouts.filter(w => w.type === 'cardio').length,
          workouts.filter(w => w.type === 'strength').length,
          workouts.filter(w => w.type === 'flexibility').length,
          workouts.filter(w => w.type === 'mixed').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Meu Progresso</h1>
              <p className="text-white/90">Acompanhe sua jornada fitness e conquiste badges!</p>
            </div>
                         <button
               onClick={() => setShowMetricsModal(true)}
               className="btn-primary flex items-center space-x-2 btn-touch"
             >
               <Plus className="w-5 h-5" />
               <span className="hidden sm:inline">Atualizar Métricas</span>
               <span className="sm:hidden">Métricas</span>
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 container-mobile">
        {/* Seletor de período */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Período de Análise</h2>
            <div className="flex space-x-2">
              {(['week', 'month', 'year'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {timeframe === 'week' ? 'Semana' : timeframe === 'month' ? 'Mês' : 'Ano'}
                </button>
              ))}
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 form-grid-mobile">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.workouts}</div>
                <div className="text-sm text-blue-600">Treinos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.meals}</div>
                <div className="text-sm text-green-600">Refeições</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round(stats.avgWorkoutDuration)}min</div>
                <div className="text-sm text-purple-600">Duração Média</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.totalDuration}min</div>
                <div className="text-sm text-orange-600">Tempo Total</div>
              </div>
            </div>
          )}
        </div>

        {/* Gráficos de Evolução - Expansíveis */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Evolução ao Longo do Tempo</h2>
          
          {/* Gráfico de Peso */}
          <div className="mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => toggleChart('weight')}
            >
              <div className="flex items-center space-x-3">
                <Scale className="w-5 h-5 text-primary-600" />
                <h3 className="font-medium">Evolução do Peso</h3>
              </div>
              {expandedCharts.weight ? (
                <span className="text-gray-500">▼</span>
              ) : (
                <span className="text-gray-500">▶</span>
              )}
            </div>
            
            {expandedCharts.weight && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                                 {progress.length > 0 ? (
                   <div className="h-80 chart-mobile">
                     <Line data={weightChartData} options={chartOptions} />
                   </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Scale className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum dado de peso registrado ainda</p>
                    <p className="text-sm">Clique em "Atualizar Métricas" para começar</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gráfico de Medidas */}
          <div className="mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => toggleChart('measurements')}
            >
              <div className="flex items-center space-x-3">
                <Ruler className="w-5 h-5 text-secondary-600" />
                <h3 className="font-medium">Evolução das Medidas</h3>
              </div>
              {expandedCharts.measurements ? (
                <span className="text-gray-500">▼</span>
              ) : (
                <span className="text-gray-500">▶</span>
              )}
            </div>
            
            {expandedCharts.measurements && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                                 {progress.length > 0 ? (
                   <div className="h-80 chart-mobile">
                     <Line data={measurementsChartData} options={chartOptions} />
                   </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Ruler className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma medida registrada ainda</p>
                    <p className="text-sm">Clique em "Atualizar Métricas" para começar</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gráfico de Frequência de Treinos */}
          <div className="mb-8">
            <div 
              className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => toggleChart('workouts')}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-accent-600" />
                <h3 className="font-medium">Frequência de Treinos</h3>
              </div>
              {expandedCharts.workouts ? (
                <span className="text-gray-500">▼</span>
              ) : (
                <span className="text-gray-500">▶</span>
              )}
            </div>
            
            {expandedCharts.workouts && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                {workouts.length > 0 ? (
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 form-grid-mobile">
                    <div>
                      <h4 className="text-lg font-medium mb-4 text-center">Distribuição Semanal</h4>
                                             <div className="h-64 chart-mobile">
                         <Bar data={workoutFrequencyData} options={chartOptions} />
                       </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium mb-4 text-center">Tipos de Treino</h4>
                                             <div className="h-64 chart-mobile">
                         <Doughnut data={workoutTypeData} options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: {
                              position: 'bottom' as const
                            }
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum treino registrado ainda</p>
                    <p className="text-sm">Registre seus primeiros treinos para ver a frequência</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badges Conquistados */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Badges Conquistados</h2>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {unlockedBadges.length}/{badges.length}
            </span>
          </div>

          {unlockedBadges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 form-grid-mobile">
              {unlockedBadges.map((badge) => (
                <div key={badge.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 bg-yellow-100 rounded-full ${badge.color}`}>
                      {badge.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                  {badge.unlockedAt && (
                    <div className="text-xs text-yellow-600">
                      Conquistado em {badge.unlockedAt.toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Complete treinos e refeições para conquistar seus primeiros badges!</p>
            </div>
          )}
        </div>

        {/* Badges Disponíveis */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Badges Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 form-grid-mobile">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center opacity-60">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gray-200 rounded-full text-gray-400">
                    {badge.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-600 mb-1">{badge.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{badge.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {badge.progress}/{badge.maxProgress}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas de Motivação */}
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Dica de Motivação</h3>
              <p className="text-purple-700 text-sm leading-relaxed">
                {user?.goal === 'lose' && 
                  'Lembre-se: cada treino é um passo em direção ao seu objetivo. A consistência é mais importante que a perfeição. Celebre cada pequena vitória!'
                }
                {user?.goal === 'gain' && 
                  'O músculo cresce com paciência e persistência. Cada repetição conta, cada refeição é combustível para seus ganhos. Mantenha o foco!'
                }
                {user?.goal === 'maintain' && 
                  'Manter a forma física é um estilo de vida, não uma meta temporária. Continue fazendo o que funciona para você!'
                }
              </p>
              <div className="mt-3 text-xs text-purple-600">
                <strong>Próximo badge próximo:</strong> {lockedBadges[0]?.name} - {lockedBadges[0]?.description}
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Modal para Atualizar Métricas */}
       {showMetricsModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative modal-mobile">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Atualizar Métricas</h3>
              <button
                onClick={() => setShowMetricsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

                         <form onSubmit={handleMetricsSubmit} className="space-y-4 form-mobile">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Atual (kg)
                </label>
                                 <input
                   type="number"
                   value={metricsData.weight}
                   onChange={(e) => setMetricsData(prev => ({ ...prev, weight: e.target.value }))}
                   className="input-field input-touch"
                   placeholder="70.0"
                   step="0.1"
                   min="30"
                   max="300"
                   required
                 />
              </div>

                             <div className="grid grid-cols-2 gap-4 form-grid-mobile">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Tórax (cm)
                   </label>
                   <input
                     type="number"
                     value={metricsData.chest}
                     onChange={(e) => setMetricsData(prev => ({ ...prev, chest: e.target.value }))}
                     className="input-field input-touch"
                     placeholder="95"
                     step="0.1"
                     min="50"
                     max="200"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Cintura (cm)
                   </label>
                   <input
                     type="number"
                     value={metricsData.waist}
                     onChange={(e) => setMetricsData(prev => ({ ...prev, waist: e.target.value }))}
                     className="input-field input-touch"
                     placeholder="80"
                     step="0.1"
                     min="50"
                     max="200"
                     required
                   />
                 </div>
               </div>

                             <div className="grid grid-cols-2 gap-4 form-grid-mobile">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Quadril (cm)
                   </label>
                   <input
                     type="number"
                     value={metricsData.hips}
                     onChange={(e) => setMetricsData(prev => ({ ...prev, hips: e.target.value }))}
                     className="input-field input-touch"
                     placeholder="95"
                     step="0.1"
                     min="50"
                     max="200"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Braços (cm)
                   </label>
                   <input
                     type="number"
                     value={metricsData.arms}
                     onChange={(e) => setMetricsData(prev => ({ ...prev, arms: e.target.value }))}
                     className="input-field input-touch"
                     placeholder="35"
                     step="0.1"
                     min="20"
                     max="100"
                     required
                   />
                 </div>
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coxas (cm)
                </label>
                                   <input
                     type="number"
                     value={metricsData.thighs}
                     onChange={(e) => setMetricsData(prev => ({ ...prev, thighs: e.target.value }))}
                     className="input-field input-touch"
                     placeholder="55"
                     step="0.1"
                     min="30"
                     max="150"
                     required
                   />
              </div>

                             <div className="flex space-x-3 pt-4 touch-spacing">
                 <button
                   type="button"
                   onClick={() => setShowMetricsModal(false)}
                   className="btn-outline flex-1 btn-touch"
                 >
                   Cancelar
                 </button>
                 <button
                   type="submit"
                   className="btn-primary flex-1 btn-touch"
                 >
                   Salvar Métricas
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
