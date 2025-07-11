import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { consultarPadron } from '../services/consultaService';
import { ConsultaPadron } from '../models/ConsultaPadron';
import { getRecintoById } from '../services/recintoService';
import { Recinto } from '../models/Recinto';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PublicQuery: React.FC = () => {
  const [ci, setCi] = useState('');
  const [resultado, setResultado] = useState<ConsultaPadron | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recinto, setRecinto] = useState<Recinto | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ci.trim()) return;

    setLoading(true);
    setError('');
    setResultado(null);
    setHasSearched(true);
    setRecinto(null);

    try {
      const data = await consultarPadron(ci.trim());
      setResultado(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No se encontró ningún votante con ese número de CI.');
      } else {
        setError('Error al consultar el padrón. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resultado && (resultado as any).recinto_id_externo) {
      getRecintoById(Number((resultado as any).recinto_id_externo))
        .then(setRecinto)
        .catch(() => setRecinto(null));
    } else {
      setRecinto(null);
    }
  }, [resultado]);

  const handleReset = () => {
    setCi('');
    setResultado(null);
    setError('');
    setHasSearched(false);
    setRecinto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Consulta Pública del Padrón Electoral
            </h1>
            <p className="text-lg text-gray-600">
              Ingresa tu número de CI para verificar tu estado en el padrón electoral
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cédula de Identidad (CI)
                </label>
                <input
                  type="text"
                  id="ci"
                  value={ci}
                  onChange={(e) => setCi(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Ej: 12345678"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !ci.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Consultando...' : 'Consultar Padrón'}
                </button>
                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Nueva Consulta
                  </button>
                )}
              </div>
            </form>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {resultado && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-green-800">¡Votante Encontrado!</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo:
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{resultado.nombre_completo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección:
                  </label>
                  <p className="text-gray-800">{resultado.direccion}</p>
                </div>
                {recinto && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-blue-700 mb-2">Recinto Electoral: {recinto.nombre}</h4>
                    {recinto.latitud && recinto.longitud && (
                      <MapContainer
                        center={[Number(recinto.latitud), Number(recinto.longitud)] as LatLngExpression}
                        zoom={16}
                        style={{ height: "300px", width: "100%" }}
                        className="rounded-lg"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[Number(recinto.latitud), Number(recinto.longitud)] as LatLngExpression}>
                          <Popup>{recinto.nombre}</Popup>
                        </Marker>
                      </MapContainer>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicQuery; 