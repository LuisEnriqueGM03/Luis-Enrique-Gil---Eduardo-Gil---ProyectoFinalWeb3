import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usuarioService } from '../services/usuarioService';
import { ActualizarUsuarioRequest } from '../models/Usuario';

const PerfilPage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData: ActualizarUsuarioRequest = {
        id: user.id,
        nombre: formData.nombre,
        email: formData.email,
      };

      const response = await usuarioService.actualizarUsuario(updateData);
      if (response.success) {
        setSuccess('Perfil actualizado exitosamente');
        setIsEditing(false);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      nombre: user?.nombre || '',
      email: user?.email || '',
    });
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No se pudo cargar la información del usuario</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg border border-blue-100 flex flex-col items-center">
        <div className="mb-6">
          <div className="w-28 h-28 rounded-full bg-blue-200 flex items-center justify-center text-5xl text-blue-700 font-extrabold shadow-lg">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2">{user?.nombre}</h2>
        <div className="w-full space-y-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <span className="mt-1 text-base font-semibold text-blue-800">{user?.email}</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col">
            <h3 className="text-sm font-medium text-gray-500">Rol</h3>
            <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 shadow">{user?.rol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage; 