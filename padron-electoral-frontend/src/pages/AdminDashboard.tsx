import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/common/Navbar";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <h2 className="text-3xl font-bold text-gray-900 mb-8 mt-24">Dashboard del Administrador</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestión de Votantes</h3>
          <p className="text-gray-600 mb-4">Registrar y administrar votantes</p>
          <Link
            to="/votantes"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Registrar nuevo votante →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Lista de Votantes</h3>
          <p className="text-gray-600 mb-4">Ver y gestionar registros</p>
          <Link
            to="/listavotantes"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Ver lista completa →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 