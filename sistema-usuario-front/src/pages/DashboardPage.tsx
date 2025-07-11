import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usuarioService } from '../services/usuarioService';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const usuariosResponse = await usuarioService.obtenerUsuarios();
      let totalUsuarios = 0;
      if (Array.isArray(usuariosResponse)) {
        totalUsuarios = usuariosResponse.length;
      } else if (usuariosResponse.success) {
        totalUsuarios = usuariosResponse.total;
      }
      setStats({
        totalUsuarios,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios,
      icon: '👥',
      color: 'bg-blue-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center mb-6">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Dashboard</h1>
        <p className="mt-1 text-lg text-blue-700">Bienvenido, <span className="font-bold">{user?.nombre}</span></p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-gradient-to-br from-blue-200 to-blue-400 shadow-xl rounded-2xl p-8 flex flex-col items-center min-w-[220px]">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-600 text-white text-3xl p-4 shadow-lg">
                {card.icon}
              </div>
            </div>
            <dl>
              <dt className="text-lg font-semibold text-blue-900">{card.title}</dt>
              <dd className="text-3xl font-extrabold text-blue-900">{card.value}</dd>
            </dl>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Acciones Rápidas</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <a
            href="/usuarios"
            className="flex items-center p-6 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow text-blue-900 font-semibold text-lg gap-4"
          >
            <span className="text-3xl">👥</span>
            Gestionar Usuarios
          </a>
          <a
            href="/perfil"
            className="flex items-center p-6 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow text-blue-900 font-semibold text-lg gap-4"
          >
            <span className="text-3xl">👤</span>
            Mi Perfil
          </a>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Información del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">Roles Disponibles</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-base text-blue-900">• Super Administrador</li>
              <li className="text-base text-blue-900">• Administrador de Elecciones</li>
              <li className="text-base text-blue-900">• Jurado Electoral</li>
              <li className="text-base text-blue-900">• Administrador del Padrón</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-700">Funcionalidades</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-base text-blue-900">• CRUD completo de usuarios</li>
              <li className="text-base text-blue-900">• Control de acceso granular</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 