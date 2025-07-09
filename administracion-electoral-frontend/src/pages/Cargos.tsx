import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Cargo, CargoFormData, Seccion } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const CargosPage: React.FC = () => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<CargoFormData>({
    nombre: '',
    secciones_afectadas_ids: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cargosResponse, seccionesResponse] = await Promise.all([
        apiService.getCargos(),
        apiService.getSecciones()
      ]);
      setCargos(cargosResponse.results || []);
      setSecciones(seccionesResponse.results || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre del cargo es requerido');
      return;
    }

    if (formData.secciones_afectadas_ids.length === 0) {
      toast.error('Debe seleccionar al menos una sección');
      return;
    }

    try {
      if (editingCargo) {
        await apiService.updateCargo(editingCargo.id, formData);
        toast.success('Cargo actualizado exitosamente');
      } else {
        await apiService.createCargo(formData);
        toast.success('Cargo creado exitosamente');
      }
      
      await fetchData();
      resetForm();
    } catch (error: any) {
      console.error('Error saving cargo:', error);
      toast.error(error.detail || 'Error al guardar el cargo');
    }
  };

  const handleEdit = (cargo: Cargo) => {
    setEditingCargo(cargo);
    setFormData({
      nombre: cargo.nombre,
      secciones_afectadas_ids: cargo.secciones_afectadas.map(s => s.id),
    });
    setShowForm(true);
  };

  const handleDelete = async (cargo: Cargo) => {
    if (!window.confirm(`¿Estás seguro de eliminar el cargo "${cargo.nombre}"?`)) {
      return;
    }

    try {
      await apiService.deleteCargo(cargo.id);
      toast.success('Cargo eliminado exitosamente');
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting cargo:', error);
      toast.error(error.detail || 'Error al eliminar el cargo');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', secciones_afectadas_ids: [] });
    setEditingCargo(null);
    setShowForm(false);
  };

  const handleSeccionToggle = (seccionId: number) => {
    setFormData(prev => ({
      ...prev,
      secciones_afectadas_ids: prev.secciones_afectadas_ids.includes(seccionId)
        ? prev.secciones_afectadas_ids.filter(id => id !== seccionId)
        : [...prev.secciones_afectadas_ids, seccionId]
    }));
  };

  const filteredCargos = cargos.filter(cargo =>
    cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-primary-600" />
            Cargos Electorales
          </h1>
          <p className="mt-2 text-secondary-600">
            Gestionar los cargos en disputa y sus secciones afectadas
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Cargo
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cargos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Cargos List */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Cargos ({filteredCargos.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando cargos...</p>
          </div>
        ) : filteredCargos.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm ? 'No se encontraron cargos que coincidan con la búsqueda' : 'No hay cargos registrados'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {filteredCargos.map((cargo) => (
              <div key={cargo.id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-secondary-900">
                        {cargo.nombre}
                      </h3>
                      <p className="text-sm text-secondary-600 mt-1">
                        ID: {cargo.id}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-secondary-700 mb-1">
                          Secciones Afectadas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {cargo.secciones_afectadas.map((seccion) => (
                            <span
                              key={seccion.id}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {seccion.nombre}
                            </span>
                          ))}
                          {cargo.secciones_afectadas.length === 0 && (
                            <span className="text-sm text-secondary-500 italic">
                              Sin secciones asignadas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cargo)}
                      className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Editar cargo"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cargo)}
                      className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                      title="Eliminar cargo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingCargo ? 'Editar Cargo' : 'Nuevo Cargo'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre del Cargo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Presidente, Gobernador, Alcalde..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Secciones Afectadas *
                </label>
                <div className="border border-secondary-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {secciones.length === 0 ? (
                    <p className="text-sm text-secondary-500 italic">
                      No hay secciones disponibles. Crea secciones primero.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {secciones.map((seccion) => (
                        <label key={seccion.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.secciones_afectadas_ids.includes(seccion.id)}
                            onChange={() => handleSeccionToggle(seccion.id)}
                            className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-secondary-900">
                            {seccion.nombre}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Selecciona las secciones donde este cargo estará en disputa
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={formData.secciones_afectadas_ids.length === 0}
                >
                  {editingCargo ? 'Actualizar' : 'Crear'} Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargosPage; 