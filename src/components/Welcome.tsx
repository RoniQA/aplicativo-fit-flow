import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { User } from '../contexts/UserContext';
import { Dumbbell, Target, TrendingUp, Heart, Info, CheckCircle } from 'lucide-react';

const Welcome: React.FC = () => {
  const { setUser } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '' as User['gender'],
    goal: '' as User['goal'],
    activityLevel: '' as User['activityLevel'],
    workoutLocation: 'home' as User['workoutLocation'],
    bodyTypeGoal: 'toned' as User['bodyTypeGoal'],
    experienceLevel: 'beginner' as User['experienceLevel'],
    physicalLimitations: [] as string[],
    dietaryPreferences: 'none' as User['dietaryPreferences'],
    availableTime: '45min' as User['availableTime'],
  });

  // Campos obrigatórios para primeira sessão
  const requiredFields = ['name', 'goal', 'activityLevel'];
  
  // Campos opcionais que podem ser preenchidos depois
  const optionalFields = ['age', 'weight', 'height', 'gender', 'workoutLocation', 'bodyTypeGoal', 'experienceLevel', 'dietaryPreferences', 'availableTime'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valores padrão para campos não preenchidos
    const defaultValues = {
      age: formData.age || '25',
      weight: formData.weight || '70',
      height: formData.height || '170',
      gender: formData.gender || 'male',
      workoutLocation: formData.workoutLocation,
      bodyTypeGoal: formData.bodyTypeGoal,
      experienceLevel: formData.experienceLevel,
      physicalLimitations: formData.physicalLimitations,
      dietaryPreferences: formData.dietaryPreferences,
      availableTime: formData.availableTime,
    };

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(defaultValues.age),
      weight: parseFloat(defaultValues.weight),
      height: parseFloat(defaultValues.height),
      gender: defaultValues.gender as User['gender'],
      goal: formData.goal as User['goal'],
      activityLevel: formData.activityLevel as User['activityLevel'],
      workoutLocation: defaultValues.workoutLocation,
      bodyTypeGoal: defaultValues.bodyTypeGoal,
      experienceLevel: defaultValues.experienceLevel,
      physicalLimitations: defaultValues.physicalLimitations,
      dietaryPreferences: defaultValues.dietaryPreferences,
      availableTime: defaultValues.availableTime,
      createdAt: new Date(),
    };

    setUser(newUser);
  };

  const isFormValid = () => {
    return requiredFields.every(field => formData[field as keyof typeof formData]);
  };

  const getFieldStatus = (fieldName: string) => {
    if (requiredFields.includes(fieldName)) {
      return formData[fieldName as keyof typeof formData] ? 'filled' : 'required';
    }
    return formData[fieldName as keyof typeof formData] ? 'filled' : 'optional';
  };

  const getFieldIcon = (fieldName: string) => {
    const status = getFieldStatus(fieldName);
    switch (status) {
      case 'filled':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'required':
        return <Info className="w-4 h-4 text-red-500" />;
      case 'optional':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getFieldLabel = (fieldName: string) => {
    const status = getFieldStatus(fieldName);
    if (status === 'required') {
      return 'Obrigatório';
    } else if (status === 'optional') {
      return 'Opcional';
    }
    return '';
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md mx-auto animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6">
              <Dumbbell className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4">FitFlow</h1>
            <p className="text-xl text-white/90 mb-8">
              Seu Personal Trainer Digital
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-3 text-left">
              <Target className="w-6 h-6 text-accent-300" />
              <span>Defina seus objetivos de fitness</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <TrendingUp className="w-6 h-6 text-accent-300" />
              <span>Acompanhe seu progresso</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <Heart className="w-6 h-6 text-accent-300" />
              <span>Receba dicas personalizadas</span>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="btn-primary text-lg px-8 py-4 w-full"
          >
            Começar Agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto container-mobile">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Vamos começar!</h2>
          <p className="text-gray-600">Conte-nos sobre você para personalizarmos sua experiência</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Preencha apenas os campos obrigatórios para começar. Você pode completar seu perfil depois!
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos obrigatórios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Nome
              {getFieldIcon('name')}
              <span className="text-xs text-gray-500">({getFieldLabel('name')})</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Objetivo Principal
              {getFieldIcon('goal')}
              <span className="text-xs text-gray-500">({getFieldLabel('goal')})</span>
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Selecione seu objetivo</option>
              <option value="lose">Emagrecer</option>
              <option value="gain">Ganhar Massa Muscular</option>
              <option value="maintain">Manter Forma</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Nível de Atividade
              {getFieldIcon('activityLevel')}
              <span className="text-xs text-gray-500">({getFieldLabel('activityLevel')})</span>
            </label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Selecione seu nível</option>
              <option value="low">Baixo (sedentário)</option>
              <option value="medium">Médio (atividade moderada)</option>
              <option value="high">Alto (muito ativo)</option>
            </select>
          </div>

          {/* Separador visual */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Campos opcionais (preencha depois se quiser)</span>
            </div>
          </div>

          {/* Campos opcionais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Idade
                {getFieldIcon('age')}
                <span className="text-xs text-gray-500">({getFieldLabel('age')})</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="input-field"
                placeholder="25"
                min="13"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Peso (kg)
                {getFieldIcon('weight')}
                <span className="text-xs text-gray-500">({getFieldLabel('weight')})</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="input-field"
                placeholder="70"
                min="30"
                max="300"
                step="0.1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Altura (cm)
              {getFieldIcon('height')}
              <span className="text-xs text-gray-500">({getFieldLabel('height')})</span>
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="input-field"
              placeholder="170"
              min="100"
              max="250"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Gênero
              {getFieldIcon('gender')}
              <span className="text-xs text-gray-500">({getFieldLabel('gender')})</span>
            </label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Selecione</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Onde você prefere treinar?
              {getFieldIcon('workoutLocation')}
              <span className="text-xs text-gray-500">({getFieldLabel('workoutLocation')})</span>
            </label>
            <select
              name="workoutLocation"
              value={formData.workoutLocation}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="home">🏠 Em Casa</option>
              <option value="gym">🏋️ Academia</option>
              <option value="crossfit">🔥 CrossFit</option>
              <option value="outdoor">🌳 Ao Ar Livre</option>
              <option value="mixed">🔄 Misto (casa + academia)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Que tipo de corpo você deseja ter?
              {getFieldIcon('bodyTypeGoal')}
              <span className="text-xs text-gray-500">({getFieldLabel('bodyTypeGoal')})</span>
            </label>
            <select
              name="bodyTypeGoal"
              value={formData.bodyTypeGoal}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="athletic">🏃 Atlético (resistência + força)</option>
              <option value="lean">💪 Magro e definido</option>
              <option value="muscular">🔥 Musculoso e forte</option>
              <option value="toned">✨ Tonificado e equilibrado</option>
              <option value="flexible">🧘 Flexível e ágil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Qual seu nível de experiência?
              {getFieldIcon('experienceLevel')}
              <span className="text-xs text-gray-500">({getFieldLabel('experienceLevel')})</span>
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="beginner">🌱 Iniciante (0-6 meses)</option>
              <option value="intermediate">📈 Intermediário (6 meses - 2 anos)</option>
              <option value="advanced">🚀 Avançado (2+ anos)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Tempo disponível para treino
              {getFieldIcon('availableTime')}
              <span className="text-xs text-gray-500">({getFieldLabel('availableTime')})</span>
            </label>
            <select
              name="availableTime"
              value={formData.availableTime}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="15min">⏰ 15 minutos</option>
              <option value="30min">⏰ 30 minutos</option>
              <option value="45min">⏰ 45 minutos</option>
              <option value="60min">⏰ 1 hora</option>
              <option value="90min">⏰ 1h30</option>
              <option value="flexible">🔄 Flexível</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Preferências alimentares
              {getFieldIcon('dietaryPreferences')}
              <span className="text-xs text-gray-500">({getFieldLabel('dietaryPreferences')})</span>
            </label>
            <select
              name="dietaryPreferences"
              value={formData.dietaryPreferences}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="none">🍽️ Sem restrições</option>
              <option value="vegetarian">🥬 Vegetariano</option>
              <option value="vegan">🌱 Vegano</option>
              <option value="glutenFree">🌾 Sem glúten</option>
              <option value="lactoseFree">🥛 Sem lactose</option>
              <option value="keto">🥑 Dieta cetogênica</option>
              <option value="paleo">🦴 Dieta paleo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limitações físicas (opcional)
            </label>
            <textarea
              name="physicalLimitations"
              value={formData.physicalLimitations.join(', ')}
              onChange={(e) => {
                const limitations = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                setFormData(prev => ({ ...prev, physicalLimitations: limitations }));
              }}
              className="input-field"
              rows={2}
              placeholder="Ex: lesão no joelho, problema de coluna, etc. (deixe em branco se não tiver)"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-200 ${
              isFormValid()
                ? 'btn-primary'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Criar Minha Conta
          </button>
        </form>

        <button
          onClick={() => setStep(1)}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
};

export default Welcome;
