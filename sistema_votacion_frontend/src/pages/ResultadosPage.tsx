import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { socket, ResultadoData } from '../socket';
import { apiService, handleApiError } from '../api';
import ConnectionStatusComponent from '../components/ConnectionStatus';
import { 
  ChartPieIcon, 
  ChartBarIcon, 
  ArrowPathIcon,
  TrophyIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ResultadosPageProps {}

type TipoVisualizacion = 'pie' | 'bar';

const ResultadosPage: React.FC<ResultadosPageProps> = () => {
  const [resultados, setResultados] = useState<ResultadoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [tipoVisualizacion, setTipoVisualizacion] = useState<TipoVisualizacion>('pie');
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [totalVotos, setTotalVotos] = useState<number>(0);

  useEffect(() => {
    // Conectar socket al montar el componente
    socket.connect();
    
    // Cargar resultados iniciales
    cargarResultados();

    // Configurar auto-actualización
    const interval = setInterval(() => {
      if (autoUpdate) {
        cargarResultados();
      }
    }, 10000); // Actualizar cada 10 segundos

    // Listeners para eventos del socket
    const handleResultadosGlobales = (data: { resultados: ResultadoData[]; timestamp: string }) => {
      setResultados(data.resultados);
      setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
      calcularTotalVotos(data.resultados);
    };

    const handleResultadosActualizados = (data: { resultados: ResultadoData[]; timestamp: string }) => {
      setResultados(data.resultados);
      setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
      calcularTotalVotos(data.resultados);
    };

    // Registrar listeners
    socket.on('resultados_globales', handleResultadosGlobales);
    socket.on('resultados_actualizados', handleResultadosActualizados);

    // Cleanup
    return () => {
      clearInterval(interval);
      socket.off('resultados_globales', handleResultadosGlobales);
      socket.off('resultados_actualizados', handleResultadosActualizados);
    };
  }, [autoUpdate]);

  const cargarResultados = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.obtenerResultados();
      setResultados(response.resultados);
      setLastUpdate(new Date(response.timestamp).toLocaleTimeString());
      calcularTotalVotos(response.resultados);
      
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalVotos = (resultados: ResultadoData[]) => {
    const total = resultados.reduce((sum, candidato) => sum + candidato.votos, 0);
    setTotalVotos(total);
  };

  const agruparResultadosPorCargo = () => {
    const grupos: { [cargo: string]: ResultadoData[] } = {};
    resultados.forEach(candidato => {
      if (!grupos[candidato.cargo]) {
        grupos[candidato.cargo] = [];
      }
      grupos[candidato.cargo].push(candidato);
    });
    
    // Ordenar candidatos por votos (mayor a menor)
    Object.keys(grupos).forEach(cargo => {
      grupos[cargo].sort((a, b) => b.votos - a.votos);
    });
    
    return grupos;
  };

  const generarDatosGrafico = (candidatos: ResultadoData[]) => {
    const labels = candidatos.map(c => c.nombre);
    const data = candidatos.map(c => c.votos);
    const backgroundColor = candidatos.map(c => c.color);
    const borderColor = candidatos.map(c => c.color);

    return {
      labels,
      datasets: [
        {
          label: 'Votos',
          data,
          backgroundColor: backgroundColor.map(color => color + '80'), // Agregar transparencia
          borderColor,
          borderWidth: 2,
        },
      ],
    };
  };

  const opcionesGraficoPie = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const candidato = resultados[context.dataIndex];
            const porcentaje = totalVotos > 0 ? ((candidato.votos / totalVotos) * 100).toFixed(1) : 0;
            return `${candidato.nombre}: ${candidato.votos} votos (${porcentaje}%)`;
          },
        },
      },
    },
  };

  const opcionesGraficoBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const candidato = resultados[context.dataIndex];
            const porcentaje = totalVotos > 0 ? ((candidato.votos / totalVotos) * 100).toFixed(1) : 0;
            return `${candidato.nombre}: ${candidato.votos} votos (${porcentaje}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Votos',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Candidatos',
        },
      },
    },
  };

  const obtenerGanadorPorCargo = (candidatos: ResultadoData[]) => {
    return candidatos.reduce((prev, current) => (prev.votos > current.votos) ? prev : current);
  };

  const calcularPorcentaje = (votos: number) => {
    return totalVotos > 0 ? ((votos / totalVotos) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Resultados Electorales</h1>
              <p className="text-gray-600 mt-1">Resultados en tiempo real</p>
            </div>
            <ConnectionStatusComponent />
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Visualización:</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTipoVisualizacion('pie')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    tipoVisualizacion === 'pie' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <ChartPieIcon className="w-4 h-4" />
                  <span>Gráfico de Torta</span>
                </button>
                <button
                  onClick={() => setTipoVisualizacion('bar')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    tipoVisualizacion === 'bar' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Gráfico de Barras</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-actualizar</span>
              </label>
              
              <button
                onClick={cargarResultados}
                disabled={loading}
                className="flex items-center space-x-2 btn-secondary"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <UsersIcon className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Total de Votos</p>
                <p className="text-2xl font-bold text-gray-800">{totalVotos}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <TrophyIcon className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Candidatos</p>
                <p className="text-2xl font-bold text-gray-800">{resultados.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <ArrowPathIcon className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Última Actualización</p>
                <p className="text-lg font-bold text-gray-800">{lastUpdate || 'Nunca'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mostrar Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Resultados por Cargo */}
        {Object.entries(agruparResultadosPorCargo()).map(([cargo, candidatos]) => (
          <div key={cargo} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🏛️ {cargo}</h2>
              {candidatos.length > 0 && (
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Líder: {obtenerGanadorPorCargo(candidatos).nombre}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico */}
              <div className="chart-container">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {tipoVisualizacion === 'pie' ? 'Distribución de Votos' : 'Comparación de Votos'}
                </h3>
                <div className="relative h-80">
                  {candidatos.length > 0 ? (
                    tipoVisualizacion === 'pie' ? (
                      <Pie data={generarDatosGrafico(candidatos)} options={opcionesGraficoPie} />
                    ) : (
                      <Bar data={generarDatosGrafico(candidatos)} options={opcionesGraficoBar} />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No hay datos para mostrar
                    </div>
                  )}
                </div>
              </div>

              {/* Tabla de Resultados */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resultados Detallados</h3>
                <div className="space-y-4">
                  {candidatos.map((candidato, index) => (
                    <div key={candidato.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: candidato.color }}
                          >
                            {candidato.nombre.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{candidato.nombre}</p>
                          <p className="text-sm text-gray-600">{candidato.partido}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{candidato.votos}</p>
                        <p className="text-sm text-gray-600">{calcularPorcentaje(candidato.votos)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Mensaje si no hay resultados */}
        {resultados.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ChartPieIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin Resultados</h3>
            <p className="text-gray-600">No hay votos registrados aún. Los resultados aparecerán aquí en tiempo real.</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultadosPage; 