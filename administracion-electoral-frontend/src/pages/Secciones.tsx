import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { Seccion, SeccionFormData } from '../models/seccion';
import { seccionesService } from '../services/seccionesService';
import toast from 'react-hot-toast';

const PolygonDrawer: React.FC<{ onPolygonCreated: (latlngs: L.LatLngLiteral[]) => void }> = ({ onPolygonCreated }) => {
  const map = useMap();
  React.useEffect(() => {
    if (!map) return;
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });
    map.on('pm:create', (e: any) => {
      if (e.layer && e.layer instanceof L.Polygon) {
        const latlngs = e.layer.getLatLngs()[0].map((latlng: L.LatLng) => ({ lat: latlng.lat, lng: latlng.lng }));
        onPolygonCreated(latlngs);
        map.removeLayer(e.layer);
      }
    });
    return () => {
      map.pm.removeControls();
    };
  }, [map, onPolygonCreated]);
  return null;
};

const SeccionesPage: React.FC = () => {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMap, setShowMap] = useState(true);
  
  const [formData, setFormData] = useState<SeccionFormData>({
    nombre: '',
  });

  const [polygon, setPolygon] = useState<L.LatLngLiteral[] | null>(null);

  useEffect(() => {
    fetchSecciones();
  }, []);

  const fetchSecciones = async () => {
    try {
      setLoading(true);
      const response = await seccionesService.getSecciones();
      setSecciones(response.results || []);
    } catch (error: any) {
      console.error('Error fetching secciones:', error);
      toast.error('Error al cargar las secciones');
    } finally {
      setLoading(false);
    }
  };

  const handlePolygonCreated = (latlngs: L.LatLngLiteral[]) => {
    setPolygon(latlngs);
    setShowMap(false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre de la sección es requerido');
      return;
    }
    if (!polygon && !editingSeccion) {
      toast.error('Debes dibujar el polígono de la sección en el mapa');
      return;
    }

    try {
      if (editingSeccion) {
        await seccionesService.updateSeccion(editingSeccion.id, { ...formData, polygon: polygon || editingSeccion.polygon });
        toast.success('Sección actualizada exitosamente');
      } else {
        await seccionesService.createSeccion({ ...formData, polygon: polygon || undefined });
        toast.success('Sección creada exitosamente');
      }
      
      await fetchSecciones();
      resetForm();
      setPolygon(null);
    } catch (error: any) {
      console.error('Error saving seccion:', error);
      toast.error(error.detail || 'Error al guardar la sección');
    }
  };

  const handleEdit = (seccion: Seccion) => {
    setEditingSeccion(seccion);
    setFormData({
      nombre: seccion.nombre,
    });
    setPolygon(seccion.polygon || null);
    setShowMap(false);
    setShowForm(true);
  };

  const handleDelete = async (seccion: Seccion) => {
    if (!window.confirm(`¿Estás seguro de eliminar la sección "${seccion.nombre}"?`)) {
      return;
    }

    try {
      await seccionesService.deleteSeccion(seccion.id);
      toast.success('Sección eliminada exitosamente');
      await fetchSecciones();
    } catch (error: any) {
      console.error('Error deleting seccion:', error);
      toast.error(error.detail || 'Error al eliminar la sección');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '' });
    setEditingSeccion(null);
    setShowForm(false);
    setPolygon(null);
    setShowMap(true);
  };

  const filteredSecciones = secciones.filter(seccion =>
    seccion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-primary-600" />
            Secciones Electorales
          </h1>
          <p className="mt-2 text-secondary-600">
            Gestionar las divisiones territoriales del sistema electoral
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-secondary"
          >
            {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setPolygon(null);
              toast('Dibuja el polígono de la nueva sección en el mapa');
            }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Sección
          </button>
        </div>
      </div>

      {showMap && (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Mapa de Secciones
          </h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[-17.7839, -63.1823]}
              zoom={11}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {secciones.map((seccion) =>
                seccion.polygon ? (
                  <Polygon
                    key={seccion.id}
                    positions={seccion.polygon}
                    pathOptions={{ color: 'blue' }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{seccion.nombre}</h3>
                        <p className="text-sm text-gray-600">Sección Electoral</p>
                      </div>
                    </Popup>
                  </Polygon>
                ) : null
              )}
              {polygon && (
                <Polygon positions={polygon} pathOptions={{ color: 'red' }} />
              )}
              {!showForm && <PolygonDrawer onPolygonCreated={handlePolygonCreated} />}
            </MapContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar secciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Lista de Secciones ({filteredSecciones.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando secciones...</p>
          </div>
        ) : filteredSecciones.length === 0 ? (
          <div className="p-8 text-center">
            <MapPin className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              {searchTerm ? 'No se encontraron secciones que coincidan con la búsqueda' : 'No hay secciones registradas'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {filteredSecciones.map((seccion) => (
              <div key={seccion.id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-secondary-900">
                        {seccion.nombre}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        ID: {seccion.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(seccion)}
                      className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      title="Editar sección"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(seccion)}
                      className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
                      title="Eliminar sección"
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
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900">
                {editingSeccion ? 'Editar Sección' : 'Nueva Sección'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre de la Sección *
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input-field"
                  placeholder="Ej: Central, Norte, Sur..."
                  required
                />
              </div>
              
              {polygon && (
                <div className="text-sm text-green-700">Polígono seleccionado: {polygon.length} puntos</div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
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
                >
                  {editingSeccion ? 'Actualizar' : 'Crear'} Sección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionesPage; 