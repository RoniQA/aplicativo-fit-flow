import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  Lightbulb, 
  Target, 
  Heart, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Clock, 
  Users,
  BookOpen,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'workout' | 'nutrition' | 'lifestyle' | 'motivation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  icon: React.ReactNode;
  color: string;
}

const Tips: React.FC = () => {
  const { user, workouts, meals, progress } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());

  const toggleTip = (tipId: string) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(tipId)) {
      newExpanded.delete(tipId);
    } else {
      newExpanded.add(tipId);
    }
    setExpandedTips(newExpanded);
  };

  const getPersonalizedTips = (): Tip[] => {
    const baseTips: Tip[] = [
      // Dicas de Treino Personalizadas
      {
        id: '1',
        title: user?.workoutLocation === 'home' ? 'Treino em Casa: Estrutura é Tudo' :
               user?.workoutLocation === 'gym' ? 'Academia: Aproveite os Equipamentos' :
               user?.workoutLocation === 'crossfit' ? 'CrossFit: Técnica Antes da Intensidade' :
               user?.workoutLocation === 'outdoor' ? 'Treino ao Ar Livre: Adapte-se ao Ambiente' :
               'Aquecimento é Fundamental',
        content: user?.workoutLocation === 'home' ? 
          'Crie um espaço dedicado para treinos em casa. Use móveis como apoio para exercícios e invista em equipamentos básicos como elásticos e halteres. Mantenha uma rotina consistente mesmo sem sair de casa.' :
          user?.workoutLocation === 'gym' ? 
          'Aproveite a variedade de equipamentos da academia. Comece com máquinas guiadas se for iniciante e evolua para pesos livres. Peça orientação aos instrutores para usar os equipamentos corretamente.' :
          user?.workoutLocation === 'crossfit' ? 
          'No CrossFit, a técnica correta é mais importante que a velocidade. Aprenda os movimentos básicos antes de aumentar a intensidade. Participe das aulas para receber feedback constante.' :
          user?.workoutLocation === 'outdoor' ? 
          'Adapte seus treinos ao clima e ambiente. Use parques para calistenia, escadas para cardio e trilhas para resistência. Tenha sempre um plano B para dias de chuva.' :
          'Sempre dedique 10-15 minutos para aquecer antes do treino. Isso aumenta o fluxo sanguíneo, melhora a performance e reduz o risco de lesões. Inclua movimentos dinâmicos como polichinelos, agachamentos sem peso e rotações de braços.',
        category: 'workout',
        difficulty: 'beginner',
        tags: ['aquecimento', 'lesões', 'performance'],
        icon: <Dumbbell className="w-5 h-5" />,
        color: 'bg-primary-100 text-primary-800 border-primary-200'
      },
      {
        id: '2',
        title: user?.bodyTypeGoal === 'athletic' ? 'Corpo Atlético: Equilibre Força e Resistência' :
               user?.bodyTypeGoal === 'lean' ? 'Corpo Magro: Foque na Definição Muscular' :
               user?.bodyTypeGoal === 'muscular' ? 'Corpo Musculoso: Priorize a Hipertrofia' :
               user?.bodyTypeGoal === 'toned' ? 'Corpo Tonificado: Equilíbrio é a Chave' :
               user?.bodyTypeGoal === 'flexible' ? 'Corpo Flexível: Mobilidade e Alongamento' :
               'Progressão Gradual',
        content: user?.bodyTypeGoal === 'athletic' ? 
          'Para um corpo atlético, equilibre treinos de força com cardio. Inclua exercícios funcionais, pliometria e treinos de intervalo. Desenvolva tanto força quanto resistência cardiovascular.' :
          user?.bodyTypeGoal === 'lean' ? 
          'Para um corpo magro e definido, foque em treinos de alta intensidade e dieta controlada. Use pesos moderados com muitas repetições e inclua cardio regular para queimar gordura.' :
          user?.bodyTypeGoal === 'muscular' ? 
          'Para ganhar massa muscular, priorize exercícios compostos com cargas pesadas. Descanse adequadamente entre treinos e mantenha uma dieta rica em proteínas e calorias.' :
          user?.bodyTypeGoal === 'toned' ? 
          'Para um corpo tonificado, equilibre força, cardio e flexibilidade. Use pesos moderados, inclua exercícios de estabilização e mantenha uma rotina consistente.' :
          user?.bodyTypeGoal === 'flexible' ? 
          'Para um corpo flexível, inclua alongamentos dinâmicos e estáticos em cada treino. Pratique yoga ou pilates regularmente e foque na amplitude de movimento.' :
          'Aumente a intensidade dos exercícios gradualmente. Se você consegue fazer 3 séries de 10 repetições com facilidade, aumente o peso ou as repetições. A progressão constante é a chave para resultados duradouros.',
        category: 'workout',
        difficulty: 'intermediate',
        tags: ['progressão', 'intensidade', 'resultados'],
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'bg-primary-100 text-primary-800 border-primary-200'
      },
      {
        id: '3',
        title: 'Descanso Entre Séries',
        content: 'Para treinos de força, descanse 2-3 minutos entre séries. Para hipertrofia, 1-2 minutos. Para resistência, 30-60 segundos. O descanso adequado permite recuperação muscular e melhor performance.',
        category: 'workout',
        difficulty: 'intermediate',
        tags: ['descanso', 'recuperação', 'séries'],
        icon: <Clock className="w-5 h-5" />,
        color: 'bg-primary-100 text-primary-800 border-primary-200'
      },

      // Dicas de Nutrição
      {
        id: '4',
        title: user?.dietaryPreferences === 'vegetarian' ? 'Proteínas Vegetais: Fontes Alternativas' :
               user?.dietaryPreferences === 'vegan' ? 'Nutrição Vegana: Planejamento é Essencial' :
               user?.dietaryPreferences === 'glutenFree' ? 'Dieta Sem Glúten: Leia os Rótulos' :
               user?.dietaryPreferences === 'lactoseFree' ? 'Sem Lactose: Alternativas Nutritivas' :
               user?.dietaryPreferences === 'keto' ? 'Dieta Cetogênica: Monitoramento Constante' :
               user?.dietaryPreferences === 'paleo' ? 'Dieta Paleo: Alimentos Naturais' :
               'Hidratação Inteligente',
        content: user?.dietaryPreferences === 'vegetarian' ? 
          'Como vegetariano, foque em proteínas vegetais de alta qualidade: quinoa, lentilhas, grão-de-bico, tofu e tempeh. Combine diferentes fontes para obter aminoácidos completos.' :
          user?.dietaryPreferences === 'vegan' ? 
          'Na dieta vegana, suplemente vitamina B12 e ômega-3. Inclua sementes de chia, nozes e algas marinhas. Planeje suas refeições para garantir todos os nutrientes essenciais.' :
          user?.dietaryPreferences === 'glutenFree' ? 
          'Sempre leia os rótulos dos alimentos. Muitos produtos "naturais" podem conter glúten. Foque em alimentos naturalmente sem glúten: arroz, quinoa, batata doce e frutas.' :
          user?.dietaryPreferences === 'lactoseFree' ? 
          'Substitua o leite por alternativas como leite de amêndoas, coco ou aveia. Use iogurte de coco e queijos veganos. Considere suplementar cálcio se necessário.' :
          user?.dietaryPreferences === 'keto' ? 
          'Na dieta cetogênica, monitore seus níveis de cetona e mantenha-se hidratado. Inclua gorduras saudáveis como abacate, nozes e azeite. Evite carboidratos ocultos.' :
          user?.dietaryPreferences === 'paleo' ? 
          'Foque em alimentos naturais e não processados: carnes magras, peixes, ovos, vegetais, frutas e gorduras saudáveis. Evite grãos, laticínios e alimentos processados.' :
          'Beba água antes, durante e após o treino. Para sessões de até 1 hora, água é suficiente. Para treinos mais longos ou intensos, considere bebidas esportivas com eletrólitos. A desidratação pode reduzir performance em até 30%.',
        category: 'nutrition',
        difficulty: 'beginner',
        tags: ['hidratação', 'água', 'eletrólitos'],
        icon: <Apple className="w-5 h-5" />,
        color: 'bg-accent-100 text-accent-800 border-accent-200'
      },
      {
        id: '5',
        title: 'Timing das Refeições',
        content: 'Consuma proteínas e carboidratos 2-3 horas antes do treino. Após o treino, coma dentro de 30 minutos para otimizar a recuperação muscular. Uma refeição pós-treino deve ter 20-30g de proteína e carboidratos na proporção 3:1.',
        category: 'nutrition',
        difficulty: 'intermediate',
        tags: ['timing', 'proteína', 'recuperação'],
        icon: <Apple className="w-5 h-5" />,
        color: 'bg-accent-100 text-accent-800 border-accent-200'
      },
      {
        id: '6',
        title: 'Suplementação Inteligente',
        content: 'Suplementos não substituem uma boa alimentação. Whey protein pode ser útil para atingir metas de proteína. Creatina monohidratada tem evidências científicas para ganho de força. Sempre consulte um profissional antes de suplementar.',
        category: 'nutrition',
        difficulty: 'advanced',
        tags: ['suplementos', 'whey', 'creatina'],
        icon: <Apple className="w-5 h-5" />,
        color: 'bg-accent-100 text-accent-800 border-accent-200'
      },

      // Dicas de Estilo de Vida
      {
        id: '7',
        title: 'Qualidade do Sono',
        content: 'Durma 7-9 horas por noite. O sono é quando o corpo se recupera e os músculos crescem. Evite telas 1 hora antes de dormir, mantenha o quarto escuro e frio, e estabeleça uma rotina consistente de sono.',
        category: 'lifestyle',
        difficulty: 'beginner',
        tags: ['sono', 'recuperação', 'rotina'],
        icon: <Heart className="w-5 h-5" />,
        color: 'bg-secondary-100 text-secondary-800 border-secondary-200'
      },
      {
        id: '8',
        title: 'Gerenciamento de Estresse',
        content: 'O estresse crônico aumenta o cortisol, que pode dificultar o ganho de massa muscular e a perda de gordura. Pratique meditação, respiração profunda, ou atividades relaxantes. O exercício também é um excelente redutor de estresse.',
        category: 'lifestyle',
        difficulty: 'intermediate',
        tags: ['estresse', 'cortisol', 'meditação'],
        icon: <Heart className="w-5 h-5" />,
        color: 'bg-secondary-100 text-secondary-800 border-secondary-200'
      },
      {
        id: '9',
        title: 'Consistência vs Perfeição',
        content: 'É melhor treinar 3 vezes por semana de forma consistente do que tentar treinar todos os dias e desistir. Pequenos hábitos diários levam a grandes mudanças ao longo do tempo. Foque na consistência, não na perfeição.',
        category: 'lifestyle',
        difficulty: 'beginner',
        tags: ['consistência', 'hábitos', 'mudanças'],
        icon: <Heart className="w-5 h-5" />,
        color: 'bg-secondary-100 text-secondary-800 border-secondary-200'
      },

      // Dicas de Motivação
      {
        id: '10',
        title: 'Defina Metas SMART',
        content: 'Suas metas devem ser Específicas, Mensuráveis, Alcançáveis, Relevantes e com Prazo definido. Em vez de "quero emagrecer", use "quero perder 5kg em 3 meses treinando 4x por semana". Metas claras aumentam a motivação.',
        category: 'motivation',
        difficulty: 'beginner',
        tags: ['metas', 'planejamento', 'motivação'],
        icon: <Target className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      {
        id: '11',
        title: 'Celebre Pequenas Vitórias',
        content: 'Reconheça e celebre cada conquista, por menor que seja. Conseguiu treinar 3 dias seguidos? Celebre! Perdeu 1kg? Celebre! O reconhecimento de progresso mantém a motivação alta e fortalece o hábito.',
        category: 'motivation',
        difficulty: 'beginner',
        tags: ['celebração', 'conquistas', 'motivação'],
        icon: <Star className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      {
        id: '12',
        title: 'Encontre Sua Tribo',
        content: 'Conecte-se com pessoas que compartilham seus objetivos de fitness. Treinar com amigos, participar de grupos online, ou contratar um personal trainer pode aumentar significativamente sua motivação e consistência.',
        category: 'motivation',
        difficulty: 'intermediate',
        tags: ['comunidade', 'suporte', 'responsabilidade'],
        icon: <Users className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      }
    ];

    // Filtrar dicas baseado no objetivo do usuário
    if (user?.goal === 'lose') {
      baseTips.push({
        id: '13',
        title: 'Déficit Calórico Sustentável',
        content: 'Para emagrecer, você precisa consumir menos calorias do que gasta. Mas não seja muito agressivo - um déficit de 300-500 calorias por dia é mais sustentável e evita perda de massa muscular.',
        category: 'nutrition',
        difficulty: 'intermediate',
        tags: ['déficit calórico', 'emagrecimento', 'sustentabilidade'],
        icon: <Apple className="w-5 h-5" />,
        color: 'bg-accent-100 text-accent-800 border-accent-200'
      });
    }

    if (user?.goal === 'gain') {
      baseTips.push({
        id: '14',
        title: 'Superávit Calórico Controlado',
        content: 'Para ganhar massa muscular, você precisa de um superávit calórico de 200-400 calorias por dia. Foque em proteínas (1.6-2.2g/kg) e carboidratos complexos. O excesso de calorias pode levar ao ganho de gordura.',
        category: 'nutrition',
        difficulty: 'intermediate',
        tags: ['superávit calórico', 'hipertrofia', 'proteínas'],
        icon: <Apple className="w-5 h-5" />,
        color: 'bg-accent-100 text-accent-800 border-accent-200'
      });
    }

    return baseTips;
  };

  const tips = getPersonalizedTips();

  const filteredTips = tips.filter(tip => {
    const categoryMatch = selectedCategory === 'all' || tip.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || tip.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getCategoryStats = () => {
    const stats = {
      workout: workouts.length,
      nutrition: meals.length,
      lifestyle: progress.length,
      motivation: Math.round((workouts.length + meals.length) / 2)
    };
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="max-w-6xl mx-auto container-mobile">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dicas e Informações</h1>
          <p className="text-gray-600">Conhecimento é poder! Aprenda mais sobre fitness e saúde</p>
        </div>

        {/* Estatísticas das Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{categoryStats.workout}</div>
            <div className="text-sm text-gray-600">Treinos Registrados</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-accent-600 mb-1">{categoryStats.nutrition}</div>
            <div className="text-sm text-gray-600">Refeições Registradas</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-secondary-600 mb-1">{categoryStats.lifestyle}</div>
            <div className="text-sm text-gray-600">Medidas Registradas</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{categoryStats.motivation}</div>
            <div className="text-sm text-gray-600">Índice de Motivação</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="all">Todas as Categorias</option>
                <option value="workout">Treino</option>
                <option value="nutrition">Nutrição</option>
                <option value="lifestyle">Estilo de Vida</option>
                <option value="motivation">Motivação</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="all">Todas as Dificuldades</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dicas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTips.map((tip) => (
            <div key={tip.id} className="card hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${tip.color}`}>
                  {tip.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{tip.title}</h3>
                    <button
                      onClick={() => toggleTip(tip.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedTips.has(tip.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tip.category === 'workout' ? 'bg-primary-100 text-primary-800' :
                      tip.category === 'nutrition' ? 'bg-accent-100 text-accent-800' :
                      tip.category === 'lifestyle' ? 'bg-secondary-100 text-secondary-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {tip.category === 'workout' ? 'Treino' :
                       tip.category === 'nutrition' ? 'Nutrição' :
                       tip.category === 'lifestyle' ? 'Estilo de Vida' : 'Motivação'}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tip.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      tip.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tip.difficulty === 'beginner' ? 'Iniciante' :
                       tip.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                  </div>
                  
                  {expandedTips.has(tip.id) && (
                    <div className="mt-4">
                      <p className="text-gray-700 leading-relaxed mb-3">{tip.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {tip.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Nenhuma dica encontrada com os filtros selecionados</p>
            <p className="text-sm text-gray-400">Tente ajustar os filtros para ver mais dicas</p>
          </div>
        )}

        {/* Dica do Dia Personalizada */}
        <div className="card mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Dica Personalizada do Dia</h3>
              <p className="text-primary-700 leading-relaxed">
                {user?.goal === 'lose' && 'Para emagrecer de forma saudável, combine treinos de cardio (30-45 min) com treinos de força (3-4x por semana). Mantenha um déficit calórico de 300-500 calorias e durma bem para otimizar a queima de gordura.'}
                {user?.goal === 'gain' && 'Para ganhar massa muscular, priorize treinos de força com 6-12 repetições por série. Consuma 1.6-2.2g de proteína por kg de peso corporal e mantenha um superávit calórico de 200-400 calorias. Descanse adequadamente entre os treinos.'}
                {user?.goal === 'maintain' && 'Para manter sua forma atual, mantenha uma rotina de exercícios consistente (3-4x por semana) com uma combinação de cardio e força. Equilibre suas calorias e mantenha uma dieta variada e nutritiva.'}
              </p>
              <div className="mt-3 text-sm text-primary-600">
                💡 Esta dica foi personalizada com base no seu objetivo: <strong>
                  {user?.goal === 'lose' ? 'Emagrecer' :
                   user?.goal === 'gain' ? 'Ganhar Massa Muscular' : 'Manter Forma'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;
