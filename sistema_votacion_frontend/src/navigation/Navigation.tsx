// Componente de navegación principal

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ShieldCheckIcon,
  UserIcon,
  ChartPieIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import { ROUTES } from '../models/constants';
import ConnectionStatus from '../components/common/ConnectionStatus';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    label: 'Inicio',
    path: ROUTES.HOME,
    icon: HomeIcon,
    description: 'Página principal del sistema'
  },
  {
    label: 'Jurado Electoral',
    path: ROUTES.JURADO,
    icon: ShieldCheckIcon,
    description: 'Verificación y habilitación de papeletas'
  },
  {
    label: 'Votante',
    path: ROUTES.VOTANTE,
    icon: UserIcon,
    description: 'Interfaz para emisión de votos'
  },
  {
    label: 'Resultados',
    path: ROUTES.RESULTADOS,
    icon: ChartPieIcon,
    description: 'Resultados en tiempo real'
  }
];

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActivePath = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Sistema de Votación
              </h1>
              <p className="text-xs text-gray-500">Electoral en Tiempo Real</p>
            </div>
          </div>

          {/* Menú de navegación */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  title={item.description}
                >
                  <IconComponent 
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'
                    }`} 
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Estado de conexión */}
          <div className="flex items-center">
            <ConnectionStatus size="sm" />
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="grid grid-cols-2 gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center space-y-1 p-2 rounded-lg text-xs
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <IconComponent 
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`} 
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 