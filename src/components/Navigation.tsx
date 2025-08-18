import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Lightbulb,
  Bell
} from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Início',
      icon: Home,
      color: 'text-primary-600'
    },
    {
      path: '/workout',
      label: 'Treino',
      icon: Dumbbell,
      color: 'text-primary-600'
    },
    {
      path: '/meal',
      label: 'Refeição',
      icon: Apple,
      color: 'text-accent-600'
    },
    {
      path: '/progress',
      label: 'Progresso',
      icon: TrendingUp,
      color: 'text-secondary-600'
    },
    {
      path: '/tips',
      label: 'Dicas',
      icon: Lightbulb,
      color: 'text-purple-600'
    },
    {
      path: '/notifications',
      label: 'Lembretes',
      icon: Bell,
      color: 'text-orange-600'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 z-50 nav-mobile shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 py-3 px-2 rounded-xl transition-all duration-200 btn-touch ${
                  active 
                    ? 'bg-primary-50 text-primary-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? item.color : ''}`} />
                <span className={`text-xs font-medium ${active ? 'text-primary-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
