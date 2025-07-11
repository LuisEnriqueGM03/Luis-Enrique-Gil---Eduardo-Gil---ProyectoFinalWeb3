import React from 'react';

const AccessDenied: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-white p-8 rounded shadow text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-gray-700">No tienes permisos para acceder a esta sección.</p>
    </div>
  </div>
);

export default AccessDenied; 