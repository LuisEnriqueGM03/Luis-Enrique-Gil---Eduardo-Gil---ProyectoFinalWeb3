// Router principal del sistema de votación

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../models/constants';

// Importar páginas
import HomePage from '../pages/HomePage';
import JuradoPage from '../pages/JuradoPage';
import VotantePage from '../pages/VotantePage';
import ResultadosPage from '../pages/ResultadosPage';

// Componente de navegación
import Navigation from './Navigation';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.JURADO} element={<JuradoPage />} />
            <Route path={ROUTES.VOTANTE} element={<VotantePage />} />
            <Route path={ROUTES.RESULTADOS} element={<ResultadosPage />} />
            {/* Ruta por defecto */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRouter; 