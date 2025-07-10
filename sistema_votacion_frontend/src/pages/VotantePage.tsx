import React, { useState, useEffect } from 'react';
import { socket, VotanteData, CandidatoData } from '../socket';
import ConnectionStatusComponent from '../components/ConnectionStatus';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface VotantePageProps {}

enum EstadoVotante {
  ESPERANDO_HABILITACION = 'esperando_habilitacion',
  PAPELETA_HABILITADA = 'papeleta_habilitada',
  CANDIDATOS_SELECCIONADOS = 'candidatos_seleccionados',
  CONFIRMANDO_VOTO = 'confirmando_voto',
  VOTO_EMITIDO = 'voto_emitido',
  ERROR = 'error'
}

const VotantePage: React.FC<VotantePageProps> = () => {
  const [mesaId, setMesaId] = useState<string>('1');
  const [estado, setEstado] = useState<EstadoVotante>(EstadoVotante.ESPERANDO_HABILITACION);
  const [votante, setVotante] = useState<VotanteData | null>(null);
  const [candidatos, setCandidatos] = useState<CandidatoData[]>([]);
  const [candidatosSeleccionados, setCandidatosSeleccionados] = useState<{[cargo: string]: CandidatoData}>({});
  const [mensaje, setMensaje] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmacion, setShowConfirmacion] = useState<boolean>(false);

  useEffect(() => {
    // Conectar socket al montar el componente
    socket.connect();
    
    // Unirse a la sala de la mesa
    socket.emit('unirse_mesa', mesaId);

    // Listeners para eventos del socket
    const handleHabilitarPapeleta = (data: {
      votante: VotanteData;
      candidatos: CandidatoData[];
      timestamp: string;
    }) => {
      setVotante(data.votante);
      setCandidatos(data.candidatos);
      setEstado(EstadoVotante.PAPELETA_HABILITADA);
      setMensaje('✅ Papeleta habilitada. Selecciona un candidato para cada cargo.');
      setError('');
      setCandidatosSeleccionados({});
    };

    const handleVotoExitoso = (data: { mensaje: string; voto_id: string; timestamp: string }) => {
      setEstado(EstadoVotante.VOTO_EMITIDO);
      setMensaje(`✅ ${data.mensaje}`);
      setError('');
      setShowConfirmacion(false);
    };

    const handlePapeletaCerrada = (data: { mensaje: string; timestamp: string }) => {
      setEstado(EstadoVotante.VOTO_EMITIDO);
      setMensaje(`✅ ${data.mensaje}`);
      setError('');
      setShowConfirmacion(false);
    };

    const handleErrorVoto = (data: { error: string }) => {
      setError(`❌ Error: ${data.error}`);
      setEstado(EstadoVotante.ERROR);
      setLoading(false);
      setShowConfirmacion(false);
    };

    // Registrar listeners
    socket.on('habilitar_papeleta', handleHabilitarPapeleta);
    socket.on('voto_exitoso', handleVotoExitoso);
    socket.on('papeleta_cerrada', handlePapeletaCerrada);
    socket.on('error_voto', handleErrorVoto);

    // Cleanup
    return () => {
      socket.off('habilitar_papeleta', handleHabilitarPapeleta);
      socket.off('voto_exitoso', handleVotoExitoso);
      socket.off('papeleta_cerrada', handlePapeletaCerrada);
      socket.off('error_voto', handleErrorVoto);
    };
  }, [mesaId]);

  const handleSeleccionarCandidato = (candidato: CandidatoData) => {
    const nuevosSeleccionados = {
      ...candidatosSeleccionados,
      [candidato.cargo]: candidato
    };
    setCandidatosSeleccionados(nuevosSeleccionados);
    
    // Verificar si se han seleccionado candidatos para todos los cargos
    const cargosDisponibles = Array.from(new Set(candidatos.map(c => c.cargo)));
    const cargosSeleccionados = Object.keys(nuevosSeleccionados);
    
    if (cargosSeleccionados.length === cargosDisponibles.length) {
      setEstado(EstadoVotante.CANDIDATOS_SELECCIONADOS);
      setMensaje('✅ Candidatos seleccionados para todos los cargos. Puedes confirmar tu voto.');
    } else {
      setMensaje(`Selecciona candidatos para ${cargosDisponibles.length - cargosSeleccionados.length} cargo(s) más.`);
    }
  };

  const handleConfirmarVoto = () => {
    const cargosDisponibles = Array.from(new Set(candidatos.map(c => c.cargo)));
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);
    
    if (cargosSeleccionados.length !== cargosDisponibles.length) {
      setError('Por favor selecciona un candidato para cada cargo');
      return;
    }

    setShowConfirmacion(true);
  };

  const handleEmitirVoto = () => {
    const cargosDisponibles = Array.from(new Set(candidatos.map(c => c.cargo)));
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);
    
    if (cargosSeleccionados.length !== cargosDisponibles.length) {
      setError('Por favor selecciona un candidato para cada cargo');
      return;
    }

    setLoading(true);
    setError('');
    setEstado(EstadoVotante.CONFIRMANDO_VOTO);
    setMensaje('Emitiendo votos...');

    // Emitir un voto por cada candidato seleccionado
    const votosAEmitir = Object.values(candidatosSeleccionados).map(candidato => ({
      candidato_id: candidato.id,
      mesa_id: mesaId
    }));

    // Emitir todos los votos
    votosAEmitir.forEach(voto => {
      socket.emit('emitir_voto', voto);
    });

    setShowConfirmacion(false);
  };

  const handleCancelarVoto = () => {
    setShowConfirmacion(false);
    // No reseteamos las selecciones, solo cancelamos la confirmación
  };

  const handleCambiarSeleccion = () => {
    setCandidatosSeleccionados({});
    setEstado(EstadoVotante.PAPELETA_HABILITADA);
    setMensaje('✅ Papeleta habilitada. Selecciona un candidato para cada cargo.');
    setError('');
  };

  const handleReiniciar = () => {
    setEstado(EstadoVotante.ESPERANDO_HABILITACION);
    setVotante(null);
    setCandidatos([]);
    setCandidatosSeleccionados({});
    setMensaje('');
    setError('');
    setShowConfirmacion(false);
    setLoading(false);
  };

  const getEstadoColor = () => {
    switch (estado) {
      case EstadoVotante.PAPELETA_HABILITADA:
        return 'bg-blue-50 border-blue-200';
      case EstadoVotante.CANDIDATOS_SELECCIONADOS:
        return 'bg-green-50 border-green-200';
      case EstadoVotante.VOTO_EMITIDO:
        return 'bg-green-50 border-green-200';
      case EstadoVotante.ERROR:
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getEstadoIcon = () => {
    switch (estado) {
      case EstadoVotante.PAPELETA_HABILITADA:
        return <UserIcon className="w-8 h-8 text-blue-500" />;
      case EstadoVotante.CANDIDATOS_SELECCIONADOS:
        return <CheckCircleIcon className="w-8 h-8 text-green-500" />;
      case EstadoVotante.VOTO_EMITIDO:
        return <LockClosedIcon className="w-8 h-8 text-green-500" />;
      case EstadoVotante.ERROR:
        return <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />;
      default:
        return <ClockIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  const agruparCandidatosPorCargo = () => {
    const grupos: { [cargo: string]: CandidatoData[] } = {};
    candidatos.forEach(candidato => {
      if (!grupos[candidato.cargo]) {
        grupos[candidato.cargo] = [];
      }
      grupos[candidato.cargo].push(candidato);
    });
    return grupos;
  };

  const getProgresoSeleccion = () => {
    const cargosDisponibles = Array.from(new Set(candidatos.map(c => c.cargo)));
    const cargosSeleccionados = Object.keys(candidatosSeleccionados);
    return {
      seleccionados: cargosSeleccionados.length,
      total: cargosDisponibles.length
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sistema de Votación</h1>
              <p className="text-gray-600 mt-1">Interfaz para votantes</p>
            </div>
            <ConnectionStatusComponent />
          </div>
        </div>

        {/* Configuración de Mesa */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mesa Electoral</h2>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Mesa:</label>
            <select
              value={mesaId}
              onChange={(e) => setMesaId(e.target.value)}
              className="input-field"
              disabled={estado !== EstadoVotante.ESPERANDO_HABILITACION}
            >
              <option value="1">Mesa 1</option>
              <option value="2">Mesa 2</option>
              <option value="3">Mesa 3</option>
              <option value="4">Mesa 4</option>
            </select>
          </div>
        </div>

        {/* Progreso de Selección */}
        {(estado === EstadoVotante.PAPELETA_HABILITADA || estado === EstadoVotante.CANDIDATOS_SELECCIONADOS) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progreso de Votación</h3>
              <div className="text-sm text-gray-600">
                {getProgresoSeleccion().seleccionados} de {getProgresoSeleccion().total} cargos seleccionados
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getProgresoSeleccion().seleccionados / getProgresoSeleccion().total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Estado del Sistema */}
        <div className={`rounded-lg shadow-md p-6 mb-6 border-2 ${getEstadoColor()}`}>
          <div className="flex items-center space-x-4 mb-6">
            {getEstadoIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {estado === EstadoVotante.ESPERANDO_HABILITACION && 'Esperando Habilitación'}
                {estado === EstadoVotante.PAPELETA_HABILITADA && 'Papeleta Habilitada'}
                {estado === EstadoVotante.CANDIDATOS_SELECCIONADOS && 'Candidatos Seleccionados'}
                {estado === EstadoVotante.CONFIRMANDO_VOTO && 'Confirmando Voto'}
                {estado === EstadoVotante.VOTO_EMITIDO && 'Voto Emitido'}
                {estado === EstadoVotante.ERROR && 'Error'}
              </h2>
              <p className="text-gray-600">
                {estado === EstadoVotante.ESPERANDO_HABILITACION && 'Esperando que el jurado habilite tu papeleta...'}
                {estado === EstadoVotante.PAPELETA_HABILITADA && 'Selecciona un candidato para cada cargo'}
                {estado === EstadoVotante.CANDIDATOS_SELECCIONADOS && 'Confirma tu voto para continuar'}
                {estado === EstadoVotante.CONFIRMANDO_VOTO && 'Procesando tus votos...'}
                {estado === EstadoVotante.VOTO_EMITIDO && 'Gracias por votar. Tu papeleta ha sido cerrada.'}
                {estado === EstadoVotante.ERROR && 'Ha ocurrido un error. Contacta al jurado.'}
              </p>
            </div>
          </div>

          {/* Información del Votante */}
          {votante && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                👤 Votante Verificado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                  <p className="text-lg">{votante.nombre} {votante.apellido}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mesa:</label>
                  <p className="text-lg">Mesa {mesaId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Candidatos */}
          {(estado === EstadoVotante.PAPELETA_HABILITADA || estado === EstadoVotante.CANDIDATOS_SELECCIONADOS) && (
            <div className="space-y-6">
              {Object.entries(agruparCandidatosPorCargo()).map(([cargo, candidatosCargo]) => (
                <div key={cargo} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      🏛️ {cargo}
                    </h3>
                    {candidatosSeleccionados[cargo] && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Seleccionado</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidatosCargo.map((candidato) => (
                      <div
                        key={candidato.id}
                        className={`voting-card cursor-pointer ${
                          candidatosSeleccionados[cargo]?.id === candidato.id ? 'selected' : ''
                        }`}
                        onClick={() => handleSeleccionarCandidato(candidato)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: candidato.color }}
                          >
                            {candidato.nombre.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{candidato.nombre}</h4>
                            <p className="text-sm text-gray-600">{candidato.partido}</p>
                          </div>
                          {candidatosSeleccionados[cargo]?.id === candidato.id && (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resumen de Selecciones */}
          {Object.keys(candidatosSeleccionados).length > 0 && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📝 Resumen de tu Voto
              </h3>
              <div className="space-y-3">
                {Object.entries(candidatosSeleccionados).map(([cargo, candidato]) => (
                  <div key={cargo} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{cargo}:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: candidato.color }}
                      >
                        {candidato.nombre.charAt(0)}
                      </div>
                      <span className="text-gray-800">{candidato.nombre} ({candidato.partido})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          {estado === EstadoVotante.CANDIDATOS_SELECCIONADOS && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleCambiarSeleccion}
                className="btn-secondary px-8"
              >
                Cambiar Selecciones
              </button>
              <button
                onClick={handleConfirmarVoto}
                className="btn-success px-8"
              >
                ✅ Confirmar Votos
              </button>
            </div>
          )}

          {estado === EstadoVotante.VOTO_EMITIDO && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleReiniciar}
                className="btn-secondary px-8"
              >
                Nueva Sesión
              </button>
            </div>
          )}

          {estado === EstadoVotante.ERROR && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleReiniciar}
                className="btn-primary px-8"
              >
                Reiniciar
              </button>
            </div>
          )}
        </div>

        {/* Modal de Confirmación */}
        {showConfirmacion && Object.keys(candidatosSeleccionados).length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ Confirmación de Votos
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres emitir estos votos?
              </p>
              
              <div className="space-y-4 mb-6">
                {Object.entries(candidatosSeleccionados).map(([cargo, candidato]) => (
                  <div key={cargo} className="voting-card">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: candidato.color }}
                      >
                        {candidato.nombre.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{candidato.nombre}</h4>
                        <p className="text-sm text-gray-600">{candidato.partido}</p>
                        <p className="text-xs text-gray-500">{candidato.cargo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>¡Atención!</strong> Una vez confirmados, no podrás cambiar tus votos.
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmacion(false)}
                  className="btn-secondary px-6"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEmitirVoto}
                  className="btn-danger px-6"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    'Confirmar Votos'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
            ℹ️ Información
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Mesa:</strong> Mesa {mesaId}</p>
              <p><strong>Estado:</strong> {estado}</p>
              <p><strong>Seleccionados:</strong> {Object.keys(candidatosSeleccionados).length} cargos</p>
            </div>
            <div>
              <p><strong>Instrucciones:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Espera a que el jurado habilite tu papeleta</li>
                <li>Selecciona un candidato para cada cargo</li>
                <li>Revisa tu selección en el resumen</li>
                <li>Confirma todos tus votos</li>
                <li>El voto es secreto y seguro</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotantePage; 