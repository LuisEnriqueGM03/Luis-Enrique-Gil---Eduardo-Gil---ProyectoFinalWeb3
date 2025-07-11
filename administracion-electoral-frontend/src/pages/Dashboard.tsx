import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Trophy, 
  Building, 
  Table, 
  Users, 
  Calendar, 
  UserCheck, 
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';
import { DashboardStats } from '../models/ui';
import { seccionesService } from '../services/seccionesService';
import { cargosService } from '../services/cargosService';
import { recintosService } from '../services/recintosService';
import { mesasElectoralesService } from '../services/mesasElectoralesService';
import { juradosService } from '../services/juradosService';
import { eleccionesService } from '../services/eleccionesService';
import { candidaturasService } from '../services/candidaturasService';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
        const [secciones, cargos, recintos, mesas, jurados, elecciones, candidaturas] = await Promise.all([
          seccionesService.getSecciones(),
          cargosService.getCargos(),
          recintosService.getRecintos(),
          mesasElectoralesService.getMesasElectorales(),
          juradosService.getJurados(),
          eleccionesService.getElecciones(),
          candidaturasService.getCandidaturas(),
        ]);

      const dashboardStats: DashboardStats = {
        total_secciones: secciones.count || secciones.results?.length || 0,
        total_cargos: cargos.count || cargos.results?.length || 0,
        total_recintos: recintos.count || recintos.results?.length || 0,
        total_mesas: mesas.count || mesas.results?.length || 0,
        total_jurados: jurados.count || jurados.results?.length || 0,
        total_elecciones: elecciones.count || elecciones.results?.length || 0,
        total_candidaturas: candidaturas.count || candidaturas.results?.length || 0,
      };

      setStats(dashboardStats);
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Error al cargar estadísticas del dashboard');
      
      setStats({
        total_secciones: 0,
        total_cargos: 0,
        total_recintos: 0,
        total_mesas: 0,
        total_jurados: 0,
        total_elecciones: 0,
        total_candidaturas: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Secciones',
      value: stats?.total_secciones || 0,
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/secciones',
      description: 'Divisiones territoriales'
    },
    {
      title: 'Cargos',
      value: stats?.total_cargos || 0,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/cargos',
      description: 'Cargos en disputa'
    },
    {
      title: 'Recintos',
      value: stats?.total_recintos || 0,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/recintos',
      description: 'Lugares de votación'
    },
    {
      title: 'Mesas Electorales',
      value: stats?.total_mesas || 0,
      icon: Table,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/mesas-electorales',
      description: 'Mesas habilitadas'
    },
    {
      title: 'Jurados',
      value: stats?.total_jurados || 0,
      icon: UserCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      href: '/jurados',
      description: 'Personal electoral'
    },
    {
      title: 'Elecciones',
      value: stats?.total_elecciones || 0,
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/elecciones',
      description: 'Eventos electorales'
    },
    {
      title: 'Candidaturas',
      value: stats?.total_candidaturas || 0,
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      href: '/candidaturas',
      description: 'Candidatos registrados'
    },
  ];

  const quickActions = [
    {
      title: 'Nueva Sección',
      description: 'Crear una nueva sección electoral',
      href: '/secciones',
      icon: MapPin,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Nuevo Cargo',
      description: 'Definir un cargo en disputa',
      href: '/cargos',
      icon: Trophy,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      title: 'Nuevo Recinto',
      description: 'Agregar un lugar de votación',
      href: '/recintos',
      icon: Building,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Ver Papeletas',
      description: 'Generar papeletas por sección',
      href: '/papeletas',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-secondary-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-secondary-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="mt-2 text-secondary-600">
            Resumen general del sistema de administración electoral
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/papeletas"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <FileText className="w-5 h-5 mr-2" />
            Ver Papeletas
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.href}
              className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-secondary-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {card.value}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-secondary-500">
                {card.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className={`p-4 rounded-lg text-white transition-colors duration-200 ${action.color}`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-white/80">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Estado del Sistema
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Sistema Operativo
                </p>
                <p className="text-sm text-secondary-600">
                  Todos los servicios funcionando correctamente
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Base de Datos Conectada
                </p>
                <p className="text-sm text-secondary-600">
                  Conexión estable con la base de datos
                </p>
              </div>
            </div>
            
            {stats && stats.total_elecciones > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    Elecciones Configuradas
                  </p>
                  <p className="text-sm text-secondary-600">
                    {stats.total_elecciones} elección(es) en el sistema
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 