import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <nav className="w-full bg-white shadow flex items-center justify-between px-8 py-4">
        <div className="text-xl font-bold text-blue-700">Padrón Electoral</div>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Iniciar Sesión
        </Link>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center drop-shadow-lg">
          Consulta Pública del Padrón Electoral
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Ingresa tu número de cédula de identidad en la sección de consulta pública para verificar tu estado en el padrón electoral.
        </p>
        <Link
          to="/votantesver"
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow hover:bg-indigo-700 transition"
        >
          Ir a Consulta Pública
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
