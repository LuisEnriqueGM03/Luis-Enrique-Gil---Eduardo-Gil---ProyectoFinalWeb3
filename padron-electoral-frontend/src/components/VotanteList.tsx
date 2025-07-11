import React from 'react';
import { Link } from 'react-router-dom';
import { useVotantes, useSearch } from '../hooks';
import { VotanteSearch, VotanteTable, VotanteEmptyState } from './votantes';
import LoadingSpinner from './ui/LoadingSpinner';
import { MESSAGES } from '../constants/messages';

const VotanteList: React.FC = () => {
  const { votantes, loading, error, deleteVotante } = useVotantes();
  const { searchTerm, setSearchTerm, filteredData, totalResults } = useSearch(votantes);

  const handleDelete = async (id: number) => {
    try {
      await deleteVotante(id);
    } catch (err) {
      console.error('Error al eliminar votante:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" className="py-12" />;
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

      <VotanteSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalResults={totalResults}
      />

      {filteredData.length === 0 ? (
        <VotanteEmptyState hasSearchTerm={!!searchTerm} />
      ) : (
        <VotanteTable
          votantes={filteredData}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default VotanteList; 