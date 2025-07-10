import React, { useState, useEffect } from 'react';
import { socket, VotanteData } from '../socket';
import { apiService, validateCI, formatCI, cleanCI, handleApiError } from '../api';
import ConnectionStatusComponent from '../components/ConnectionStatus';
import { UserIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface JuradoPageProps {}

enum EstadoJurado {
  INICIAL = 'inicial',
  VERIFICANDO = 'verificando',
  VOTANTE_VERIFICADO = 'votante_verificado',
  PAPELETA_HABILITADA = 'papeleta_habilitada',
  ESPERANDO_VOTO = 'esperando_voto',
  ERROR = 'error'
}

const JuradoPage: React.FC<JuradoPageProps> = () => {
  const [ci, setCi] = useState<string>('');
  const [mesaId, setMesaId] = useState<string>('1');
  const [votante, setVotante] = useState<VotanteData | null>(null);
  const [estado, setEstado] = useState<EstadoJurado>(EstadoJurado.INICIAL);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');

  useEffect(() => {
    // Conectar socket al montar el componente
    socket.connect();
    
    // Unirse a la sala de la mesa
    socket.emit('unirse_mesa', mesaId);

    // Listeners para eventos del socket
    const handlePapeletaCerrada = (data: { mensaje: string; timestamp: string }) => {
      setMensaje(`✅ ${data.mensaje}`);
      setEstado(EstadoJurado.INICIAL);
      setVotante(null);
      setCi('');
    };

    const handleVotoExitoso = (data: { mensaje: string; voto_id: string; timestamp: string }) => {
      setMensaje(`✅ Voto registrado correctamente (ID: ${data.voto_id})`);
      setEstado(EstadoJurado.INICIAL);
      setVotante(null);
      setCi('');
    };

    const handleErrorVoto = (data: { error: string }) => {
      setError(`❌ Error en votación: ${data.error}`);
      setEstado(EstadoJurado.ERROR);
    };

    // Registrar listeners
    socket.on('papeleta_cerrada', handlePapeletaCerrada);
    socket.on('voto_exitoso', handleVotoExitoso);
    socket.on('error_voto', handleErrorVoto);

    // Cleanup
    return () => {
      socket.off('papeleta_cerrada', handlePapeletaCerrada);
      socket.off('voto_exitoso', handleVotoExitoso);
      socket.off('error_voto', handleErrorVoto);
    };
  }, [mesaId]);

  const handleVerificarVotante = async () => {
    if (!ci || !validateCI(ci)) {
      setError('Por favor ingresa un CI válido (8 dígitos)');
      return;
    }

    setLoading(true);
    setError('');
    setMensaje('');
    setEstado(EstadoJurado.VERIFICANDO);

    try {
      // Simular consulta de votante
      const cleanedCi = cleanCI(ci);
      const votanteData = apiService.simularConsultaVotante(cleanedCi);

      if (!votanteData) {
        setError('Votante no encontrado. Verifica el número de CI.');
        setEstado(EstadoJurado.ERROR);
        return;
      }

      setVotante(votanteData);
      setEstado(EstadoJurado.VOTANTE_VERIFICADO);
      setMensaje('Votante encontrado. Verifica la identidad con el documento.');

    } catch (err) {
      setError(handleApiError(err));
      setEstado(EstadoJurado.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleHabilitarPapeleta = async () => {
    if (!votante || !mesaId) {
      setError('Datos insuficientes para habilitar papeleta');
      return;
    }

    setLoading(true);
    setError('');
    setMensaje('');

    try {
      // Habilitar papeleta a través de la API
      const response = await apiService.habilitarPapeleta({
        ci: votante.ci,
        mesa_id: mesaId
      });

      if (response.success) {
        setEstado(EstadoJurado.PAPELETA_HABILITADA);
        setMensaje('✅ Papeleta habilitada correctamente');
        
        // Cambiar a estado de espera después de 2 segundos
        setTimeout(() => {
          setEstado(EstadoJurado.ESPERANDO_VOTO);
          setMensaje('⏳ Esperando que el votante emita su voto...');
        }, 2000);
      }

    } catch (err) {
      setError(handleApiError(err));
      setEstado(EstadoJurado.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleReiniciar = () => {
    setEstado(EstadoJurado.INICIAL);
    setVotante(null);
    setCi('');
    setError('');
    setMensaje('');
  };

  const handleCiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setCi(value);
    }
  };

  const getEstadoColor = () => {
    switch (estado) {
      case EstadoJurado.VOTANTE_VERIFICADO:
        return 'bg-blue-50 border-blue-200';
      case EstadoJurado.PAPELETA_HABILITADA:
        return 'bg-green-50 border-green-200';
      case EstadoJurado.ESPERANDO_VOTO:
        return 'bg-yellow-50 border-yellow-200';
      case EstadoJurado.ERROR:
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getEstadoIcon = () => {
    switch (estado) {
      case EstadoJurado.VOTANTE_VERIFICADO:
        return <CheckCircleIcon className="w-8 h-8 text-blue-500" />;
      case EstadoJurado.PAPELETA_HABILITADA:
        return <CheckCircleIcon className="w-8 h-8 text-green-500" />;
      case EstadoJurado.ESPERANDO_VOTO:
        return <ClockIcon className="w-8 h-8 text-yellow-500" />;
      case EstadoJurado.ERROR:
        return <XCircleIcon className="w-8 h-8 text-red-500" />;
      default:
        return <UserIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel de Jurado Electoral</h1>
              <p className="text-gray-600 mt-1">Verificación de identidad y habilitación de papeletas</p>
            </div>
            <ConnectionStatusComponent />
          </div>
        </div>

        {/* Configuración de Mesa */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Configuración de Mesa</h2>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Mesa Electoral:</label>
            <select
              value={mesaId}
              onChange={(e) => setMesaId(e.target.value)}
              className="input-field"
              disabled={estado !== EstadoJurado.INICIAL}
            >
              <option value="1">Mesa 1</option>
              <option value="2">Mesa 2</option>
              <option value="3">Mesa 3</option>
              <option value="4">Mesa 4</option>
            </select>
          </div>
        </div>

        {/* Formulario de Verificación */}
        <div className={`rounded-lg shadow-md p-6 mb-6 border-2 ${getEstadoColor()}`}>
          <div className="flex items-center space-x-4 mb-6">
            {getEstadoIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Verificación de Votante</h2>
              <p className="text-gray-600">Ingresa el CI del votante para verificar su identidad</p>
            </div>
          </div>

          {estado === EstadoJurado.INICIAL && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={ci}
                    onChange={handleCiChange}
                    placeholder="12345678"
                    className="input-field flex-1"
                    maxLength={8}
                  />
                  <button
                    onClick={handleVerificarVotante}
                    disabled={loading || !ci || !validateCI(ci)}
                    className="btn-primary px-8"
                  >
                    {loading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      'Verificar'
                    )}
                  </button>
                </div>
                {ci && (
                  <p className="text-sm text-gray-500 mt-1">
                    Formato: {formatCI(ci)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Información del Votante */}
          {votante && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Información del Votante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">CI:</label>
                  <p className="text-lg font-mono">{formatCI(votante.ci)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre Completo:</label>
                  <p className="text-lg">{votante.nombre} {votante.apellido}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Edad:</label>
                  <p className="text-lg">{votante.edad} años</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección:</label>
                  <p className="text-lg">{votante.direccion}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Importante:</strong> Verifica que los datos mostrados coincidan con el documento de identidad del votante antes de habilitar la papeleta.
                </p>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          {estado === EstadoJurado.VOTANTE_VERIFICADO && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleReiniciar}
                className="btn-secondary px-6"
              >
                Cancelar
              </button>
              <button
                onClick={handleHabilitarPapeleta}
                disabled={loading}
                className="btn-success px-8"
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  '✅ Habilitar Papeleta'
                )}
              </button>
            </div>
          )}

          {(estado === EstadoJurado.PAPELETA_HABILITADA || estado === EstadoJurado.ESPERANDO_VOTO) && (
            <div className="flex justify-center">
              <button
                onClick={handleReiniciar}
                className="btn-secondary px-6"
              >
                Nuevo Votante
              </button>
            </div>
          )}

          {estado === EstadoJurado.ERROR && (
            <div className="flex justify-center">
              <button
                onClick={handleReiniciar}
                className="btn-primary px-6"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>

        {/* Mensajes de Estado */}
        {mensaje && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">{mensaje}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Información del Sistema */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ℹ️ Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Mesa Activa:</strong> Mesa {mesaId}</p>
              <p><strong>Estado:</strong> {estado}</p>
            </div>
            <div>
              <p><strong>CIs de Prueba:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>12345678 - Juan Pérez García</li>
                <li>87654321 - María López Rodríguez</li>
                <li>11223344 - Carlos Mendoza Silva</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuradoPage; 