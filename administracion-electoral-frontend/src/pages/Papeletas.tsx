import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { PapeletaDisponible, Papeleta } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const PapeletasPage: React.FC = () => {
  const [papeletasDisponibles, setPapeletasDisponibles] = useState<PapeletaDisponible[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPapeleta, setSelectedPapeleta] = useState<Papeleta | null>(null);
  const [showPapeleta, setShowPapeleta] = useState(false);

  useEffect(() => {
    fetchPapeletasDisponibles();
  }, []);

  const fetchPapeletasDisponibles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPapeletasDisponibles();
      setPapeletasDisponibles(response.papeletas_disponibles || []);
    } catch (error: any) {
      console.error('Error fetching papeletas:', error);
      toast.error('Error al cargar las papeletas disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleVerPapeleta = async (papeleta: PapeletaDisponible) => {
    try {
      const response = await apiService.getPapeletaPorSeccion(papeleta.seccion_id);
      setSelectedPapeleta(response);
      setShowPapeleta(true);
    } catch (error: any) {
      console.error('Error fetching papeleta:', error);
      toast.error('Error al cargar la papeleta');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <FileText className="w-8 h-8 mr-3 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Papeletas</h1>
          <p className="mt-2 text-secondary-600">
            Generación automática de papeletas según secciones
          </p>
        </div>
      </div>

      {/* Papeletas disponibles */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">
            Papeletas Disponibles
          </h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-secondary-600">Cargando papeletas...</p>
          </div>
        ) : papeletasDisponibles.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              No hay papeletas disponibles. Crea secciones y cargos primero.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {papeletasDisponibles.map((papeleta) => (
              <div key={papeleta.seccion_id} className="p-6 hover:bg-secondary-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-secondary-900">
                        Papeleta - {papeleta.seccion_nombre}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {papeleta.total_cargos} cargo(s) disponible(s)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVerPapeleta(papeleta)}
                      className="flex items-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Papeleta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para mostrar papeleta */}
      {showPapeleta && selectedPapeleta && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-secondary-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">
                Papeleta - Sección {selectedPapeleta.seccion}
              </h3>
              <button
                onClick={() => setShowPapeleta(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {selectedPapeleta.papeleta.map((cargo, index) => (
                  <div key={index} className="bg-secondary-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4 text-center border-b border-secondary-200 pb-2">
                      {cargo.nombre}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cargo.candidatos.map((candidato, candidatoIndex) => (
                        <div 
                          key={candidatoIndex} 
                          className="bg-white rounded-lg p-4 border-l-4 shadow-sm"
                          style={{ borderLeftColor: candidato.color }}
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: candidato.color }}
                            >
                              {candidato.sigla}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-secondary-900">
                                {candidato.nombre_candidato}
                              </h5>
                              <p className="text-sm text-secondary-600">
                                {candidato.partido_politico}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-secondary-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowPapeleta(false)}
                className="btn-secondary"
              >
                Cerrar
              </button>
              <button className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PapeletasPage; 