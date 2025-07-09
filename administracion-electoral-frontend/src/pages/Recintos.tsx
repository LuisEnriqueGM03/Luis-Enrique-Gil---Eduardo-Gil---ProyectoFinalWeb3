import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, Search, MapPin, Clock, Users } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Recinto, RecintoFormData } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationSelectorProps {
  center: [number, number];
  zoom: number;
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: [number, number];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  center, 
  zoom, 
  onLocationSelect, 
  selectedLocation 
}) => {
  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '300px', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents />
      {selectedLocation && (
        <Marker position={selectedLocation}>
          <Popup>Ubicación del recinto</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

const RecintosPage: React.FC = () => {
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecinto, setEditingRecinto] = useState<Recinto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>();
  
  const [formData, setFormData] = useState<RecintoFormData>({
    nombre: '',
    direccion: '',
    latitud: null,
    longitud: null,
    capacidad: 0,
    horario_apertura: '08:00',
    horario_cierre: '18:00',
  });

  useEffect(() => {
    fetchRecintos();
  }, []);

  const fetchRecintos = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRecintos();
      setRecintos(response.results || []);
    } catch (error: any) {
      console.error('Error fetching recintos:', error);
      toast.error('Error al cargar los recintos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre del recinto es requerido');
      return;
    }

    if (!formData.direccion.trim()) {
      toast.error('La dirección es requerida');
      return;
    }

    if (!formData.latitud || !formData.longitud) {
      toast.error('Debe seleccionar una ubicación en el mapa');
      return;
    }

    try {
      if (editingRecinto) {
        await apiService.updateRecinto(editingRecinto.id, formData);
        toast.success('Recinto actualizado exitosamente');
      } else {
        await apiService.createRecinto(formData);
        toast.success('Recinto creado exitosamente');
      }
      
      await fetchRecintos();
      resetForm();
    } catch (error: any) {
      console.error('Error saving recinto:', error);
      toast.error(error.detail || 'Error al guardar el recinto');
    }
  };

  const handleEdit = (recinto: Recinto) => {
    setEditingRecinto(recinto);
    setFormData({
      nombre: recinto.nombre,
      direccion: recinto.direccion,
      latitud: recinto.latitud,
      longitud: recinto.longitud,
      capacidad: recinto.capacidad,
      horario_apertura: recinto.horario_apertura,
      horario_cierre: recinto.horario_cierre,
    });
    
    if (recinto.latitud && recinto.longitud) {
      setSelectedLocation([recinto.latitud, recinto.longitud]);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (recinto: Recinto) => {
    if (!window.confirm(`¿Estás seguro de eliminar el recinto "${recinto.nombre}"?`)) {
      return;
    }

    try {
      await apiService.deleteRecinto(recinto.id);
      toast.success('Recinto eliminado exitosamente');
      await fetchRecintos();
    } catch (error: any) {
      console.error('Error deleting recinto:', error);
      toast.error(error.detail || 'Error al eliminar el recinto');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      direccion: '',
      latitud: null,
      longitud: null,
      capacidad: 0,
      horario_apertura: '08:00',
      horario_cierre: '18:00',
    });
    setEditingRecinto(null);
    setSelectedLocation(undefined);
    setShowForm(false);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setFormData(prev => ({
      ...prev,
      latitud: lat,
      longitud: lng,
    }));
  };

  const filteredRecintos = recintos.filter(recinto =>
    recinto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recinto.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <Building className="w-8 h-8 mr-3 text-primary-600" />
            Recintos Electorales
          </h1>
          <p className="mt-2 text-secondary-600">
            Gestionar los lugares de votación con integración de mapas
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Recinto
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar recintos por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Recintos List */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Recintos ({filteredRecintos.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando recintos...</p>
          </div>
        ) : filteredRecintos.length === 0 ? (
          <div className="p-8 text-center">
            <Building className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm ? 'No se encontraron recintos que coincidan con la búsqueda' : 'No hay recintos registrados'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {filteredRecintos.map((recinto) => (
              <div key={recinto.id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-secondary-900">
                        {recinto.nombre}
                      </h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-secondary-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {recinto.direccion}
                        </p>
                        <p className="text-sm text-secondary-600 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Capacidad: {recinto.capacidad} personas
                        </p>
                        <p className="text-sm text-secondary-600 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Horario: {recinto.horario_apertura} - {recinto.horario_cierre}
                        </p>
                        {recinto.latitud && recinto.longitud && (
                          <p className="text-xs text-secondary-500">
                            Ubicación: {recinto.latitud.toFixed(6)}, {recinto.longitud.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(recinto)}
                      className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Editar recinto"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(recinto)}
                      className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                      title="Eliminar recinto"
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
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingRecinto ? 'Editar Recinto' : 'Nuevo Recinto'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
                    Nombre del Recinto *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Universidad Nur, Colegio San Patricio..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="capacidad" className="block text-sm font-medium text-secondary-700 mb-2">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    id="capacidad"
                    min="0"
                    value={formData.capacidad}
                    onChange={(e) => setFormData({ ...formData, capacidad: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="Número de personas"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-secondary-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="input-field"
                  placeholder="Dirección completa del recinto"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="horario_apertura" className="block text-sm font-medium text-secondary-700 mb-2">
                    Horario de Apertura
                  </label>
                  <input
                    type="time"
                    id="horario_apertura"
                    value={formData.horario_apertura}
                    onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="horario_cierre" className="block text-sm font-medium text-secondary-700 mb-2">
                    Horario de Cierre
                  </label>
                  <input
                    type="time"
                    id="horario_cierre"
                    value={formData.horario_cierre}
                    onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Ubicación en el Mapa *
                </label>
                <p className="text-xs text-secondary-500 mb-2">
                  Haz clic en el mapa para seleccionar la ubicación del recinto
                </p>
                <LocationSelector
                  center={selectedLocation || [-17.783, -63.182]} // Santa Cruz center
                  zoom={12}
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
                {selectedLocation && (
                  <p className="text-xs text-secondary-600 mt-2">
                    Ubicación seleccionada: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
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
                  disabled={!selectedLocation}
                >
                  {editingRecinto ? 'Actualizar' : 'Crear'} Recinto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecintosPage; 