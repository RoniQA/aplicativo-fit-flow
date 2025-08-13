import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Workout, Exercise } from '../contexts/UserContext';
import { Plus, X, Target } from 'lucide-react';

const WorkoutForm: React.FC = () => {
  const { addWorkout, user, addProgress } = useUser();
  const [workoutData, setWorkoutData] = useState({
    type: 'strength' as Workout['type'],
    duration: 45,
    notes: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 3, reps: 10, weight: 0, duration: 0, rest: 0, type: '', notes: '', intensity: '' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', sets: 3, reps: 10, weight: 0, duration: 0, rest: 0, type: '', notes: '', intensity: '' }]);
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercises.some(ex => !ex.name)) {
      alert('Por favor, preencha o nome de todos os exercícios');
      return;
    }
    const newWorkout: Workout = {
      id: Date.now().toString(),
      date: new Date(),
      type: workoutData.type,
      duration: workoutData.duration,
      exercises: exercises,
      notes: workoutData.notes,
    };
    addWorkout(newWorkout);
    // Atualiza progresso (apenas frequência, pode ser expandido)
    if (user) {
      addProgress({
        id: Date.now().toString(),
        date: new Date(),
        weight: user.weight,
        measurements: {
          chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0
        }
      });
    }
    setWorkoutData({ type: 'strength', duration: 45, notes: '' });
    setExercises([{ name: '', sets: 3, reps: 10, weight: 0, duration: 0, rest: 0, type: '', notes: '', intensity: '' }]);
    alert('Treino registrado com sucesso!');
  };

  const getPersonalizedSuggestion = () => {
    if (!user || !user.gender || !user.goal || !user.workoutLocation || !user.experienceLevel || !user.availableTime) return [];
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayIdx = new Date().getDay();
    const todayName = weekDays[todayIdx];
    if (user.workoutLocation === 'gym') {
      if (user.goal === 'lose') {
        // Emagrecimento: circuito cardio + funcional, 45-60min
        return [
          { name: 'Aquecimento na esteira', sets: 1, reps: 0, duration: 10, type: 'cardio' },
          { name: 'Circuito funcional (agachamento, polichinelo, abdominal)', sets: 4, reps: 20, duration: 15, type: 'mixed' },
          { name: 'Bicicleta ergométrica', sets: 1, reps: 0, duration: 20, type: 'cardio' },
          { name: 'Remada baixa', sets: 4, reps: 15, duration: 10, type: 'strength' },
          { name: 'Flexão de braço', sets: 4, reps: 15, duration: 10, type: 'strength' },
          { name: 'Prancha', sets: 3, reps: 0, duration: 40, type: 'core' },
          { name: 'Abdominal', sets: 4, reps: 20, duration: 0, type: 'core' },
          { name: 'Alongamento', sets: 1, reps: 0, duration: 8, type: 'flexibility' }
        ];
      }
      if (user.gender === 'male') {
        const maleRoutine = {
          gain: [
            { day: 'Segunda', exercises: ['Supino reto (4x10)', 'Supino inclinado (4x10)', 'Crossover (3x12)', 'Tríceps pulley (3x12)', 'Mergulho (3x12)'] },
            { day: 'Terça', exercises: ['Puxada frente (4x10)', 'Remada baixa (4x10)', 'Remada unilateral (3x12)', 'Rosca direta (3x12)', 'Rosca alternada (3x12)'] },
            { day: 'Quarta', exercises: ['Agachamento (4x10)', 'Leg press (4x10)', 'Cadeira extensora (3x12)', 'Cadeira flexora (3x12)', 'Panturrilha (4x15)'] },
            { day: 'Quinta', exercises: ['Desenvolvimento (4x10)', 'Elevação lateral (3x12)', 'Elevação frontal (3x12)', 'Abdominal (4x15)', 'Prancha (3x1min)'] },
            { day: 'Sexta', exercises: ['Supino reto (4x10)', 'Puxada frente (4x10)', 'Remada curvada (3x12)', 'Crossover (3x12)', 'Tríceps banco (3x12)'] },
            { day: 'Sábado', exercises: ['Agachamento (4x10)', 'Leg press (4x10)', 'Abdominal (4x15)', 'Prancha (3x1min)', 'Panturrilha (4x15)'] },
            { day: 'Domingo', exercises: ['Caminhada (40min)', 'Bicicleta (30min)', 'Alongamento (10min)'] }
          ],
          maintain: [
            { day: 'Segunda', exercises: ['Supino reto (3x12)', 'Agachamento (3x12)', 'Remada baixa (3x12)', 'Desenvolvimento (3x12)', 'Abdominal (3x15)'] },
            { day: 'Terça', exercises: ['Corrida (30min)', 'HIIT (20min)', 'Prancha (3x1min)', 'Abdominal (3x15)'] },
            { day: 'Quarta', exercises: ['Agachamento (3x12)', 'Leg press (3x12)', 'Desenvolvimento (3x12)', 'Elevação lateral (3x12)'] },
            { day: 'Quinta', exercises: ['Remada curvada (3x12)', 'Puxada frente (3x12)', 'Rosca direta (3x12)', 'Rosca alternada (3x12)'] },
            { day: 'Sexta', exercises: ['Supino reto (3x12)', 'Supino inclinado (3x12)', 'Tríceps pulley (3x12)', 'Mergulho (3x12)'] },
            { day: 'Sábado', exercises: ['Caminhada (40min)', 'Bicicleta (30min)', 'Alongamento (10min)'] },
            { day: 'Domingo', exercises: [] }
          ]
        };
        const routine = maleRoutine[user.goal] || maleRoutine['gain'];
        const todayRoutine = routine.find((r) => r.day === todayName) || routine[0];
        return todayRoutine.exercises.map(name => ({ name, sets: 3, reps: 10, duration: 0, type: 'strength' }));
      } else {
        const femaleRoutine = {
          gain: [
            { day: 'Segunda', exercises: ['Agachamento (4x10)', 'Cadeira extensora (4x10)', 'Leg press (4x10)', 'Afundo (3x12)', 'Avanço (3x12)'] },
            { day: 'Terça', exercises: ['Cadeira flexora (4x10)', 'Stiff (4x10)', 'Glúteo máquina (3x12)', 'Elevação pélvica (3x12)', 'Abdução (3x15)'] },
            { day: 'Quarta', exercises: ['Desenvolvimento (4x10)', 'Puxada frente (4x10)', 'Remada baixa (3x12)', 'Rosca direta (3x12)', 'Tríceps pulley (3x12)'] },
            { day: 'Quinta', exercises: ['Agachamento (4x10)', 'Leg press (4x10)', 'Abdominal (4x15)', 'Prancha (3x1min)', 'Cadeira extensora (3x12)'] },
            { day: 'Sexta', exercises: ['Stiff (4x10)', 'Glúteo máquina (3x12)', 'Abdução (3x15)', 'Abdominal (4x15)', 'Prancha (3x1min)'] },
            { day: 'Sábado', exercises: ['Desenvolvimento (4x10)', 'Puxada frente (4x10)', 'Remada curvada (3x12)', 'Rosca alternada (3x12)', 'Tríceps banco (3x12)'] },
            { day: 'Domingo', exercises: ['Caminhada (40min)', 'Bicicleta (30min)', 'Alongamento (10min)'] }
          ],
          maintain: [
            { day: 'Segunda', exercises: ['Agachamento (3x12)', 'Desenvolvimento (3x12)', 'Remada baixa (3x12)', 'Abdominal (3x15)', 'Prancha (3x1min)'] },
            { day: 'Terça', exercises: ['Corrida (30min)', 'HIIT (20min)', 'Prancha (3x1min)', 'Abdominal (3x15)'] },
            { day: 'Quarta', exercises: ['Stiff (3x12)', 'Glúteo máquina (3x12)', 'Abdução (3x15)', 'Cadeira flexora (3x12)'] },
            { day: 'Quinta', exercises: ['Agachamento (3x12)', 'Cadeira extensora (3x12)', 'Desenvolvimento (3x12)', 'Elevação lateral (3x12)'] },
            { day: 'Sexta', exercises: ['Desenvolvimento (3x12)', 'Puxada frente (3x12)', 'Remada curvada (3x12)', 'Rosca alternada (3x12)', 'Tríceps banco (3x12)'] },
            { day: 'Sábado', exercises: ['Caminhada (40min)', 'Bicicleta (30min)', 'Alongamento (10min)'] },
            { day: 'Domingo', exercises: [] }
          ]
        };
        const routine = femaleRoutine[user.goal] || femaleRoutine['gain'];
        const todayRoutine = routine.find((r) => r.day === todayName) || routine[0];
        return todayRoutine.exercises.map(name => ({ name, sets: 3, reps: 10, duration: 0, type: 'strength' }));
      }
    }
    return [];
  };

  const applySuggestion = (suggestion: any) => {
    setWorkoutData(prev => ({
      ...prev,
      type: suggestion.type || 'strength',
      duration: suggestion.duration || 45
    }));

    const newExercises = suggestion.map((s: any) => ({
      name: s.name,
      sets: s.sets,
      reps: s.reps || 0,
      weight: s.weight || 0,
      duration: s.duration || 0,
      rest: 0,
      type: s.type || '',
      notes: '',
      intensity: ''
    }));

    setExercises(newExercises);
  };

  const personalizedSuggestion = getPersonalizedSuggestion();

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 pb-20 overflow-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-0">Registrar Treino</h1>
            <p className="text-sm sm:text-base text-gray-600">Registre seu treino de hoje e acompanhe seu progresso</p>
          </div>
        </div>

        {/* Sugestões de Treino */}
        {personalizedSuggestion.length > 0 && (
          <div className="card mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold">Treino sugerido para hoje</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {personalizedSuggestion.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 text-left"
                >
                  <div className="font-medium text-primary-800 text-sm">{suggestion.name}</div>
                  <div className="text-xs text-primary-600">
                    {suggestion.sets}x{suggestion.reps}
                    {/* Exibe tempo apenas para exercícios de tempo (reps = 0) */}
                    {suggestion.reps === 0 && suggestion.duration > 0 ? ` • ${suggestion.duration}s` : ''}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-base whitespace-nowrap"
                onClick={() => applySuggestion(personalizedSuggestion)}
              >
                Aplicar treino sugerido
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Informações do Treino</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Treino
                </label>
                <select
                  name="type"
                  value={workoutData.type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="strength">Força</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibilidade</option>
                  <option value="mixed">Misto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={workoutData.duration}
                  onChange={handleInputChange}
                  className="input-field"
                  min="10"
                  max="180"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                name="notes"
                value={workoutData.notes}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="Como você se sentiu? Dificuldades? Conquistas?"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Exercícios</h3>
              <button
                type="button"
                onClick={addExercise}
                className="btn-secondary text-sm py-2 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Exercício {index + 1}</span>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Nome do Exercício - Largura Total */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nome do Exercício *</label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        className="input-field text-sm py-2"
                        placeholder="Nome do exercício"
                        required
                      />
                    </div>

                    {/* Primeira Linha - Séries e Repetições */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Séries *</label>
                        <input
                          type="number"
                          value={exercise.sets}
                          onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                          className="input-field text-sm py-2"
                          min="1"
                          max="10"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Repetições *</label>
                        <input
                          type="number"
                          value={exercise.reps}
                          onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                          className="input-field text-sm py-2"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                    </div>

                    {/* Segunda Linha - Peso e Tempo */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          value={exercise.weight || 0}
                          onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                          className="input-field text-sm py-2"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tempo (segundos)</label>
                        <input
                          type="number"
                          value={exercise.duration || 0}
                          onChange={(e) => updateExercise(index, 'duration', parseInt(e.target.value) || 0)}
                          className="input-field text-sm py-2"
                          min="0"
                          max="600"
                          step="1"
                          placeholder="Tempo em segundos"
                        />
                      </div>
                    </div>

                    {/* Terceira Linha - Tipo e Descanso */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Tipo de Exercício</label>
                        <select
                          value={exercise.type || ''}
                          onChange={(e) => updateExercise(index, 'type', e.target.value)}
                          className="input-field text-sm py-2"
                        >
                          <option value="">Selecione</option>
                          <option value="cardio">Cardio</option>
                          <option value="força">Força</option>
                          <option value="flexibilidade">Flexibilidade</option>
                          <option value="core">Core</option>
                          <option value="funcional">Funcional</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Descanso (segundos)</label>
                        <input
                          type="number"
                          value={exercise.rest || 0}
                          onChange={(e) => updateExercise(index, 'rest', parseInt(e.target.value) || 0)}
                          className="input-field text-sm py-2"
                          min="0"
                          max="600"
                          step="1"
                          placeholder="Descanso entre séries"
                        />
                      </div>
                    </div>

                    {/* Quarta Linha - Intensidade e Observações */}
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Intensidade</label>
                        <select
                          value={exercise.intensity || ''}
                          onChange={(e) => updateExercise(index, 'intensity', e.target.value)}
                          className="input-field text-sm py-2"
                        >
                          <option value="">Selecione</option>
                          <option value="leve">Leve</option>
                          <option value="moderado">Moderado</option>
                          <option value="intenso">Intenso</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Observações</label>
                        <input
                          type="text"
                          value={exercise.notes || ''}
                          onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                          className="input-field text-sm py-2"
                          placeholder="Observações ou dicas do exercício"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-medium text-lg btn-primary mt-6"
            >
              Completar Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
