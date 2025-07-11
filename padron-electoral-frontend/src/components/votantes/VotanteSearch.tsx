import React from 'react';
import { MESSAGES } from '../../constants/messages';

interface VotanteSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalResults: number;
}

const VotanteSearch: React.FC<VotanteSearchProps> = ({
  searchTerm,
  onSearchChange,
  totalResults
}) => {
  return (
    <div className="mt-6">
      <div className="max-w-lg">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Buscar votantes
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
            placeholder={MESSAGES.PLACEHOLDER.SEARCH}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default VotanteSearch; 