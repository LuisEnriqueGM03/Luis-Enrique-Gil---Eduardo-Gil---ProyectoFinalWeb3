import React, { useState, useEffect } from 'react';
import { Usuario } from '../models/Usuario';
import { usuarioService } from '../services/usuarioService';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosResponse] = await Promise.all([
        usuarioService.obtenerUsuarios(),
      ]);
      if (Array.isArray(usuariosResponse)) {
        setUsuarios(usuariosResponse);
      } else if (usuariosResponse.success) {
        setUsuarios(usuariosResponse.usuarios);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: Usuario) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        email: user.email,
        password: '',
        rol: user.rol,
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: '',
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingUser) {
        const updateData = {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol,
        };
        const response = await usuarioService.actualizarUsuario({ id: editingUser.id, ...updateData });
        if (response.success) {
          setSuccess('Usuario actualizado exitosamente');
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || 'Error al actualizar usuario');
        }
      } else {
        const createData = {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          rol: formData.rol,
        };
        const response = await usuarioService.crearUsuario(createData);
        if (response.success) {
          setSuccess('Usuario creado exitosamente');
          await loadData();
          handleCloseModal();
        } else {
          setError(response.message || 'Error al crear usuario');
        }
      }
    } catch (error) {
      setError('Error al procesar la solicitud');
    }
  };

  const handleDelete = async (usuario: Usuario) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${usuario.nombre}?`)) {
      try {
        const response = await usuarioService.eliminarUsuario(usuario.id);
        if (response === undefined || response === null || response.success) {
          setSuccess('Usuario eliminado exitosamente');
          await loadData();
        } else {
          setError(response.message || 'Error al eliminar usuario');
        }
      } catch (error) {
        setError('Error al eliminar el usuario');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center bg-white shadow-md rounded-xl px-8 py-6 mb-4">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Gestión de Usuarios</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150"
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center text-red-800 font-medium shadow">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center text-green-800 font-medium shadow">
          {success}
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Nombre</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Rol</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="transition hover:bg-blue-50/70">
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800 font-semibold">{usuario.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shadow">{usuario.rol}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                  <button
                    onClick={() => handleOpenModal(usuario)}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-medium shadow border border-blue-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" /></svg>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario)}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm font-medium shadow border border-red-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Rol</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="SuperAdministrador">SuperAdministrador</option>
                  <option value="adminElecciones">adminElecciones</option>
                  <option value="juradoElecciones">juradoElecciones</option>
                  <option value="adminPadron">adminPadron</option>
                </select>
              </div>
              {error && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-2 text-center text-red-800 font-medium shadow">
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150"
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-150">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage; 