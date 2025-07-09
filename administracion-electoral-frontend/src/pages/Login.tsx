import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { state, login } = useAuth();

  // Redirect if already authenticated
  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(formData.username, formData.password);
      
      if (success) {
        toast.success('¡Bienvenido al sistema!');
      } else {
        toast.error('Credenciales incorrectas. Intenta de nuevo.');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            Administración Electoral
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Inicia sesión para acceder al panel de administración
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ingresa tu nombre de usuario"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-10"
                  placeholder="Ingresa tu contraseña"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials info */}
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <h3 className="text-sm font-medium text-secondary-900 mb-2">
              Credenciales de prueba:
            </h3>
            <div className="text-sm text-secondary-600 space-y-1">
              <p><strong>Usuario:</strong> admin</p>
              <p><strong>Contraseña:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-secondary-500">
            Sistema de Administración Electoral v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 