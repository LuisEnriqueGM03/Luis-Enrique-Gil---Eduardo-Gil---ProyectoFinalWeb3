import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Trophy, Palette } from 'lucide-react';
import { Candidatura, CandidaturaFormData } from '../models/candidatura';
import { Cargo } from '../models/cargo';
import { candidaturasService } from '../services/candidaturasService';
import { cargosService } from '../services/cargosService';
import toast from 'react-hot-toast';

const CandidaturasPage: React.FC = () => {
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidatura, setEditingCandidatura] = useState<Candidatura | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCargo, setSelectedCargo] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<CandidaturaFormData>({
    nombre_candidato: '',
    partido_politico: '',
    sigla: '',
    color: '#3B82F6',
    cargo_id: 0,
  });

  const predefinedColors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Amarillo', value: '#F59E0B' },
    { name: 'Púrpura', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Cian', value: '#06B6D4' },
    { name: 'Índigo', value: '#6366F1' },
    { name: 'Lima', value: '#84CC16' },
    { name: 'Slate', value: '#64748B' },
    { name: 'Marrón', value: '#A3741D' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [candidaturasResponse, cargosResponse] = await Promise.all([
        candidaturasService.getCandidaturas(),
        cargosService.getCargos()
      ]);
      setCandidaturas(candidaturasResponse.results || []);
      setCargos(cargosResponse.results || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre_candidato.trim()) {
      toast.error('El nombre del candidato es requerido');
      return;
    }

    if (!formData.partido_politico.trim()) {
      toast.error('El partido político es requerido');
      return;
    }

    if (!formData.sigla.trim()) {
      toast.error('La sigla del partido es requerida');
      return;
    }

    if (formData.cargo_id <= 0) {
      toast.error('Debe seleccionar un cargo');
      return;
    }

    const existingSigla = candidaturas.find(candidatura => 
      candidatura.sigla.toUpperCase() === formData.sigla.trim().toUpperCase() &&
      candidatura.cargo.id === formData.cargo_id &&
      (!editingCandidatura || candidatura.id !== editingCandidatura.id)
    );

    if (existingSigla) {
      toast.error('Ya existe una candidatura con esta sigla para el cargo seleccionado');
      return;
    }

    try {
      const submitData = {
        ...formData,
        nombre_candidato: formData.nombre_candidato.trim(),
        partido_politico: formData.partido_politico.trim(),
        sigla: formData.sigla.trim().toUpperCase(),
      };

      if (editingCandidatura) {
        await candidaturasService.updateCandidatura(editingCandidatura.id, submitData);
        toast.success('Candidatura actualizada exitosamente');
      } else {
        await candidaturasService.createCandidatura(submitData);
        toast.success('Candidatura creada exitosamente');
      }
      
      await fetchData();
      resetForm();
    } catch (error: any) {
      console.error('Error saving candidatura:', error);
      toast.error(error.detail || 'Error al guardar la candidatura');
    }
  };

  const handleEdit = (candidatura: Candidatura) => {
    setEditingCandidatura(candidatura);
    setFormData({
      nombre_candidato: candidatura.nombre_candidato,
      partido_politico: candidatura.partido_politico,
      sigla: candidatura.sigla,
      color: candidatura.color,
      cargo_id: candidatura.cargo.id,
    });
    setShowForm(true);
  };

  const handleDelete = async (candidatura: Candidatura) => {
    if (!window.confirm(`¿Estás seguro de eliminar la candidatura de "${candidatura.nombre_candidato}" (${candidatura.sigla})?`)) {
      return;
    }

    try {
      await candidaturasService.deleteCandidatura(candidatura.id);
      toast.success('Candidatura eliminada exitosamente');
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting candidatura:', error);
      toast.error(error.detail || 'Error al eliminar la candidatura');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_candidato: '',
      partido_politico: '',
      sigla: '',
      color: '#3B82F6',
      cargo_id: 0,
    });
    setEditingCandidatura(null);
    setShowForm(false);
  };

  const filteredCandidaturas = candidaturas.filter(candidatura => {
    const matchesSearch = candidatura.nombre_candidato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidatura.partido_politico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidatura.sigla.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCargo = selectedCargo === null || candidatura.cargo.id === selectedCargo;
    return matchesSearch && matchesCargo;
  });

  const getCargoStats = () => {
    const stats = cargos.map(cargo => {
      const candidaturasCount = candidaturas.filter(candidatura => candidatura.cargo.id === cargo.id).length;
      return { cargo, candidaturasCount };
    });
    return stats.sort((a, b) => b.candidaturasCount - a.candidaturasCount);
  };

  const getPartidosUnicos = () => {
    const partidos = candidaturas.map(c => c.partido_politico);
    return Array.from(new Set(partidos)).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary-600" />
            Candidaturas
          </h1>
          <p className="mt-2 text-secondary-600">
            Gestión de candidaturas con partidos políticos, siglas y colores
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Candidatura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Candidaturas</p>
              <p className="text-2xl font-semibold text-secondary-900">{candidaturas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Cargos con Candidatos</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {getCargoStats().filter(stat => stat.candidaturasCount > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Partidos Únicos</p>
              <p className="text-2xl font-semibold text-secondary-900">
                {getPartidosUnicos()}
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
              placeholder="Buscar por candidato, partido o sigla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedCargo || ''}
              onChange={(e) => setSelectedCargo(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los cargos</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre} ({candidaturas.filter(c => c.cargo.id === cargo.id).length} candidatos)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Candidaturas ({filteredCandidaturas.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando candidaturas...</p>
          </div>
        ) : filteredCandidaturas.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm || selectedCargo ? 
                'No se encontraron candidaturas que coincidan con los filtros' : 
                'No hay candidaturas registradas'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {filteredCandidaturas.map((candidatura) => (
              <div key={candidatura.id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                      style={{ backgroundColor: candidatura.color }}
                    >
                      {candidatura.sigla.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-secondary-900">
                          {candidatura.nombre_candidato}
                        </h3>
                        <span 
                          className="px-2 py-1 text-xs rounded-full text-white font-medium"
                          style={{ backgroundColor: candidatura.color }}
                        >
                          {candidatura.sigla}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-secondary-600 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {candidatura.partido_politico}
                        </p>
                        <p className="text-sm text-secondary-600 flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          Cargo: {candidatura.cargo.nombre}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Palette className="w-4 h-4 text-secondary-400" />
                          <span className="text-xs text-secondary-500">
                            Color: {candidatura.color}
                          </span>
                          <div 
                            className="w-4 h-4 rounded border border-secondary-300"
                            style={{ backgroundColor: candidatura.color }}
                          ></div>
                        </div>
                        <p className="text-xs text-secondary-500">
                          ID: {candidatura.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(candidatura)}
                      className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Editar candidatura"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(candidatura)}
                      className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                      title="Eliminar candidatura"
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

      {showForm && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingCandidatura ? 'Editar Candidatura' : 'Nueva Candidatura'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div>
                <label htmlFor="nombre_candidato" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre del Candidato *
                </label>
                <input
                  type="text"
                  id="nombre_candidato"
                  value={formData.nombre_candidato}
                  onChange={(e) => setFormData({ ...formData, nombre_candidato: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Juan Carlos Pérez López"
                  required
                />
              </div>

              <div>
                <label htmlFor="partido_politico" className="block text-sm font-medium text-secondary-700 mb-2">
                  Partido Político *
                </label>
                <input
                  type="text"
                  id="partido_politico"
                  value={formData.partido_politico}
                  onChange={(e) => setFormData({ ...formData, partido_politico: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Movimiento Al Socialismo"
                  required
                />
              </div>

              <div>
                <label htmlFor="sigla" className="block text-sm font-medium text-secondary-700 mb-2">
                  Sigla del Partido *
                </label>
                <input
                  type="text"
                  id="sigla"
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value.toUpperCase() })}
                  className="input-field"
                  placeholder="Ej: MAS, CC, MNR"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Máximo 10 caracteres. Se convertirá automáticamente a mayúsculas.
                </p>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-secondary-700 mb-2">
                  Color del Partido *
                </label>
                <div className="space-y-3">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 border border-secondary-300 rounded-lg cursor-pointer"
                  />
                  <div className="grid grid-cols-6 gap-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`w-8 h-8 rounded border-2 ${
                          formData.color === color.value ? 'border-secondary-800' : 'border-secondary-300'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <div 
                      className="w-4 h-4 rounded border border-secondary-300"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                    <span>Color seleccionado: {formData.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="cargo_id" className="block text-sm font-medium text-secondary-700 mb-2">
                  Cargo *
                </label>
                <select
                  id="cargo_id"
                  value={formData.cargo_id || ''}
                  onChange={(e) => setFormData({ ...formData, cargo_id: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona un cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.nombre}
                    </option>
                  ))}
                </select>
                {cargos.length === 0 && (
                  <p className="text-xs text-secondary-500 mt-1">
                    No hay cargos disponibles. Crea cargos primero.
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
                  disabled={formData.cargo_id === 0}
                >
                  {editingCandidatura ? 'Actualizar' : 'Crear'} Candidatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidaturasPage; 