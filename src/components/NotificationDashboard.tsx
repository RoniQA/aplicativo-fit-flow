import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationDashboard: React.FC = () => {
  const { getTodaysReminders, getUpcomingReminders, markReminderTriggered } = useNotifications();
  
  const todaysReminders = getTodaysReminders();
  const upcomingReminders = getUpcomingReminders(6); // Próximas 6 horas

  const getTimeStatus = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    
    const diffMs = reminderTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 0) return 'overdue';
    if (diffMinutes <= 15) return 'urgent';
    if (diffMinutes <= 60) return 'soon';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'soon':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'upcoming':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'urgent':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'soon':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'upcoming':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'Atrasado';
      case 'urgent':
        return 'Urgente';
      case 'soon':
        return 'Em breve';
      case 'upcoming':
        return 'Próximo';
      default:
        return 'Agendado';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getTimeUntil = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const diffMs = reminderTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `em ${diffHours}h ${diffMinutes}min`;
    }
    return `em ${diffMinutes}min`;
  };

  return (
    <div className="space-y-6">
      {/* Resumo do Dia */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary-600" />
            Resumo do Dia
          </h3>
          <div className="text-sm text-gray-600">
            {todaysReminders.length} lembretes hoje
          </div>
        </div>
        
        {todaysReminders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysReminders.map(reminder => {
              const status = getTimeStatus(reminder.time);
              return (
                <div
                  key={reminder.id}
                  className={`border rounded-lg p-4 transition-all ${getStatusColor(status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{reminder.icon}</span>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(status)}
                      <span className="text-xs font-medium">
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="font-medium text-sm">{reminder.title}</div>
                    <div className="text-xs opacity-80">{reminder.message}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {formatTime(reminder.time)}
                    </div>
                    <div className="text-xs opacity-60">
                      {getTimeUntil(reminder.time)}
                    </div>
                  </div>
                  
                  {status === 'overdue' && (
                    <button
                      onClick={() => markReminderTriggered(reminder.id)}
                      className="w-full mt-3 btn-primary text-xs py-2"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Marcar como Concluído
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum lembrete para hoje</p>
            <p className="text-sm">Configure lembretes para manter seus hábitos</p>
          </div>
        )}
      </div>

      {/* Próximas Notificações */}
      {upcomingReminders.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-secondary-600" />
            Próximas Notificações
          </h3>
          
          <div className="space-y-3">
            {upcomingReminders.slice(0, 5).map(reminder => {
              const status = getTimeStatus(reminder.time);
              return (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(status)}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{reminder.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{reminder.title}</div>
                      <div className="text-xs opacity-80">{reminder.message}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatTime(reminder.time)}</div>
                    <div className="text-xs opacity-60">{getTimeUntil(reminder.time)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {upcomingReminders.length > 5 && (
            <div className="text-center mt-4">
              <button className="text-sm text-primary-600 hover:text-primary-800">
                Ver mais ({upcomingReminders.length - 5} restantes)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {todaysReminders.filter(r => getTimeStatus(r.time) === 'overdue').length}
          </div>
          <div className="text-sm text-gray-600">Pendentes</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent-600">
            {todaysReminders.filter(r => getTimeStatus(r.time) === 'urgent').length}
          </div>
          <div className="text-sm text-gray-600">Urgentes</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-secondary-600">
            {todaysReminders.filter(r => getTimeStatus(r.time) === 'upcoming').length}
          </div>
          <div className="text-sm text-gray-600">Agendados</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDashboard;
