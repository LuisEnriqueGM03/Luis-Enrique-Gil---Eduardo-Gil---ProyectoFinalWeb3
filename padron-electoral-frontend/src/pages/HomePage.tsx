import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-8">
            Sistema de Padrón Electoral
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Consulta tu estado en el padrón electoral o accede como administrador 
            para gestionar el registro de votantes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
          {/* Consulta Pública */}
          <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Consulta Pública
              </h3>
              <p className="text-gray-600 mb-6">
                Verifica tu estado en el padrón electoral ingresando tu número de CI
              </p>
              <Link
                to="/consulta"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Consultar Padrón
              </Link>
            </div>
          </div>

          {/* Acceso Administrador */}
          <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Panel Administrativo
              </h3>
              <p className="text-gray-600 mb-6">
                Acceso para administradores del padrón electoral
              </p>
              <Link
                to="/admin/login"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 