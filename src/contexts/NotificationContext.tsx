import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Reminder {
  id: string;
  type: 'exercise' | 'meal' | 'hydration' | 'progress' | 'goal';
  title: string;
  message: string;
  time: string; // HH:mm format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'custom';
  priority: 'low' | 'medium' | 'high';
  lastTriggered?: Date;
  nextTrigger?: Date;
  category: string;
  icon: string;
  color: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
  reminderAdvance: number; // minutes before
  maxRemindersPerDay: number;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
}

interface NotificationContextType {
  reminders: Reminder[];
  settings: NotificationSettings;
  addReminder: (reminder: Omit<Reminder, 'id' | 'lastTriggered' | 'nextTrigger'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateSettings: (updates: Partial<NotificationSettings>) => void;
  getTodaysReminders: () => Reminder[];
  getUpcomingReminders: (hours?: number) => Reminder[];
  markReminderTriggered: (id: string) => void;
  requestNotificationPermission: () => Promise<boolean>;
  scheduleLocalNotification: (reminder: Reminder) => void;
  cancelLocalNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  vibration: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  reminderAdvance: 15,
  maxRemindersPerDay: 10,
  snoozeEnabled: true,
  snoozeDuration: 15
};

const defaultReminders: Reminder[] = [
  {
    id: '1',
    type: 'exercise',
    title: 'Hora do Treino! 💪',
    message: 'Mantenha a consistência! Seu corpo agradece.',
    time: '07:00',
    days: [1, 2, 3, 4, 5], // Segunda a Sexta
    enabled: true,
    frequency: 'daily',
    priority: 'high',
    category: 'Fitness',
    icon: '🏋️',
    color: 'primary'
  },
  {
    id: '2',
    type: 'meal',
    title: 'Café da Manhã ☕',
    message: 'Comece o dia com energia! Não pule o café da manhã.',
    time: '08:00',
    days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
    enabled: true,
    frequency: 'daily',
    priority: 'medium',
    category: 'Nutrição',
    icon: '🍳',
    color: 'accent'
  },
  {
    id: '3',
    type: 'hydration',
    title: 'Hora de Beber Água 💧',
    message: 'Mantenha-se hidratado! Beba um copo de água.',
    time: '10:00',
    days: [1, 2, 3, 4, 5, 6, 0], // Todos os dias
    enabled: true,
    frequency: 'daily',
    priority: 'low',
    category: 'Saúde',
    icon: '💧',
    color: 'secondary'
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Carregar dados salvos
  useEffect(() => {
    const savedReminders = localStorage.getItem('fitflow-reminders');
    const savedSettings = localStorage.getItem('fitflow-notification-settings');
    
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      setReminders(defaultReminders);
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Salvar dados quando mudarem
  useEffect(() => {
    localStorage.setItem('fitflow-reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('fitflow-notification-settings', JSON.stringify(settings));
  }, [settings]);

  // Solicitar permissão de notificação
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  // Agendar notificação local
  const scheduleLocalNotification = (reminder: Reminder) => {
    if (!settings.enabled || !reminder.enabled) return;

    // Verificar se está em horário silencioso
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = parseInt(settings.quietHours.start.split(':')[0]) * 60 + 
                       parseInt(settings.quietHours.start.split(':')[1]);
      const endTime = parseInt(settings.quietHours.end.split(':')[0]) * 60 + 
                     parseInt(settings.quietHours.end.split(':')[1]);
      
      if (currentTime >= startTime || currentTime <= endTime) {
        return;
      }
    }

    // Calcular próximo horário de trigger
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const nextTrigger = new Date();
    nextTrigger.setHours(hours, minutes, 0, 0);
    
    if (nextTrigger <= new Date()) {
      nextTrigger.setDate(nextTrigger.getDate() + 1);
    }

    // Verificar se é um dia válido
    if (!reminder.days.includes(nextTrigger.getDay())) {
      return;
    }

    // Agendar notificação
    const timeUntilTrigger = nextTrigger.getTime() - Date.now();
    
    setTimeout(() => {
      if (settings.enabled && reminder.enabled) {
        new Notification(reminder.title, {
          body: reminder.message,
          icon: '/favicon.ico',
          tag: reminder.id,
          requireInteraction: reminder.priority === 'high',
          silent: !settings.sound
        });

        // Marcar como disparada
        markReminderTriggered(reminder.id);
        
        // Agendar próxima notificação
        scheduleLocalNotification(reminder);
      }
    }, timeUntilTrigger);
  };

  // Cancelar notificação local
  const cancelLocalNotification = (id: string) => {
    // Implementar cancelamento de notificações agendadas
    console.log(`Notificação cancelada: ${id}`);
  };

  // Adicionar lembrete
  const addReminder = (reminder: Omit<Reminder, 'id' | 'lastTriggered' | 'nextTrigger'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      lastTriggered: undefined,
      nextTrigger: undefined
    };
    
    setReminders(prev => [...prev, newReminder]);
    
    if (newReminder.enabled) {
      scheduleLocalNotification(newReminder);
    }
  };

  // Atualizar lembrete
  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
    
    const updatedReminder = reminders.find(r => r.id === id);
    if (updatedReminder && updatedReminder.enabled) {
      scheduleLocalNotification(updatedReminder);
    }
  };

  // Deletar lembrete
  const deleteReminder = (id: string) => {
    cancelLocalNotification(id);
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  // Alternar lembrete
  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => {
      if (reminder.id === id) {
        const updated = { ...reminder, enabled: !reminder.enabled };
        if (updated.enabled) {
          scheduleLocalNotification(updated);
        } else {
          cancelLocalNotification(id);
        }
        return updated;
      }
      return reminder;
    }));
  };

  // Atualizar configurações
  const updateSettings = (updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Obter lembretes de hoje
  const getTodaysReminders = (): Reminder[] => {
    const today = new Date().getDay();
    return reminders.filter(reminder => 
      reminder.enabled && reminder.days.includes(today)
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Obter próximos lembretes
  const getUpcomingReminders = (hours: number = 24): Reminder[] => {
    const now = new Date();
    const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return reminders.filter(reminder => {
      if (!reminder.enabled) return false;
      
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);
      
      return reminderTime >= now && reminderTime <= endTime;
    }).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Marcar lembrete como disparado
  const markReminderTriggered = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, lastTriggered: new Date() }
        : reminder
    ));
  };

  // Configurar lembretes padrão quando o usuário ativa notificações
  useEffect(() => {
    if (settings.enabled && reminders.length === 0) {
      setReminders(defaultReminders);
    }
  }, [settings.enabled, reminders.length]);

  const value: NotificationContextType = {
    reminders,
    settings,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    updateSettings,
    getTodaysReminders,
    getUpcomingReminders,
    markReminderTriggered,
    requestNotificationPermission,
    scheduleLocalNotification,
    cancelLocalNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
