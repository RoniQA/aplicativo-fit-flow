import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Progress as ProgressType } from '../contexts/UserContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Plus, TrendingUp, Scale, Ruler, Calendar, X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Progress: React.FC = () => {
  const { user, progress, workouts, meals, addProgress } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [progressData, setProgressData] = useState({
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProgressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProgress: ProgressType = {
      id: Date.now().toString(),
      date: new Date(),
      weight: parseFloat(progressData.weight),
      measurements: {
        chest: parseFloat(progressData.chest),
        waist: parseFloat(progressData.waist),
        hips: parseFloat(progressData.hips),
        arms: parseFloat(progressData.arms),
        thighs: parseFloat(progressData.thighs),
      },
    };

    addProgress(newProgress);
    
    // Reset form
    setProgressData({
      weight: '', chest: '', waist: '', hips: '', arms: '', thighs: ''
    });
    setShowForm(false);
    
    alert('Progresso registrado com sucesso!');
  };

  const sortedProgress = [...progress].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Dados para o gráfico de peso
  const weightChartData = {
    labels: sortedProgress.map(p => p.date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Peso (kg)',
        data: sortedProgress.map(p => p.weight),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Dados para o gráfico de medidas
  const measurementsChartData = {
    labels: sortedProgress.map(p => p.date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Tórax (cm)',
        data: sortedProgress.map(p => p.measurements.chest),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Cintura (cm)',
        data: sortedProgress.map(p => p.measurements.waist),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Quadril (cm)',
        data: sortedProgress.map(p => p.measurements.hips),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Dados para o gráfico de frequência de treinos
  const workoutFrequencyData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Treinos esta semana',
        data: [0, 0, 0, 0, 0, 0, 0], // Será calculado abaixo
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  // Calcular frequência de treinos da semana atual
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  const endOfWeek = new Date(now.setDate(now.getDate() + 6));
  
  const thisWeekWorkouts = workouts.filter(w => 
    w.date >= startOfWeek && w.date <= endOfWeek
  );

  // Preencher dados de frequência
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    const dayWorkouts = thisWeekWorkouts.filter(w => 
      w.date.toDateString() === day.toDateString()
    );
    workoutFrequencyData.datasets[0].data[i] = dayWorkouts.length;
  }

  // Dados para o gráfico de distribuição de tipos de treino
  const workoutTypeData = {
    labels: ['Força', 'Cardio', 'Flexibilidade', 'Misto'],
    datasets: [
      {
        data: [
          workouts.filter(w => w.type === 'strength').length,
          workouts.filter(w => w.type === 'cardio').length,
          workouts.filter(w => w.type === 'flexibility').length,
          workouts.filter(w => w.type === 'mixed').length,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const getProgressStats = () => {
    if (sortedProgress.length < 2) return null;

    const first = sortedProgress[0];
    const latest = sortedProgress[sortedProgress.length - 1];
    
    const weightChange = latest.weight - first.weight;
    const weightChangePercent = ((weightChange / first.weight) * 100).toFixed(1);
    
    const waistChange = latest.measurements.waist - first.measurements.waist;
    const waistChangePercent = ((waistChange / first.measurements.waist) * 100).toFixed(1);

    return {
      weightChange,
      weightChangePercent,
      waistChange,
      waistChangePercent,
      totalDays: Math.ceil((latest.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24)),
    };
  };

  const progressStats = getProgressStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seu Progresso</h1>
            <p className="text-gray-600">Acompanhe sua evolução e mantenha a motivação</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Progresso
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        {progressStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {progressStats.weightChange > 0 ? '+' : ''}{progressStats.weightChange.toFixed(1)}kg
              </div>
              <div className="text-sm text-gray-600">Mudança de Peso</div>
              <div className="text-xs text-gray-500">
                {progressStats.weightChangePercent}% em {progressStats.totalDays} dias
              </div>
            </div>
            
            <div className="card text-center">
              <div className="text-2xl font-bold text-secondary-600 mb-1">
                {progressStats.waistChange > 0 ? '+' : ''}{progressStats.waistChange.toFixed(1)}cm
              </div>
              <div className="text-sm text-gray-600">Mudança na Cintura</div>
              <div className="text-xs text-gray-500">
                {progressStats.waistChangePercent}% em {progressStats.totalDays} dias
              </div>
            </div>
            
            <div className="card text-center">
              <div className="text-2xl font-bold text-accent-600 mb-1">
                {workouts.length}
              </div>
              <div className="text-sm text-gray-600">Total de Treinos</div>
              <div className="text-xs text-gray-500">
                {Math.round(workouts.length / Math.max(1, Math.ceil((Date.now() - (user?.createdAt.getTime() || Date.now())) / (1000 * 60 * 60 * 24))))} por semana
              </div>
            </div>
            
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {meals.length}
              </div>
              <div className="text-sm text-gray-600">Refeições Registradas</div>
              <div className="text-xs text-gray-500">
                {Math.round(meals.length / Math.max(1, Math.ceil((Date.now() - (user?.createdAt.getTime() || Date.now())) / (1000 * 60 * 60 * 24))))} por dia
              </div>
            </div>
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Peso */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold">Evolução do Peso</h3>
            </div>
            {sortedProgress.length > 0 ? (
              <Line data={weightChartData} options={lineChartOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Registre seu primeiro progresso para ver o gráfico
              </div>
            )}
          </div>

          {/* Gráfico de Medidas */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Ruler className="w-5 h-5 text-secondary-600" />
              <h3 className="text-lg font-semibold">Evolução das Medidas</h3>
            </div>
            {sortedProgress.length > 0 ? (
              <Line data={measurementsChartData} options={lineChartOptions} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Registre seu primeiro progresso para ver o gráfico
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Frequência de Treinos */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-accent-600" />
              <h3 className="text-lg font-semibold">Frequência de Treinos</h3>
            </div>
            <Bar data={workoutFrequencyData} options={chartOptions} />
          </div>

          {/* Distribuição de Tipos de Treino */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Tipos de Treino</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={workoutTypeData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Histórico de Progresso */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Histórico de Progresso</h3>
          {sortedProgress.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Peso</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tórax</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cintura</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Quadril</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Braços</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Coxas</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProgress.map((p, index) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {p.date.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {p.weight}kg
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.measurements.chest}cm
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.measurements.waist}cm
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.measurements.hips}cm
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.measurements.arms}cm
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.measurements.thighs}cm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum progresso registrado ainda</p>
              <p className="text-sm">Comece registrando suas medidas para acompanhar sua evolução</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Registro de Progresso */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Registrar Progresso</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={progressData.weight}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                  min="30"
                  max="300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tórax (cm)
                  </label>
                  <input
                    type="number"
                    name="chest"
                    value={progressData.chest}
                    onChange={handleInputChange}
                    className="input-field"
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
                    name="waist"
                    value={progressData.waist}
                    onChange={handleInputChange}
                    className="input-field"
                    step="0.1"
                    min="50"
                    max="200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quadril (cm)
                  </label>
                  <input
                    type="number"
                    name="hips"
                    value={progressData.hips}
                    onChange={handleInputChange}
                    className="input-field"
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
                    name="arms"
                    value={progressData.arms}
                    onChange={handleInputChange}
                    className="input-field"
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
                  name="thighs"
                  value={progressData.thighs}
                  onChange={handleInputChange}
                  className="input-field"
                  step="0.1"
                  min="30"
                  max="150"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Salvar
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
