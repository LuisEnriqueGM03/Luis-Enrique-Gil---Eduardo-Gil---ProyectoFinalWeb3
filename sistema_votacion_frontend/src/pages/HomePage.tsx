import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkApiConnection } from '../api';
import ConnectionStatusComponent from '../components/ConnectionStatus';
import { 
  UserGroupIcon, 
  UserIcon, 
  ChartPieIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    setServerStatus('checking');
    const isConnected = await checkApiConnection();
    setServerStatus(isConnected ? 'connected' : 'disconnected');
  };

  const interfaces = [
    {
      title: 'Jurado Electoral',
      description: 'Verificación de identidad y habilitación de papeletas',
      icon: ShieldCheckIcon,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      path: '/jurado',
      features: [
        'Verificación de CI del votante',
        'Validación de identidad visual',
        'Habilitación de papeletas',
        'Monitoreo en tiempo real'
      ]
    },
    {
      title: 'Interfaz de Votante',
      description: 'Recepción de papeletas y emisión de votos',
      icon: UserIcon,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200',
      path: '/votante',
      features: [
        'Recepción automática de papeletas',
        'Selección de candidatos',
        'Confirmación de voto',
        'Voto anónimo y seguro'
      ]
    },
    {
      title: 'Resultados Públicos',
      description: 'Visualización de resultados electorales en tiempo real',
      icon: ChartPieIcon,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      path: '/resultados',
      features: [
        'Gráficos de torta y barras',
        'Actualización automática',
        'Estadísticas detalladas',
        'Acceso público sin restricciones'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <UserGroupIcon className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sistema de Votación Electoral</h1>
                <p className="text-gray-600">Plataforma de votación en tiempo real</p>
              </div>
            </div>
            <ConnectionStatusComponent />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estado del Servidor */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Estado del Sistema</h2>
              <p className="text-gray-600">Verificación de conectividad con el servidor backend</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {serverStatus === 'checking' && (
                  <>
                    <div className="loading-spinner"></div>
                    <span className="text-sm font-medium text-gray-600">Verificando...</span>
                  </>
                )}
                {serverStatus === 'connected' && (
                  <>
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Servidor Conectado</span>
                  </>
                )}
                {serverStatus === 'disconnected' && (
                  <>
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                    <span className="text-sm font-medium text-red-600">Servidor Desconectado</span>
                  </>
                )}
              </div>
              <button
                onClick={checkServerConnection}
                className="btn-secondary text-sm"
                disabled={serverStatus === 'checking'}
              >
                Verificar
              </button>
            </div>
          </div>
        </div>

        {/* Interfaces */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Interfaces del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interfaces.map((interface_, index) => (
              <Link
                key={index}
                to={interface_.path}
                className={`block rounded-lg border-2 ${interface_.borderColor} ${interface_.bgColor} p-6 transition-all duration-200 hover:shadow-lg`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <interface_.icon className={`w-8 h-8 ${interface_.iconColor}`} />
                  <h3 className="text-xl font-semibold text-gray-800">{interface_.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{interface_.description}</p>
                <ul className="space-y-2">
                  {interface_.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>

        {/* Flujo de Trabajo */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Flujo de Trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Verificación</h3>
              <p className="text-gray-600">El jurado verifica la identidad del votante usando su CI</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Votación</h3>
              <p className="text-gray-600">El votante recibe su papeleta y emite su voto de forma anónima</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <ChartPieIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Resultados</h3>
              <p className="text-gray-600">Los resultados se actualizan automáticamente en tiempo real</p>
            </div>
          </div>
        </div>

        {/* Características del Sistema */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Características del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ComputerDesktopIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Tiempo Real</h3>
                  <p className="text-gray-600">Comunicación instantánea usando WebSockets</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Seguridad</h3>
                  <p className="text-gray-600">Votos anónimos sin datos personales</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <UserGroupIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Escalabilidad</h3>
                  <p className="text-gray-600">Sistema por salas de mesa electoral</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <GlobeAltIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Accesibilidad</h3>
                  <p className="text-gray-600">Interfaz web responsive y fácil de usar</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ChartPieIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Transparencia</h3>
                  <p className="text-gray-600">Resultados públicos y auditables</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Confiabilidad</h3>
                  <p className="text-gray-600">Sistema robusto con manejo de errores</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información Técnica */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Técnica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Frontend:</strong> React + TypeScript + CSS Personalizado</p>
              <p><strong>Backend:</strong> Node.js + Express + Socket.IO</p>
              <p><strong>Base de Datos:</strong> SQLite</p>
            </div>
            <div>
              <p><strong>Comunicación:</strong> WebSockets + REST API</p>
              <p><strong>Gráficos:</strong> Chart.js</p>
              <p><strong>Iconos:</strong> Heroicons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 