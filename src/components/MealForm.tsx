import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Meal, Food } from '../contexts/UserContext';
import { Plus, X, Save, Utensils, Apple, Beef, Milk } from 'lucide-react';

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

  const getMealSuggestions = () => {
    if (!user) return [];

    // Sugestões baseadas no objetivo e preferências alimentares
    const baseSuggestions = {
      lose: {
        none: [
          { name: 'Peito de Frango', quantity: 150, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
          { name: 'Arroz Integral', quantity: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
          { name: 'Brócolis', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
          { name: 'Ovo Cozido', quantity: 50, unit: 'g', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 }
        ],
        vegetarian: [
          { name: 'Tofu', quantity: 150, unit: 'g', calories: 144, protein: 18, carbs: 3, fat: 8 },
          { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Lentilhas', quantity: 100, unit: 'g', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
          { name: 'Chia', quantity: 30, unit: 'g', calories: 138, protein: 4.7, carbs: 12, fat: 8.6 }
        ],
        vegan: [
          { name: 'Tempeh', quantity: 150, unit: 'g', calories: 225, protein: 24, carbs: 9, fat: 12 },
          { name: 'Amaranto', quantity: 100, unit: 'g', calories: 103, protein: 4, carbs: 19, fat: 1.6 },
          { name: 'Sementes de Abóbora', quantity: 50, unit: 'g', calories: 267, protein: 14, carbs: 4, fat: 23 },
          { name: 'Espirulina', quantity: 10, unit: 'g', calories: 26, protein: 5.7, carbs: 2.4, fat: 0.4 }
        ],
        glutenFree: [
          { name: 'Frango Orgânico', quantity: 150, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
          { name: 'Arroz Selvagem', quantity: 100, unit: 'g', calories: 101, protein: 4, carbs: 21, fat: 0.3 },
          { name: 'Batata Doce', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
          { name: 'Abacate', quantity: 100, unit: 'g', calories: 160, protein: 2, carbs: 9, fat: 15 }
        ],
        lactoseFree: [
          { name: 'Frango', quantity: 150, unit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
          { name: 'Arroz Integral', quantity: 100, unit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
          { name: 'Brócolis', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
          { name: 'Ovo Cozido', quantity: 50, unit: 'g', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 }
        ],
        keto: [
          { name: 'Salmão', quantity: 150, unit: 'g', calories: 309, protein: 46.5, carbs: 0, fat: 13.5 },
          { name: 'Abacate', quantity: 100, unit: 'g', calories: 160, protein: 2, carbs: 9, fat: 15 },
          { name: 'Ovos', quantity: 100, unit: 'g', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
          { name: 'Azeite de Oliva', quantity: 15, unit: 'ml', calories: 135, protein: 0, carbs: 0, fat: 15 }
        ],
        paleo: [
          { name: 'Carne Bovina', quantity: 150, unit: 'g', calories: 225, protein: 45, carbs: 0, fat: 4.5 },
          { name: 'Batata Doce', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
          { name: 'Espinafre', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: 'Nozes', quantity: 30, unit: 'g', calories: 180, protein: 4.5, carbs: 3, fat: 18 }
        ]
      },
      gain: {
        none: [
          { name: 'Salmão', quantity: 200, unit: 'g', calories: 412, protein: 44, carbs: 0, fat: 24 },
          { name: 'Batata Doce', quantity: 150, unit: 'g', calories: 135, protein: 3, carbs: 31, fat: 0.2 },
          { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 6.9 },
          { name: 'Banana', quantity: 120, unit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }
        ],
        vegetarian: [
          { name: 'Seitan', quantity: 150, unit: 'g', calories: 225, protein: 45, carbs: 6, fat: 1.5 },
          { name: 'Grão-de-bico', quantity: 150, unit: 'g', calories: 246, protein: 15, carbs: 41, fat: 4.3 },
          { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 6.9 },
          { name: 'Manteiga de Amendoim', quantity: 50, unit: 'g', calories: 294, protein: 12, carbs: 8, fat: 25 }
        ],
        vegan: [
          { name: 'Lentilhas Vermelhas', quantity: 150, unit: 'g', calories: 174, protein: 13.5, carbs: 30, fat: 0.6 },
          { name: 'Amaranto', quantity: 100, unit: 'g', calories: 103, protein: 4, carbs: 19, fat: 1.6 },
          { name: 'Sementes de Chia', quantity: 50, unit: 'g', calories: 230, protein: 8, carbs: 20, fat: 14 },
          { name: 'Leite de Coco', quantity: 100, unit: 'ml', calories: 230, protein: 2.3, carbs: 3.3, fat: 24 }
        ],
        glutenFree: [
          { name: 'Salmão', quantity: 200, unit: 'g', calories: 412, protein: 44, carbs: 0, fat: 24 },
          { name: 'Batata Doce', quantity: 150, unit: 'g', calories: 135, protein: 3, carbs: 31, fat: 0.2 },
          { name: 'Aveia Sem Glúten', quantity: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 6.9 },
          { name: 'Banana', quantity: 120, unit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }
        ],
        lactoseFree: [
          { name: 'Salmão', quantity: 200, unit: 'g', calories: 412, protein: 44, carbs: 0, fat: 24 },
          { name: 'Batata Doce', quantity: 150, unit: 'g', calories: 135, protein: 3, carbs: 31, fat: 0.2 },
          { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 6.9 },
          { name: 'Banana', quantity: 120, unit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }
        ],
        keto: [
          { name: 'Salmão', quantity: 200, unit: 'g', calories: 412, protein: 44, carbs: 0, fat: 24 },
          { name: 'Abacate', quantity: 150, unit: 'g', calories: 240, protein: 3, carbs: 13.5, fat: 22.5 },
          { name: 'Ovos', quantity: 150, unit: 'g', calories: 232.5, protein: 19.5, carbs: 1.65, fat: 16.5 },
          { name: 'Manteiga Ghee', quantity: 30, unit: 'g', calories: 270, protein: 0, carbs: 0, fat: 30 }
        ],
        paleo: [
          { name: 'Salmão', quantity: 200, unit: 'g', calories: 412, protein: 44, carbs: 0, fat: 24 },
          { name: 'Batata Doce', quantity: 150, unit: 'g', calories: 135, protein: 3, carbs: 31, fat: 0.2 },
          { name: 'Aveia', quantity: 100, unit: 'g', calories: 389, protein: 17, carbs: 66, fat: 6.9 },
          { name: 'Banana', quantity: 120, unit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }
        ]
      },
      maintain: {
        none: [
          { name: 'Atum', quantity: 150, unit: 'g', calories: 184, protein: 33, carbs: 0, fat: 4.5 },
          { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Espinafre', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: 'Iogurte Grego', quantity: 170, unit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0.5 }
        ],
        vegetarian: [
          { name: 'Ovos', quantity: 100, unit: 'g', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
          { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Feijão Preto', quantity: 100, unit: 'g', calories: 132, protein: 8.9, carbs: 23, fat: 0.5 },
          { name: 'Iogurte Natural', quantity: 170, unit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0.5 }
        ],
        vegan: [
          { name: 'Tofu', quantity: 150, unit: 'g', calories: 144, protein: 18, carbs: 3, fat: 8 },
          { name: 'Amaranto', quantity: 100, unit: 'g', calories: 103, protein: 4, carbs: 19, fat: 1.6 },
          { name: 'Lentilhas', quantity: 100, unit: 'g', calories: 116, protein: 9, carbs: 20, fat: 0.4 },
          { name: 'Leite de Amêndoas', quantity: 100, unit: 'ml', calories: 17, protein: 0.6, carbs: 0.6, fat: 1.5 }
        ],
        glutenFree: [
          { name: 'Atum', quantity: 150, unit: 'g', calories: 184, protein: 33, carbs: 0, fat: 4.5 },
          { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Espinafre', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: 'Iogurte de Coco', quantity: 170, unit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0.5 }
        ],
        lactoseFree: [
          { name: 'Atum', quantity: 150, unit: 'g', calories: 184, protein: 33, carbs: 0, fat: 4.5 },
          { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Espinafre', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: 'Iogurte de Coco', quantity: 170, unit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0.5 }
        ],
        keto: [
          { name: 'Atum', quantity: 150, unit: 'g', calories: 184, protein: 33, carbs: 0, fat: 4.5 },
          { name: 'Abacate', quantity: 100, unit: 'g', calories: 160, protein: 2, carbs: 9, fat: 15 },
          { name: 'Ovos', quantity: 100, unit: 'g', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
          { name: 'Azeite de Oliva', quantity: 15, unit: 'ml', calories: 135, protein: 0, carbs: 0, fat: 15 }
        ],
        paleo: [
          { name: 'Atum', quantity: 150, unit: 'g', calories: 184, protein: 33, carbs: 0, fat: 4.5 },
          { name: 'Quinoa', quantity: 100, unit: 'g', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
          { name: 'Espinafre', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
          { name: 'Iogurte de Coco', quantity: 170, unit: 'g', calories: 100, protein: 17, carbs: 6, fat: 0.5 }
        ]
      }
    };

    // Ajustar baseado no tipo de corpo desejado
    const bodyTypeAdjustments = {
      'athletic': { protein: 1.2, carbs: 1.1, fat: 0.9 },
      'lean': { protein: 1.3, carbs: 0.8, fat: 0.7 },
      'muscular': { protein: 1.4, carbs: 1.2, fat: 1.0 },
      'toned': { protein: 1.1, carbs: 1.0, fat: 0.9 },
      'flexible': { protein: 1.0, carbs: 1.1, fat: 0.8 }
    };

    const adjustment = bodyTypeAdjustments[user.bodyTypeGoal] || bodyTypeAdjustments.toned;
    const baseSuggestionsForGoal = baseSuggestions[user.goal] || baseSuggestions.maintain;
    const dietarySuggestions = baseSuggestionsForGoal[user.dietaryPreferences] || baseSuggestionsForGoal.none || baseSuggestionsForGoal.vegetarian || [];

    return dietarySuggestions.map((food: any) => ({
      ...food,
      protein: Math.round(food.protein * adjustment.protein * 10) / 10,
      carbs: Math.round(food.carbs * adjustment.carbs * 10) / 10,
      fat: Math.round(food.fat * adjustment.fat * 10) / 10,
      calories: Math.round(food.calories * (adjustment.protein * 0.4 + adjustment.carbs * 0.4 + adjustment.fat * 0.2))
    }));
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
      <div className="max-w-2xl mx-auto">
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
