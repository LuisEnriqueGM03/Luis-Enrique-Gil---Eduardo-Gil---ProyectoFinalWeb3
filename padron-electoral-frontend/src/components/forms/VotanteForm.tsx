import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Recinto, Votante } from '../../types';

const VotanteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    ci: '',
    nombre_completo: '',
    direccion: '',
    recinto: '',
  });

  const [files, setFiles] = useState({
    foto_carnet_anverso: null as File | null,
    foto_carnet_reverso: null as File | null,
    foto_votante: null as File | null,
  });

  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadRecintos();
    if (isEditing) {
      loadVotante();
    }
  }, [isEditing, id]);

  const loadRecintos = async () => {
    try {
      const data = await apiService.getRecintos();
      setRecintos(data);
    } catch (err) {
      setError('Error al cargar recintos');
    }
  };

  const loadVotante = async () => {
    if (!id) return;
    try {
      // Aquí necesitarías implementar getVotante en tu API service
      // const votante = await apiService.getVotante(parseInt(id));
      // setFormData({
      //   ci: votante.ci,
      //   nombre_completo: votante.nombre_completo,
      //   direccion: votante.direccion,
      //   recinto: votante.recinto.toString(),
      // });
    } catch (err) {
      setError('Error al cargar datos del votante');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof files) => {
    const file = e.target.files?.[0] || null;
    setFiles({
      ...files,
      [fieldName]: file,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('ci', formData.ci);
      formDataToSend.append('nombre_completo', formData.nombre_completo);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('recinto', formData.recinto);

      if (files.foto_carnet_anverso) {
        formDataToSend.append('foto_carnet_anverso', files.foto_carnet_anverso);
      }
      if (files.foto_carnet_reverso) {
        formDataToSend.append('foto_carnet_reverso', files.foto_carnet_reverso);
      }
      if (files.foto_votante) {
        formDataToSend.append('foto_votante', files.foto_votante);
      }

      if (isEditing && id) {
        await apiService.updateVotante(parseInt(id), formDataToSend);
        setSuccess('Votante actualizado exitosamente');
      } else {
        await apiService.createVotante(formDataToSend);
        setSuccess('Votante registrado exitosamente');
        // Limpiar formulario
        setFormData({
          ci: '',
          nombre_completo: '',
          direccion: '',
          recinto: '',
        });
        setFiles({
          foto_carnet_anverso: null,
          foto_carnet_reverso: null,
          foto_votante: null,
        });
      }
    } catch (err: any) {
      if (err.response?.data?.ci) {
        setError('Ya existe un votante con este número de CI');
      } else {
        setError('Error al guardar el votante. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Editar Votante' : 'Registrar Nuevo Votante'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CI */}
            <div>
              <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-2">
                Cédula de Identidad *
              </label>
              <input
                type="text"
                id="ci"
                name="ci"
                value={formData.ci}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 12345678"
              />
            </div>

            {/* Nombre Completo */}
            <div>
              <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan Pérez García"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
              Dirección *
            </label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dirección completa del votante"
            />
          </div>

          {/* Recinto */}
          <div>
            <label htmlFor="recinto" className="block text-sm font-medium text-gray-700 mb-2">
              Recinto Electoral *
            </label>
            <select
              id="recinto"
              name="recinto"
              value={formData.recinto}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un recinto</option>
              {recintos.map((recinto) => (
                <option key={recinto.id} value={recinto.id}>
                  {recinto.nombre} - {recinto.ubicacion}
                </option>
              ))}
            </select>
          </div>

          {/* Fotos */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Fotografías</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Foto Carnet Anverso */}
              <div>
                <label htmlFor="foto_carnet_anverso" className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Carnet (Anverso) *
                </label>
                <input
                  type="file"
                  id="foto_carnet_anverso"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'foto_carnet_anverso')}
                  required={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Foto Carnet Reverso */}
              <div>
                <label htmlFor="foto_carnet_reverso" className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Carnet (Reverso) *
                </label>
                <input
                  type="file"
                  id="foto_carnet_reverso"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'foto_carnet_reverso')}
                  required={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Foto Votante */}
              <div>
                <label htmlFor="foto_votante" className="block text-sm font-medium text-gray-700 mb-2">
                  Foto del Votante *
                </label>
                <input
                  type="file"
                  id="foto_votante"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'foto_votante')}
                  required={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/votantes')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Registrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VotanteForm; 