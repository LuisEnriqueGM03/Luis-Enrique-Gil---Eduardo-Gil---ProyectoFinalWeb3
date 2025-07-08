import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VotanteForm from '../components/forms/VotanteForm';
import RecintoForm from '../components/forms/RecintoForm';
import VotanteList from '../components/VotanteList';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Lista de Votantes', href: '/admin/votantes', icon: 'users' },
    { name: 'Registrar Votante', href: '/admin/votantes/nuevo', icon: 'user-add' },
    { name: 'Registrar Recinto', href: '/admin/recintos/nuevo', icon: 'location' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out`}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Panel Administrativo</h1>
        </div>
        
        <nav className="mt-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                isActive(item.href)
                  ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, {user?.username}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/votantes" element={<VotanteList />} />
            <Route path="/votantes/nuevo" element={<VotanteForm />} />
            <Route path="/votantes/editar/:id" element={<VotanteForm />} />
            <Route path="/recintos/nuevo" element={<RecintoForm />} />
          </Routes>
        </main>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const DashboardHome: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard del Administrador</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Gestión de Votantes</dt>
                <dd className="text-lg font-medium text-gray-900">Registrar y administrar votantes</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/votantes/nuevo"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Registrar nuevo votante →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Gestión de Recintos</dt>
                <dd className="text-lg font-medium text-gray-900">Registrar recintos electorales</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/recintos/nuevo"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Registrar nuevo recinto →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Lista de Votantes</dt>
                <dd className="text-lg font-medium text-gray-900">Ver y gestionar registros</dd>
              </dl>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/votantes"
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Ver lista completa →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 