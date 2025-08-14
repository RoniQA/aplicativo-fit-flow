import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';
import { Bell, BellOff, Clock, Volume2, VolumeX, Moon, Sun, Settings, Plus, Trash, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { generateSuggestedReminders } from '../utils/reminderUtils';

const NotificationSettings: React.FC = () => {
  const { 
    reminders, 
    settings, 
    addReminder, 
    deleteReminder, 
    toggleReminder, 
    updateSettings,
    requestNotificationPermission 
  } = useNotifications();
  
  const { user } = useUser();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfigurations, setShowConfigurations] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'exercise' as 'exercise' | 'meal' | 'hydration' | 'progress' | 'goal',
    title: '',
    message: '',
    time: '08:00',
    days: [1, 2, 3, 4, 5] as number[],
    frequency: 'daily' as const,
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    icon: '🔔',
    color: 'primary',
    enabled: true
  });

  const weekDays = [
    { value: 0, label: 'Dom', short: 'D' },
    { value: 1, label: 'Seg', short: 'S' },
    { value: 2, label: 'Ter', short: 'T' },
    { value: 3, label: 'Qua', short: 'Q' },
    { value: 4, label: 'Qui', short: 'Q' },
    { value: 5, label: 'Sex', short: 'S' },
    { value: 6, label: 'Sáb', short: 'S' }
  ];

  const reminderTypes = [
    { value: 'exercise', label: 'Exercício', icon: '🏋️', color: 'primary' },
    { value: 'meal', label: 'Refeição', icon: '🍽️', color: 'accent' },
    { value: 'hydration', label: 'Hidratação', icon: '💧', color: 'secondary' },
    { value: 'progress', label: 'Progresso', icon: '📊', color: 'success' },
    { value: 'goal', label: 'Meta', icon: '🎯', color: 'warning' }
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: 'text-gray-500' },
    { value: 'medium', label: 'Média', color: 'text-yellow-600' },
    { value: 'high', label: 'Alta', color: 'text-red-600' }
  ];

  const handleRequestPermission = async () => {
    try {
      console.log('=== DEBUG: handleRequestPermission ===');
      console.log('settings.enabled antes:', settings.enabled);
      
      if (settings.enabled) {
        // Se as notificações já estão ativadas, o botão "Ver Configurações" alterna a visibilidade
        console.log('Alternando visibilidade das configurações...');
        setShowConfigurations(!showConfigurations);
        return;
      }
      
      console.log('Chamando requestNotificationPermission...');
      
      const granted = await requestNotificationPermission();
      console.log('Permissão concedida:', granted);
      
      if (granted) {
        console.log('Atualizando configurações para enabled: true');
        updateSettings({ enabled: true });
        console.log('Configurações atualizadas. Novo valor:', settings.enabled);
        
        // Mostrar mensagem de sucesso
        alert('Notificações ativadas com sucesso! Agora você pode configurar seus lembretes personalizados.');
      } else {
        console.log('Permissão negada pelo usuário');
        alert('Permissão de notificação negada. Você pode ativar manualmente nas configurações do navegador.');
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      alert('Erro ao solicitar permissão de notificação. Tente novamente.');
    }
  };

  const handleAddReminder = () => {
    console.log('=== DEBUG: handleAddReminder ===');
    console.log('newReminder:', newReminder);
    console.log('newReminder.title:', newReminder.title);
    console.log('newReminder.message:', newReminder.message);
    console.log('newReminder.days:', newReminder.days);
    console.log('newReminder.title.trim():', newReminder.title.trim());
    console.log('newReminder.message.trim():', newReminder.message.trim());
    console.log('newReminder.days.length:', newReminder.days.length);
    
    if (!newReminder.title.trim()) {
      console.log('❌ Título vazio');
      alert('Por favor, insira um título para o lembrete');
      return;
    }
    
    if (!newReminder.message.trim()) {
      console.log('❌ Mensagem vazia');
      alert('Por favor, insira uma mensagem para o lembrete');
      return;
    }
    
    if (newReminder.days.length === 0) {
      console.log('❌ Nenhum dia selecionado');
      alert('Por favor, selecione pelo menos um dia da semana');
      return;
    }
    
    console.log('✅ Validação passou, adicionando lembrete...');
    
    try {
      addReminder(newReminder);
      console.log('✅ Lembrete adicionado com sucesso!');
      
      // Reset do formulário
      setNewReminder({
        type: 'exercise' as 'exercise' | 'meal' | 'hydration' | 'progress' | 'goal',
        title: '',
        message: '',
        time: '08:00',
        days: [1, 2, 3, 4, 5] as number[],
        frequency: 'daily' as const,
        priority: 'medium' as 'low' | 'medium' | 'high',
        category: '',
        icon: '🔔',
        color: 'primary',
        enabled: true
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('❌ Erro ao adicionar lembrete:', error);
      alert('Erro ao adicionar lembrete. Tente novamente.');
    }
  };

  const toggleDay = (day: number) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exercise': return 'bg-primary-50 border-primary-200 text-primary-800';
      case 'meal': return 'bg-accent-50 border-accent-200 text-accent-800';
      case 'hydration': return 'bg-secondary-50 border-secondary-200 text-secondary-800';
      case 'progress': return 'bg-success-50 border-success-200 text-success-800';
      case 'goal': return 'bg-warning-50 border-warning-200 text-warning-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 pb-20 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações de Notificações</h1>
          <p className="text-gray-600">Configure lembretes personalizados para manter seus hábitos saudáveis</p>
        </div>

        {/* Status das Notificações */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.enabled ? (
                <Bell className="w-6 h-6 text-green-600" />
              ) : (
                <BellOff className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {settings.enabled ? 'Notificações Ativadas' : 'Notificações Desativadas'}
                </h3>
                <p className="text-sm text-gray-600">
                  {settings.enabled 
                    ? 'Você receberá lembretes para manter seus hábitos saudáveis'
                    : 'Ative as notificações para receber lembretes importantes'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleRequestPermission}
              className={`btn ${settings.enabled ? 'btn-secondary' : 'btn-primary'}`}
            >
              {settings.enabled 
                ? (showConfigurations ? 'Ocultar Configurações' : 'Ver Configurações')
                : 'Ativar Notificações'
              }
            </button>
          </div>
        </div>

        {/* Configurações Gerais */}
        {showConfigurations && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Configurações Básicas */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configurações Básicas
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Som</span>
                  <button
                    onClick={() => updateSettings({ sound: !settings.sound })}
                    className="flex items-center"
                  >
                    {settings.sound ? (
                      <Volume2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Vibração</span>
                  <button
                    onClick={() => updateSettings({ vibration: !settings.vibration })}
                    className="flex items-center"
                  >
                    {settings.vibration ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Horário Silencioso</span>
                  <button
                    onClick={() => updateSettings({ 
                      quietHours: { ...settings.quietHours, enabled: !settings.quietHours.enabled }
                    })}
                    className="flex items-center"
                  >
                    {settings.quietHours.enabled ? (
                      <Moon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Horário Silencioso */}
              {settings.quietHours.enabled && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Início</label>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => updateSettings({
                          quietHours: { ...settings.quietHours, start: e.target.value }
                        })}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fim</label>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => updateSettings({
                          quietHours: { ...settings.quietHours, end: e.target.value }
                        })}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Configurações Avançadas */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Configurações Avançadas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lembrar com antecedência (minutos)
                  </label>
                  <input
                    type="number"
                    value={settings.reminderAdvance}
                    onChange={(e) => updateSettings({ 
                      reminderAdvance: parseInt(e.target.value) || 15 
                    })}
                    className="input-field"
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de lembretes por dia
                  </label>
                  <input
                    type="number"
                    value={settings.maxRemindersPerDay}
                    onChange={(e) => updateSettings({ 
                      maxRemindersPerDay: parseInt(e.target.value) || 10 
                    })}
                    className="input-field"
                    min="1"
                    max="20"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Permitir adiar</span>
                  <button
                    onClick={() => updateSettings({ snoozeEnabled: !settings.snoozeEnabled })}
                    className="flex items-center"
                  >
                    {settings.snoozeEnabled ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {settings.snoozeEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração do adiamento (minutos)
                    </label>
                    <input
                      type="number"
                      value={settings.snoozeDuration}
                      onChange={(e) => updateSettings({ 
                        snoozeDuration: parseInt(e.target.value) || 15 
                      })}
                      className="input-field"
                      min="5"
                      max="60"
                      step="5"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Horários Sugeridos Inteligentes */}
        {user && (
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Horários Sugeridos para {user.name}
              </h3>
              <div className="text-sm text-gray-600">
                Baseado no seu perfil: {user.goal === 'lose' ? 'Emagrecimento' : user.goal === 'gain' ? 'Ganho de Massa' : 'Manutenção'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {generateSuggestedReminders(user).map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setNewReminder({
                      type: suggestion.type,
                      title: suggestion.title,
                      message: suggestion.message,
                      time: suggestion.time,
                      days: suggestion.days,
                      frequency: 'daily',
                      priority: suggestion.priority,
                      category: suggestion.category,
                      icon: suggestion.icon,
                      color: suggestion.color,
                      enabled: true
                    });
                    setShowAddForm(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="font-medium text-sm text-gray-800">{suggestion.title}</div>
                    <div className="text-xs text-gray-600 mb-2">{suggestion.message}</div>
                    <div className="text-xs font-medium text-purple-600">
                      ⏰ {suggestion.time} • {suggestion.days.length === 7 ? 'Todos os dias' : suggestion.days.length === 5 ? 'Seg-Sex' : 'Personalizado'}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-white/50 rounded px-2 py-1">
                    💡 {suggestion.reason}
                  </div>
                  
                  <div className="mt-3 text-center">
                    <button className="text-xs text-purple-600 hover:text-purple-800 font-medium">
                      Usar este horário →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-600">
              💡 Clique em qualquer sugestão para usar como base para seu lembrete personalizado
            </div>
          </div>
        )}

        {/* Lista de Lembretes */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Lembretes Configurados</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary text-sm py-2 px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Lembrete
            </button>
          </div>

          {/* Formulário de Adição */}
          {showAddForm && (
            <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
              <h4 className="font-medium mb-3">Novo Lembrete</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tipo</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder(prev => ({ 
                      ...prev, 
                      type: e.target.value as any,
                      icon: reminderTypes.find(t => t.value === e.target.value)?.icon || '🔔',
                      color: reminderTypes.find(t => t.value === e.target.value)?.color || 'primary'
                    }))}
                    className="input-field text-sm"
                  >
                    {reminderTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Horário</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Título</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field text-sm"
                    placeholder="Ex: Hora do Treino!"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Prioridade</label>
                  <select
                    value={newReminder.priority}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="input-field text-sm"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Mensagem</label>
                <textarea
                  value={newReminder.message}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                  className="input-field text-sm"
                  rows={2}
                  placeholder="Ex: Mantenha a consistência! Seu corpo agradece."
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1">Dias da Semana</label>
                <div className="flex space-x-2">
                  {weekDays.map(day => (
                    <button
                      key={day.value}
                      onClick={() => toggleDay(day.value)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                        newReminder.days.includes(day.value)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {day.short}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddReminder}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Adicionar Lembrete
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de Lembretes */}
          <div className="space-y-3">
            {reminders.map(reminder => (
              <div
                key={reminder.id}
                className={`border rounded-lg p-4 transition-all ${
                  reminder.enabled 
                    ? getTypeColor(reminder.type)
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{reminder.icon}</span>
                    <div>
                      <div className="font-medium">{reminder.title}</div>
                      <div className="text-sm opacity-80">{reminder.message}</div>
                      <div className="text-xs opacity-60">
                        {reminder.time} • {reminder.days.map(d => weekDays[d].label).join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                      {priorities.find(p => p.value === reminder.priority)?.label}
                    </span>
                    
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`p-1 rounded ${
                        reminder.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {reminder.enabled ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {reminders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum lembrete configurado</p>
                <p className="text-sm">Adicione seu primeiro lembrete para começar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
