import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Workout, Exercise } from '../contexts/UserContext';
import { Plus, X, Save, Target } from 'lucide-react';

const WorkoutForm: React.FC = () => {
  const { addWorkout, user, addProgress } = useUser();
  const [workoutData, setWorkoutData] = useState({
    type: 'strength' as Workout['type'],
    duration: 45,
    notes: '',
  });
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', sets: 3, reps: 10, weight: 0 }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', sets: 3, reps: 10, weight: 0 }]);
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
    setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
    alert('Treino registrado com sucesso!');
  };

  const getPersonalizedSuggestion = () => {
    if (!user || !user.gender || !user.goal || !user.workoutLocation || !user.experienceLevel || !user.availableTime) return [];
    const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayIdx = new Date().getDay();
    const todayName = weekDays[todayIdx];
    const hasLimitation = user.physicalLimitations && user.physicalLimitations.length > 0;
    if (user.workoutLocation === 'gym') {
      if (user.goal === 'lose') {
        return [
          { name: 'Esteira', sets: 1, reps: 0, duration: 25, type: 'cardio' },
          { name: 'Bicicleta', sets: 1, reps: 0, duration: 20, type: 'cardio' },
          { name: 'Elíptico', sets: 1, reps: 0, duration: 15, type: 'cardio' },
          { name: 'Abdominal', sets: 3, reps: 15, type: 'strength' }
        ];
      }
      if (user.gender === 'male') {
        const maleRoutine = {
          gain: [
            { day: 'Segunda', exercises: ['Supino reto', 'Supino inclinado', 'Crossover', 'Tríceps pulley', 'Mergulho'] },
            { day: 'Terça', exercises: ['Puxada frente', 'Remada baixa', 'Remada unilateral', 'Rosca direta', 'Rosca alternada'] },
            { day: 'Quarta', exercises: ['Agachamento', 'Leg press', 'Cadeira extensora', 'Cadeira flexora', 'Panturrilha'] },
            { day: 'Quinta', exercises: ['Desenvolvimento', 'Elevação lateral', 'Elevação frontal', 'Abdominal', 'Prancha'] },
            { day: 'Sexta', exercises: ['Supino reto', 'Puxada frente', 'Remada curvada', 'Crossover', 'Tríceps banco'] },
            { day: 'Sábado', exercises: ['Agachamento', 'Leg press', 'Abdominal', 'Prancha', 'Panturrilha'] },
            { day: 'Domingo', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] }
          ],
          maintain: [
            { day: 'Segunda', exercises: ['Supino reto', 'Agachamento', 'Remada baixa', 'Desenvolvimento', 'Abdominal'] },
            { day: 'Terça', exercises: ['Corrida', 'HIIT', 'Prancha', 'Abdominal'] },
            { day: 'Quarta', exercises: ['Agachamento', 'Leg press', 'Desenvolvimento', 'Elevação lateral'] },
            { day: 'Quinta', exercises: ['Remada curvada', 'Puxada frente', 'Rosca direta', 'Rosca alternada'] },
            { day: 'Sexta', exercises: ['Supino reto', 'Supino inclinado', 'Tríceps pulley', 'Mergulho'] },
            { day: 'Sábado', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] },
            { day: 'Domingo', exercises: [] }
          ]
        };
        const routine = maleRoutine[user.goal] || maleRoutine['gain'];
        const todayRoutine = routine.find((r) => r.day === todayName) || routine[0];
        return todayRoutine.exercises.map(name => ({ name, sets: 3, reps: 10, type: 'strength' }));
      } else {
        const femaleRoutine = {
          gain: [
            { day: 'Segunda', exercises: ['Agachamento', 'Cadeira extensora', 'Leg press', 'Afundo', 'Avanço'] },
            { day: 'Terça', exercises: ['Cadeira flexora', 'Stiff', 'Glúteo máquina', 'Elevação pélvica', 'Abdução'] },
            { day: 'Quarta', exercises: ['Desenvolvimento', 'Puxada frente', 'Remada baixa', 'Rosca direta', 'Tríceps pulley'] },
            { day: 'Quinta', exercises: ['Agachamento', 'Leg press', 'Abdominal', 'Prancha', 'Cadeira extensora'] },
            { day: 'Sexta', exercises: ['Stiff', 'Glúteo máquina', 'Abdução', 'Abdominal', 'Prancha'] },
            { day: 'Sábado', exercises: ['Desenvolvimento', 'Puxada frente', 'Remada curvada', 'Rosca alternada', 'Tríceps banco'] },
            { day: 'Domingo', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] }
          ],
          maintain: [
            { day: 'Segunda', exercises: ['Agachamento', 'Desenvolvimento', 'Remada baixa', 'Abdominal', 'Prancha'] },
            { day: 'Terça', exercises: ['Corrida', 'HIIT', 'Prancha', 'Abdominal'] },
            { day: 'Quarta', exercises: ['Stiff', 'Glúteo máquina', 'Abdução', 'Cadeira flexora'] },
            { day: 'Quinta', exercises: ['Agachamento', 'Cadeira extensora', 'Desenvolvimento', 'Elevação lateral'] },
            { day: 'Sexta', exercises: ['Desenvolvimento', 'Puxada frente', 'Remada curvada', 'Rosca alternada', 'Tríceps banco'] },
            { day: 'Sábado', exercises: ['Caminhada', 'Bicicleta', 'Alongamento'] },
            { day: 'Domingo', exercises: [] }
          ]
        };
        const routine = femaleRoutine[user.goal] || femaleRoutine['gain'];
        const todayRoutine = routine.find((r) => r.day === todayName) || routine[0];
        return todayRoutine.exercises.map(name => ({ name, sets: 3, reps: 10, type: 'strength' }));
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
      duration: s.duration || 0
    }));

    setExercises(newExercises);
  };

  const personalizedSuggestion = getPersonalizedSuggestion();

  return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 overflow-auto max-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 sm:mb-0">Registrar Treino</h1>
            <p className="text-gray-600">Registre seu treino de hoje e acompanhe seu progresso</p>
          </div>
          {personalizedSuggestion.length > 0 && (
            <button
              type="button"
              className="btn-primary px-6 py-3 rounded-xl font-semibold whitespace-nowrap"
              onClick={() => applySuggestion(personalizedSuggestion)}
            >
              Aplicar treino sugerido
            </button>
          )}
        </div>

        {/* Sugestões de Treino */}
        {personalizedSuggestion.length > 0 && (
          <div className="card mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold">Treino sugerido para hoje</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personalizedSuggestion.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 text-left"
                >
                  <div className="font-medium text-primary-800">{suggestion.name}</div>
                  <div className="text-xs text-primary-600">{suggestion.sets}x{suggestion.reps} {suggestion.duration ? `• ${suggestion.duration}s` : ''}</div>
                </div>
              ))}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nome</label>
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        className="input-field text-sm py-2"
                        placeholder="Nome do exercício"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Séries</label>
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
                      <label className="block text-xs text-gray-600 mb-1">Repetições</label>
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
