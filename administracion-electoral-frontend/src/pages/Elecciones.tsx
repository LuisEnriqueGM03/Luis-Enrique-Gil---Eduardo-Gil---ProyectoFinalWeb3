import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Search, MapPin, Clock } from 'lucide-react';
import { Eleccion, EleccionFormData, Seccion, TipoEleccion } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const EleccionesPage: React.FC = () => {
  const [elecciones, setElecciones] = useState<Eleccion[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEleccion, setEditingEleccion] = useState<Eleccion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<TipoEleccion | ''>('');
  
  const [formData, setFormData] = useState<EleccionFormData>({
    tipo: 'PRESIDENCIAL',
    fecha: '',
    seccion_id: 0,
  });

  const tiposEleccion: { value: TipoEleccion; label: string; description: string; color: string }[] = [
    { value: 'PRESIDENCIAL', label: 'Presidencial', description: 'Elección para Presidente del Estado', color: 'bg-red-100 text-red-800' },
    { value: 'DEPARTAMENTAL', label: 'Departamental', description: 'Elección para Gobernador', color: 'bg-blue-100 text-blue-800' },
    { value: 'MUNICIPAL', label: 'Municipal', description: 'Elección para Alcalde', color: 'bg-green-100 text-green-800' },
    { value: 'JUDICIAL', label: 'Judicial', description: 'Elección de autoridades judiciales', color: 'bg-purple-100 text-purple-800' },
    { value: 'LEGISLATIVA', label: 'Legislativa', description: 'Elección de diputados y senadores', color: 'bg-yellow-100 text-yellow-800' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eleccionesResponse, seccionesResponse] = await Promise.all([
        apiService.getElecciones(),
        apiService.getSecciones()
      ]);
      setElecciones(eleccionesResponse.results || []);
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
    
    if (!formData.fecha) {
      toast.error('La fecha de elección es requerida');
      return;
    }

    if (formData.seccion_id <= 0) {
      toast.error('Debe seleccionar una sección');
      return;
    }

    // Check if there's already an election of the same type in the same section on the same date
    const existingEleccion = elecciones.find(eleccion => 
      eleccion.tipo === formData.tipo &&
      eleccion.fecha === formData.fecha &&
      eleccion.seccion.id === formData.seccion_id &&
      (!editingEleccion || eleccion.id !== editingEleccion.id)
    );

    if (existingEleccion) {
      toast.error('Ya existe una elección del mismo tipo en esta sección para la fecha seleccionada');
      return;
    }

    try {
      if (editingEleccion) {
        await apiService.updateEleccion(editingEleccion.id, formData);
        toast.success('Elección actualizada exitosamente');
      } else {
        await apiService.createEleccion(formData);
        toast.success('Elección creada exitosamente');
      }
      
      await fetchData();
      resetForm();
    } catch (error: any) {
      console.error('Error saving elección:', error);
      toast.error(error.detail || 'Error al guardar la elección');
    }
  };

  const handleEdit = (eleccion: Eleccion) => {
    setEditingEleccion(eleccion);
    setFormData({
      tipo: eleccion.tipo,
      fecha: eleccion.fecha,
      seccion_id: eleccion.seccion.id,
    });
    setShowForm(true);
  };

  const handleDelete = async (eleccion: Eleccion) => {
    if (!window.confirm(`¿Estás seguro de eliminar la elección ${eleccion.tipo_display} en ${eleccion.seccion.nombre}?`)) {
      return;
    }

    try {
      await apiService.deleteEleccion(eleccion.id);
      toast.success('Elección eliminada exitosamente');
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting elección:', error);
      toast.error(error.detail || 'Error al eliminar la elección');
    }
  };

  const resetForm = () => {
    setFormData({ tipo: 'PRESIDENCIAL', fecha: '', seccion_id: 0 });
    setEditingEleccion(null);
    setShowForm(false);
  };

  const filteredElecciones = elecciones.filter(eleccion => {
    const matchesSearch = eleccion.tipo_display.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eleccion.seccion.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === '' || eleccion.tipo === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  const getTipoConfig = (tipo: TipoEleccion) => {
    return tiposEleccion.find(t => t.value === tipo) || tiposEleccion[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEleccionUpcoming = (fecha: string) => {
    return new Date(fecha) > new Date();
  };

  const isEleccionToday = (fecha: string) => {
    const today = new Date().toISOString().split('T')[0];
    return fecha === today;
  };

  const getEleccionStats = () => {
    const upcoming = elecciones.filter(e => isEleccionUpcoming(e.fecha)).length;
    const today = elecciones.filter(e => isEleccionToday(e.fecha)).length;
    const past = elecciones.length - upcoming;

    return { upcoming, today, past };
  };

  const stats = getEleccionStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-primary-600" />
            Elecciones
          </h1>
          <p className="mt-2 text-secondary-600">
            Creación y gestión de elecciones (tipo, fecha, sección)
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Elección
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Próximas</p>
              <p className="text-2xl font-semibold text-secondary-900">{stats.upcoming}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Hoy</p>
              <p className="text-2xl font-semibold text-secondary-900">{stats.today}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Realizadas</p>
              <p className="text-2xl font-semibold text-secondary-900">{stats.past}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por tipo de elección o sección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value as TipoEleccion | '')}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {tiposEleccion.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label} ({elecciones.filter(e => e.tipo === tipo.value).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Elecciones List */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Elecciones ({filteredElecciones.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando elecciones...</p>
          </div>
        ) : filteredElecciones.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm || selectedTipo ? 
                'No se encontraron elecciones que coincidan con los filtros' : 
                'No hay elecciones registradas'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {filteredElecciones.map((eleccion) => {
              const tipoConfig = getTipoConfig(eleccion.tipo);
              const isUpcoming = isEleccionUpcoming(eleccion.fecha);
              const isToday = isEleccionToday(eleccion.fecha);
              
              return (
                <div key={eleccion.id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-secondary-900">
                            {eleccion.tipo_display}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${tipoConfig.color}`}>
                            {tipoConfig.label}
                          </span>
                          {isToday && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                              HOY
                            </span>
                          )}
                          {isUpcoming && !isToday && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                              PRÓXIMA
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-secondary-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(eleccion.fecha)}
                          </p>
                          <p className="text-sm text-secondary-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            Sección: {eleccion.seccion.nombre}
                          </p>
                          <p className="text-xs text-secondary-500">
                            ID: {eleccion.id}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(eleccion)}
                        className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                        title="Editar elección"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(eleccion)}
                        className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                        title="Eliminar elección"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingEleccion ? 'Editar Elección' : 'Nueva Elección'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-secondary-700 mb-2">
                  Tipo de Elección *
                </label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoEleccion })}
                  className="input-field"
                  required
                >
                  {tiposEleccion.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label} - {tipo.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha de Elección *
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="input-field"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Selecciona la fecha en que se realizará la elección
                </p>
              </div>

              <div>
                <label htmlFor="seccion_id" className="block text-sm font-medium text-secondary-700 mb-2">
                  Sección *
                </label>
                <select
                  id="seccion_id"
                  value={formData.seccion_id || ''}
                  onChange={(e) => setFormData({ ...formData, seccion_id: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona una sección</option>
                  {secciones.map((seccion) => (
                    <option key={seccion.id} value={seccion.id}>
                      {seccion.nombre}
                    </option>
                  ))}
                </select>
                {secciones.length === 0 && (
                  <p className="text-xs text-secondary-500 mt-1">
                    No hay secciones disponibles. Crea secciones primero.
                  </p>
                )}
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
                  disabled={formData.seccion_id === 0}
                >
                  {editingEleccion ? 'Actualizar' : 'Crear'} Elección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EleccionesPage; 