import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Meal, Food } from '../contexts/UserContext';
import { Plus, X, Utensils, Apple, Beef, Milk } from 'lucide-react';

const MealForm: React.FC = () => {
  const { addMeal, user, addProgress } = useUser();
  const [mealData, setMealData] = useState({
    type: 'breakfast' as Meal['type'],
    notes: '',
  });
  const [foods, setFoods] = useState<Food[]>([
    { name: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMealData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFood = () => {
    setFoods(prev => [...prev, { name: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }]);
  };

  const removeFood = (index: number) => {
    setFoods(prev => prev.filter((_, i) => i !== index));
  };

  const updateFood = (index: number, field: keyof Food, value: string | number) => {
    setFoods(prev => prev.map((food, i) => 
      i === index ? { ...food, [field]: value } : food
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foods.some(f => !f.name)) {
      alert('Por favor, preencha o nome de todos os alimentos');
      return;
    }
    const newMeal: Meal = {
      id: Date.now().toString(),
      date: new Date(),
      type: mealData.type,
      foods: foods,
      notes: mealData.notes,
    };
    addMeal(newMeal);
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
    setMealData({ type: 'breakfast', notes: '' });
    setFoods([{ name: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }]);
    alert('Refeição registrada com sucesso!');
  };

  const applySuggestion = (suggestion: any) => {
    setFoods(suggestion);
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Apple className="w-5 h-5" />;
      case 'lunch': return <Beef className="w-5 h-5" />;
      case 'dinner': return <Utensils className="w-5 h-5" />;
      case 'snack': return <Milk className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  const getMealColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'lunch': return 'bg-red-100 text-red-800 border-red-200';
      case 'dinner': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'snack': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Sugestões separadas por tipo de refeição
  const mealTypeLabels: Record<string, string> = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    snack: 'Lanche',
    dinner: 'Jantar',
  };

  // Sugestões específicas para cada tipo de refeição
  const getMealSuggestionsByType = (type: string) => {
    if (!user) return [];
    // Sugestões baseadas no tipo de refeição
    const base = {
      breakfast: [
        { name: 'Ovos mexidos', quantity: 2, unit: 'un', calories: 140, protein: 12, carbs: 1, fat: 10 },
        { name: 'Pão integral', quantity: 50, unit: 'g', calories: 120, protein: 4, carbs: 22, fat: 1 },
        { name: 'Fruta', quantity: 80, unit: 'g', calories: 50, protein: 0.5, carbs: 12, fat: 0.2 },
        { name: 'Iogurte natural', quantity: 100, unit: 'g', calories: 60, protein: 4, carbs: 6, fat: 2 }
      ],
      lunch: [
        { name: 'Arroz integral', quantity: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
        { name: 'Feijão', quantity: 100, unit: 'g', calories: 76, protein: 4.7, carbs: 14, fat: 0.5 },
        { name: 'Frango grelhado', quantity: 120, unit: 'g', calories: 132, protein: 26, carbs: 0, fat: 2.7 },
        { name: 'Salada', quantity: 80, unit: 'g', calories: 20, protein: 1, carbs: 4, fat: 0.2 }
      ],
      snack: [
        { name: 'Banana', quantity: 80, unit: 'g', calories: 70, protein: 0.8, carbs: 18, fat: 0.2 },
        { name: 'Barra de cereal', quantity: 30, unit: 'g', calories: 110, protein: 2, carbs: 20, fat: 2 },
        { name: 'Iogurte', quantity: 100, unit: 'g', calories: 60, protein: 4, carbs: 6, fat: 2 }
      ],
      dinner: [
        { name: 'Peixe grelhado', quantity: 120, unit: 'g', calories: 110, protein: 22, carbs: 0, fat: 2 },
        { name: 'Legumes cozidos', quantity: 100, unit: 'g', calories: 40, protein: 2, carbs: 8, fat: 0.3 },
        { name: 'Batata doce', quantity: 80, unit: 'g', calories: 68, protein: 1, carbs: 16, fat: 0.1 }
      ]
    };
    // Pode personalizar por objetivo, dieta, etc. (exemplo simplificado)
  return base[type as keyof typeof base] || [];
  };

  const mealSuggestions = getMealSuggestionsByType(mealData.type);

  return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 overflow-auto max-h-screen">
      <div className="max-w-2xl mx-auto container-mobile">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Refeição</h1>
          <p className="text-gray-600">Registre o que você comeu e acompanhe sua nutrição</p>
        </div>

        {/* Sugestões de Alimentos por tipo de refeição */}
        {mealSuggestions.length > 0 && (
          <div className="card mb-6">
            <div className="flex items-center space-x-3 mb-4">
              {getMealIcon(mealData.type)}
              <h3 className="text-lg font-semibold">Dicas para {mealTypeLabels[mealData.type]}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mealSuggestions.map((suggestion: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-accent-50 border border-accent-200 rounded-lg"
                >
                  <div className="font-medium text-accent-800">{suggestion.name}</div>
                  <div className="text-sm text-accent-600">
                    {suggestion.quantity}{suggestion.unit} • {suggestion.calories} kcal
                  </div>
                  <div className="text-xs text-accent-500">
                    P: {suggestion.protein}g • C: {suggestion.carbs}g • G: {suggestion.fat}g
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => applySuggestion(mealSuggestions)}
              className="w-full mt-4 btn-accent"
            >
              Aplicar Sugestões para {mealTypeLabels[mealData.type]}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Informações da Refeição</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Refeição
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealData(prev => ({ ...prev, type }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                      mealData.type === type
                        ? getMealColor(type)
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {getMealIcon(type)}
                    <span className="capitalize">
                      {type === 'breakfast' ? 'Café da Manhã' :
                       type === 'lunch' ? 'Almoço' :
                       type === 'dinner' ? 'Jantar' : 'Lanche'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                name="notes"
                value={mealData.notes}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="Como você se sentiu? Alergias? Preferências?"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Alimentos</h3>
              <button
                type="button"
                onClick={addFood}
                className="btn-secondary text-sm py-2 px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </button>
            </div>

            <div className="space-y-4">
              {foods.map((food, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Alimento {index + 1}</span>
                    {foods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFood(index)}
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
                        value={food.name}
                        onChange={(e) => updateFood(index, 'name', e.target.value)}
                        className="input-field text-sm py-2"
                        placeholder="Nome do alimento"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        value={food.quantity}
                        onChange={(e) => updateFood(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="input-field text-sm py-2"
                        min="1"
                        max="1000"
                        step="0.1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Unidade</label>
                      <select
                        value={food.unit}
                        onChange={(e) => updateFood(index, 'unit', e.target.value)}
                        className="input-field text-sm py-2"
                        required
                      >
                        <option value="g">gramas (g)</option>
                        <option value="ml">mililitros (ml)</option>
                        <option value="un">unidade</option>
                        <option value="col">colher</option>
                        <option value="xíc">xícara</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Calorias</label>
                      <input
                        type="number"
                        value={food.calories}
                        onChange={(e) => updateFood(index, 'calories', parseFloat(e.target.value) || 0)}
                        className="input-field text-sm py-2"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Proteínas (g)</label>
                      <input
                        type="number"
                        value={food.protein}
                        onChange={(e) => updateFood(index, 'protein', parseFloat(e.target.value) || 0)}
                        className="input-field text-sm py-2"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Carboidratos (g)</label>
                      <input
                        type="number"
                        value={food.carbs}
                        onChange={(e) => updateFood(index, 'carbs', parseFloat(e.target.value) || 0)}
                        className="input-field text-sm py-2"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Gorduras (g)</label>
                      <input
                        type="number"
                        value={food.fat}
                        onChange={(e) => updateFood(index, 'fat', parseFloat(e.target.value) || 0)}
                        className="input-field text-sm py-2"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo Nutricional */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Resumo Nutricional</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {foods.reduce((sum, food) => sum + food.calories, 0).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-600">Calorias</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {foods.reduce((sum, food) => sum + food.protein, 0).toFixed(1)}g
                  </div>
                  <div className="text-xs text-gray-600">Proteínas</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {foods.reduce((sum, food) => sum + food.carbs, 0).toFixed(1)}g
                  </div>
                  <div className="text-xs text-gray-600">Carboidratos</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {foods.reduce((sum, food) => sum + food.fat, 0).toFixed(1)}g
                  </div>
                  <div className="text-xs text-gray-600">Gorduras</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-medium text-lg btn-primary mt-6"
            >
              Completar Refeição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealForm;
