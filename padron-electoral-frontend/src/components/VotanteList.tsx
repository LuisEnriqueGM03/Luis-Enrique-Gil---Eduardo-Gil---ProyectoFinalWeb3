import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Votante } from '../types';

const VotanteList: React.FC = () => {
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [filteredVotantes, setFilteredVotantes] = useState<Votante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVotantes();
  }, []);

  useEffect(() => {
    // Filtrar votantes por término de búsqueda
    const filtered = votantes.filter(
      (votante) =>
        votante.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        votante.ci.includes(searchTerm) ||
        votante.recinto_nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVotantes(filtered);
  }, [votantes, searchTerm]);

  const loadVotantes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVotantes();
      setVotantes(data);
    } catch (err) {
      setError('Error al cargar la lista de votantes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este votante?')) {
      try {
        await apiService.deleteVotante(id);
        setVotantes(votantes.filter(v => v.id !== id));
      } catch (err) {
        setError('Error al eliminar el votante');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Lista de Votantes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista completa de votantes registrados en el padrón electoral.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/votantes/nuevo"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Registrar Votante
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className="mt-6">
        <div className="max-w-lg">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Buscar votantes
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Buscar por nombre, CI o recinto..."
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CI
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recinto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVotantes.map((votante) => (
                    <tr key={votante.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {votante.ci}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {votante.nombre_completo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {votante.direccion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {votante.recinto_nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {votante.fecha_registro ? new Date(votante.fecha_registro).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/votantes/editar/${votante.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => votante.id && handleDelete(votante.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredVotantes.length === 0 && !loading && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay votantes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'No se encontraron votantes con ese criterio de búsqueda.' : 'Comienza registrando el primer votante.'}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/admin/votantes/nuevo"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Registrar Primer Votante
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotanteList; 