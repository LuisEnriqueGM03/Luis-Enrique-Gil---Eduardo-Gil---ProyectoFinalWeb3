import React, { useState, useEffect } from 'react';
import { Table, Plus, Edit, Trash2, Search, Building, Users } from 'lucide-react';
import { MesaElectoral, MesaElectoralFormData } from '../models/mesaElectoral';
import { Recinto } from '../models/recinto';
import { mesasElectoralesService } from '../services/mesasElectoralesService';
import { recintosService } from '../services/recintosService';
import toast from 'react-hot-toast';

const MesasElectoralesPage: React.FC = () => {
  const [mesas, setMesas] = useState<MesaElectoral[]>([]);
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMesa, setEditingMesa] = useState<MesaElectoral | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecinto, setSelectedRecinto] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<MesaElectoralFormData>({
    numero: 0,
    recinto_id: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mesasResponse, recintosResponse] = await Promise.all([
        mesasElectoralesService.getMesasElectorales(),
        recintosService.getRecintos()
      ]);
      setMesas(mesasResponse.results || []);
      setRecintos(recintosResponse.results || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.numero <= 0) {
      toast.error('El número de mesa debe ser mayor a 0');
      return;
    }

    if (formData.recinto_id <= 0) {
      toast.error('Debe seleccionar un recinto');
      return;
    }

    const existingMesa = mesas.find(mesa => 
      mesa.numero === formData.numero && 
      mesa.recinto.id === formData.recinto_id &&
      (!editingMesa || mesa.id !== editingMesa.id)
    );

    if (existingMesa) {
      toast.error('Ya existe una mesa con este número en el recinto seleccionado');
      return;
    }

    try {
      if (editingMesa) {
        await mesasElectoralesService.updateMesaElectoral(editingMesa.id, formData);
        toast.success('Mesa electoral actualizada exitosamente');
      } else {
        await mesasElectoralesService.createMesaElectoral(formData);
        toast.success('Mesa electoral creada exitosamente');
      }
      
      await fetchData();
      resetForm();
    } catch (error: any) {
      console.error('Error saving mesa electoral:', error);
      toast.error(error.detail || 'Error al guardar la mesa electoral');
    }
  };

  const handleEdit = (mesa: MesaElectoral) => {
    setEditingMesa(mesa);
    setFormData({
      numero: mesa.numero,
      recinto_id: mesa.recinto.id,
    });
    setShowForm(true);
  };

  const handleDelete = async (mesa: MesaElectoral) => {
    if (!window.confirm(`¿Estás seguro de eliminar la Mesa #${mesa.numero} del recinto "${mesa.recinto.nombre}"?`)) {
      return;
    }

    try {
      await mesasElectoralesService.deleteMesaElectoral(mesa.id);
      toast.success('Mesa electoral eliminada exitosamente');
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting mesa electoral:', error);
      toast.error(error.detail || 'Error al eliminar la mesa electoral');
    }
  };

  const resetForm = () => {
    setFormData({ numero: 0, recinto_id: 0 });
    setEditingMesa(null);
    setShowForm(false);
  };

  const filteredMesas = mesas.filter(mesa => {
    const matchesSearch = mesa.numero.toString().includes(searchTerm) ||
                         mesa.recinto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRecinto = selectedRecinto === null || mesa.recinto.id === selectedRecinto;
    return matchesSearch && matchesRecinto;
  });

  const getRecintoStats = () => {
    const stats = recintos.map(recinto => {
      const mesasCount = mesas.filter(mesa => mesa.recinto.id === recinto.id).length;
      return { recinto, mesasCount };
    });
    return stats.sort((a, b) => b.mesasCount - a.mesasCount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <Table className="w-8 h-8 mr-3 text-primary-600" />
            Mesas Electorales
          </h1>
          <p className="mt-2 text-secondary-600">
            Gestionar las mesas electorales dentro de cada recinto
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Mesa Electoral
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Table className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Mesas</p>
              <p className="text-2xl font-semibold text-secondary-900">{mesas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Recintos con Mesas</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {getRecintoStats().filter(stat => stat.mesasCount > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Promedio por Recinto</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {recintos.length > 0 ? Math.round(mesas.length / recintos.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por número de mesa o recinto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedRecinto || ''}
              onChange={(e) => setSelectedRecinto(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los recintos</option>
              {recintos.map((recinto) => (
                <option key={recinto.id} value={recinto.id}>
                  {recinto.nombre} ({mesas.filter(m => m.recinto.id === recinto.id).length} mesas)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Mesas Electorales ({filteredMesas.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando mesas electorales...</p>
          </div>
        ) : filteredMesas.length === 0 ? (
          <div className="p-8 text-center">
            <Table className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm || selectedRecinto ? 
                'No se encontraron mesas que coincidan con los filtros' : 
                'No hay mesas electorales registradas'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Mesa #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Recinto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Capacidad del Recinto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredMesas.map((mesa) => (
                  <tr key={mesa.id} className="hover:bg-secondary-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <Table className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-secondary-900">
                            Mesa #{mesa.numero}
                          </div>
                          <div className="text-sm text-secondary-500">
                            ID: {mesa.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {mesa.recinto.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-600">
                        {mesa.recinto.direccion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-600">
                        {mesa.recinto.capacidad} personas
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(mesa)}
                          className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                          title="Editar mesa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mesa)}
                          className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                          title="Eliminar mesa"
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

      {showForm && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingMesa ? 'Editar Mesa Electoral' : 'Nueva Mesa Electoral'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-secondary-700 mb-2">
                  Número de Mesa *
                </label>
                <input
                  type="number"
                  id="numero"
                  min="1"
                  value={formData.numero || ''}
                  onChange={(e) => setFormData({ ...formData, numero: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="Ej: 1, 2, 3..."
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  El número debe ser único dentro del recinto seleccionado
                </p>
              </div>

              <div>
                <label htmlFor="recinto_id" className="block text-sm font-medium text-secondary-700 mb-2">
                  Recinto *
                </label>
                <select
                  id="recinto_id"
                  value={formData.recinto_id || ''}
                  onChange={(e) => setFormData({ ...formData, recinto_id: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona un recinto</option>
                  {recintos.map((recinto) => (
                    <option key={recinto.id} value={recinto.id}>
                      {recinto.nombre} - {recinto.direccion}
                    </option>
                  ))}
                </select>
                {recintos.length === 0 && (
                  <p className="text-xs text-secondary-500 mt-1">
                    No hay recintos disponibles. Crea recintos primero.
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
                  disabled={formData.recinto_id === 0 || formData.numero === 0}
                >
                  {editingMesa ? 'Actualizar' : 'Crear'} Mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesasElectoralesPage; 