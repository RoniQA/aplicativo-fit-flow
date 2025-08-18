import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { User } from '../contexts/UserContext';

interface EditUserFormProps {
  onClose?: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ onClose }) => {
  const { user, updateUser, clearData } = useUser();
  const [formData, setFormData] = useState<User | null>(user);



  if (!formData) return <div>Nenhum usuário cadastrado.</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleLimitationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Atualizar o estado do textarea diretamente para o teste funcionar
    setFormData(prev => prev ? { ...prev, physicalLimitations: [e.target.value] } : prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateUser({ ...formData });
      alert('Dados atualizados com sucesso!');
      if (onClose) {
        onClose();
      }
    }
  };

  return (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto form-mobile">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium mb-2">Gênero</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="input-field"
          required
        >
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">Nome</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="input-field"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-2">Idade</label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium mb-2">Peso (kg)</label>
          <input
            id="weight"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium mb-2">Altura (cm)</label>
          <input
            id="height"
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="goal" className="block text-sm font-medium mb-2">Objetivo</label>
        <select id="goal" name="goal" value={formData.goal} onChange={handleInputChange} className="input-field">
          <option value="lose">Emagrecer</option>
          <option value="gain">Ganhar Massa Muscular</option>
          <option value="maintain">Manter Saúde</option>
        </select>
      </div>
      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium mb-2">Nível de Atividade</label>
        <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="input-field">
          <option value="low">Baixo</option>
          <option value="medium">Médio</option>
          <option value="high">Alto</option>
        </select>
      </div>
      <div>
        <label htmlFor="workoutLocation" className="block text-sm font-medium mb-2">Local de Treino</label>
        <select id="workoutLocation" name="workoutLocation" value={formData.workoutLocation} onChange={handleInputChange} className="input-field">
          <option value="home">Casa</option>
          <option value="gym">Academia</option>
          <option value="crossfit">Crossfit</option>
          <option value="outdoor">Ar Livre</option>
          <option value="mixed">Misto</option>
        </select>
      </div>
      <div>
        <label htmlFor="bodyTypeGoal" className="block text-sm font-medium mb-2">Tipo de Corpo Desejado</label>
        <select id="bodyTypeGoal" name="bodyTypeGoal" value={formData.bodyTypeGoal} onChange={handleInputChange} className="input-field">
          <option value="athletic">Atlético</option>
          <option value="lean">Magro</option>
          <option value="muscular">Musculoso</option>
          <option value="toned">Definido</option>
          <option value="flexible">Flexível</option>
        </select>
      </div>
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2">Nível de Experiência</label>
        <select id="experienceLevel" name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="input-field">
          <option value="beginner">Iniciante</option>
          <option value="intermediate">Intermediário</option>
          <option value="advanced">Avançado</option>
        </select>
      </div>
      <div>
        <label htmlFor="physicalLimitations" className="block text-sm font-medium mb-2">Limitações Físicas</label>
        <textarea
          id="physicalLimitations"
          name="physicalLimitations"
          value={formData.physicalLimitations[0] || ''}
          onChange={handleLimitationsChange}
          className="input-field"
          rows={2}
          placeholder="Ex: lesão no joelho, problema de coluna, etc."
        />
      </div>
      <div>
        <label htmlFor="dietaryPreferences" className="block text-sm font-medium mb-2">Preferências Alimentares</label>
        <select id="dietaryPreferences" name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleInputChange} className="input-field">
          <option value="none">Nenhuma</option>
          <option value="vegetarian">Vegetariano</option>
          <option value="vegan">Vegano</option>
          <option value="glutenFree">Sem Glúten</option>
          <option value="lactoseFree">Sem Lactose</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
      </div>
      <div>
        <label htmlFor="availableTime" className="block text-sm font-medium mb-2">Tempo Disponível</label>
        <select id="availableTime" name="availableTime" value={formData.availableTime} onChange={handleInputChange} className="input-field">
          <option value="15min">15 min</option>
          <option value="30min">30 min</option>
          <option value="45min">45 min</option>
          <option value="60min">60 min</option>
          <option value="90min">90 min</option>
          <option value="flexible">Flexível</option>
        </select>
      </div>
      <button type="submit" className="w-full py-4 px-6 rounded-xl font-medium text-lg btn-primary mt-4">
        Salvar Alterações
      </button>
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Tem certeza que deseja excluir seu usuário e todos os dados?')) {
            clearData();
            alert('Usuário excluído com sucesso!');
            if (onClose) {
              onClose();
            }
            // Redirecionar para a página inicial após um pequeno delay
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
          }
        }}
        className="w-full py-4 px-6 rounded-xl font-medium text-lg bg-red-500 text-white mt-2 hover:bg-red-600 transition-colors"
      >
        Excluir Usuário
      </button>
    </form>
  );
};

export default EditUserForm;
