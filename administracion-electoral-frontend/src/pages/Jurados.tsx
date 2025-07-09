import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Search, Table, Building, User } from 'lucide-react';
import { Jurado, JuradoFormData, MesaElectoral } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const JuradosPage: React.FC = () => {
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [mesas, setMesas] = useState<MesaElectoral[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJurado, setEditingJurado] = useState<Jurado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMesa, setSelectedMesa] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<JuradoFormData>({
    nombre_completo: '',
    ci: '',
    mesa_id: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [juradosResponse, mesasResponse] = await Promise.all([
        apiService.getJurados(),
        apiService.getMesasElectorales()
      ]);
      setJurados(juradosResponse.results || []);
      setMesas(mesasResponse.results || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre_completo.trim()) {
      toast.error('El nombre completo es requerido');
      return;
    }

    if (!formData.ci.trim()) {
      toast.error('La cédula de identidad es requerida');
      return;
    }

    if (formData.mesa_id <= 0) {
      toast.error('Debe seleccionar una mesa electoral');
      return;
    }

    // Check if CI already exists
    const existingJurado = jurados.find(jurado => 
      jurado.ci === formData.ci.trim() &&
      (!editingJurado || jurado.id !== editingJurado.id)
    );

    if (existingJurado) {
      toast.error('Ya existe un jurado con esta cédula de identidad');
      return;
    }

    try {
      if (editingJurado) {
        await apiService.updateJurado(editingJurado.id, formData);
        toast.success('Jurado actualizado exitosamente');
      } else {
        await apiService.createJurado(formData);
        toast.success('Jurado creado exitosamente');
      }
      
      await fetchData();
      resetForm();
    } catch (error: any) {
      console.error('Error saving jurado:', error);
      toast.error(error.detail || 'Error al guardar el jurado');
    }
  };

  const handleEdit = (jurado: Jurado) => {
    setEditingJurado(jurado);
    setFormData({
      nombre_completo: jurado.nombre_completo,
      ci: jurado.ci,
      mesa_id: jurado.mesa.id,
    });
    setShowForm(true);
  };

  const handleDelete = async (jurado: Jurado) => {
    if (!window.confirm(`¿Estás seguro de eliminar al jurado "${jurado.nombre_completo}"?`)) {
      return;
    }

    try {
      await apiService.deleteJurado(jurado.id);
      toast.success('Jurado eliminado exitosamente');
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting jurado:', error);
      toast.error(error.detail || 'Error al eliminar el jurado');
    }
  };

  const resetForm = () => {
    setFormData({ nombre_completo: '', ci: '', mesa_id: 0 });
    setEditingJurado(null);
    setShowForm(false);
  };

  const filteredJurados = jurados.filter(jurado => {
    const matchesSearch = jurado.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jurado.ci.includes(searchTerm);
    const matchesMesa = selectedMesa === null || jurado.mesa.id === selectedMesa;
    return matchesSearch && matchesMesa;
  });

  const getMesaStats = () => {
    const stats = mesas.map(mesa => {
      const juradosCount = jurados.filter(jurado => jurado.mesa.id === mesa.id).length;
      return { mesa, juradosCount };
    });
    return stats.sort((a, b) => b.juradosCount - a.juradosCount);
  };

  const formatCI = (ci: string) => {
    // Simple format for Bolivian CI: 1234567-XX
    const cleaned = ci.replace(/\D/g, '');
    if (cleaned.length >= 7) {
      return `${cleaned.slice(0, 7)}-${cleaned.slice(7, 9)}`.substring(0, 10);
    }
    return cleaned;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <UserCheck className="w-8 h-8 mr-3 text-primary-600" />
            Jurados Electorales
          </h1>
          <p className="mt-2 text-secondary-600">
            Gestionar la asignación de jurados electorales a las mesas
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Jurado
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Jurados</p>
              <p className="text-2xl font-semibold text-secondary-900">{jurados.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Table className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Mesas con Jurados</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {getMesaStats().filter(stat => stat.juradosCount > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Promedio por Mesa</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {mesas.length > 0 ? Math.round(jurados.length / mesas.length * 10) / 10 : 0}
              </p>
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
              placeholder="Buscar por nombre o cédula de identidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedMesa || ''}
              onChange={(e) => setSelectedMesa(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las mesas</option>
              {mesas.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  Mesa #{mesa.numero} - {mesa.recinto.nombre} ({jurados.filter(j => j.mesa.id === mesa.id).length} jurados)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jurados List */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Jurados ({filteredJurados.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando jurados...</p>
          </div>
        ) : filteredJurados.length === 0 ? (
          <div className="p-8 text-center">
            <UserCheck className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm || selectedMesa ? 
                'No se encontraron jurados que coincidan con los filtros' : 
                'No hay jurados registrados'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Jurado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Cédula de Identidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Mesa Asignada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Recinto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredJurados.map((jurado) => (
                  <tr key={jurado.id} className="hover:bg-secondary-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-primary-600 font-medium text-sm">
                            {jurado.nombre_completo.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            {jurado.nombre_completo}
                          </div>
                          <div className="text-sm text-secondary-500">
                            ID: {jurado.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-secondary-900">
                        {formatCI(jurado.ci)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Table className="w-4 h-4 text-secondary-400 mr-2" />
                        <span className="text-sm font-medium text-secondary-900">
                          Mesa #{jurado.mesa.numero}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-secondary-400 mr-2" />
                        <span className="text-sm text-secondary-600">
                          {jurado.mesa.recinto.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(jurado)}
                          className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                          title="Editar jurado"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(jurado)}
                          className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                          title="Eliminar jurado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingJurado ? 'Editar Jurado' : 'Nuevo Jurado'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="nombre_completo" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Juan Carlos Pérez López"
                  required
                />
              </div>

              <div>
                <label htmlFor="ci" className="block text-sm font-medium text-secondary-700 mb-2">
                  Cédula de Identidad *
                </label>
                <input
                  type="text"
                  id="ci"
                  value={formData.ci}
                  onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                  className="input-field"
                  placeholder="Ej: 1234567-12"
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Formato: 1234567-12 (sin espacios)
                </p>
              </div>

              <div>
                <label htmlFor="mesa_id" className="block text-sm font-medium text-secondary-700 mb-2">
                  Mesa Electoral *
                </label>
                <select
                  id="mesa_id"
                  value={formData.mesa_id || ''}
                  onChange={(e) => setFormData({ ...formData, mesa_id: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona una mesa</option>
                  {mesas.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa #{mesa.numero} - {mesa.recinto.nombre}
                    </option>
                  ))}
                </select>
                {mesas.length === 0 && (
                  <p className="text-xs text-secondary-500 mt-1">
                    No hay mesas disponibles. Crea mesas electorales primero.
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
                  disabled={formData.mesa_id === 0}
                >
                  {editingJurado ? 'Actualizar' : 'Crear'} Jurado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JuradosPage; 