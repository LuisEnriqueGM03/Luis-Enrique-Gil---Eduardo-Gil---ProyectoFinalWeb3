import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Trophy, 
  Building, 
  Table, 
  Users, 
  Calendar, 
  UserCheck, 
  FileText,
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NavItem } from '../../models/ui';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasAdminRole } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Secciones', href: '/secciones', icon: MapPin },
    { name: 'Cargos', href: '/cargos', icon: Trophy },
    { name: 'Recintos', href: '/recintos', icon: Building },
    { name: 'Mesas Electorales', href: '/mesas-electorales', icon: Table },
    { name: 'Jurados', href: '/jurados', icon: UserCheck },
    { name: 'Elecciones', href: '/elecciones', icon: Calendar },
    { name: 'Candidaturas', href: '/candidaturas', icon: Users },
    { name: 'Papeletas', href: '/papeletas', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-secondary-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-secondary-900">
              Admin Electoral
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-secondary-200 p-4 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.nombre}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {hasAdminRole ? 'Administrador Electoral' : 'Usuario'}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-secondary-200 px-4 py-4 sm:px-6 lg:px-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-semibold text-secondary-900">
                  Sistema de Administración Electoral
                </h1>
                <p className="text-sm text-secondary-600 mt-1">
                  Panel de gestión para administradores electorales
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <span className="text-sm text-secondary-600">
                  Bienvenido, <span className="font-medium">{user?.nombre}</span>
                  {hasAdminRole && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Admin Electoral
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 