import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import Dashboard from './pages/Dashboard';
import SeccionesPage from './pages/Secciones';
import CargosPage from './pages/Cargos';
import RecintosPage from './pages/Recintos';
import MesasElectoralesPage from './pages/MesasElectorales';
import JuradosPage from './pages/Jurados';
import EleccionesPage from './pages/Elecciones';
import CandidaturasPage from './pages/Candidaturas';
import PapeletasPage from './pages/Papeletas';
import LoginPage from './pages/Login';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/secciones" element={<SeccionesPage />} />
                      <Route path="/cargos" element={<CargosPage />} />
                      <Route path="/recintos" element={<RecintosPage />} />
                      <Route path="/mesas-electorales" element={<MesasElectoralesPage />} />
                      <Route path="/jurados" element={<JuradosPage />} />
                      <Route path="/elecciones" element={<EleccionesPage />} />
                      <Route path="/candidaturas" element={<CandidaturasPage />} />
                      <Route path="/papeletas" element={<PapeletasPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
