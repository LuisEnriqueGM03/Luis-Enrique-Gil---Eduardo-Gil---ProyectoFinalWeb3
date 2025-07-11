import React, { useEffect, useState } from "react";
import { useVotantes } from "../hooks/useVotantes";
import { getRecintoById } from "../services/recintoService";
import type { Recinto } from "../models/Recinto";
import Navbar from "../components/common/Navbar";

const VotanteListPage: React.FC = () => {
  const { votantes, loading, error } = useVotantes();
  const [recintoNames, setRecintoNames] = useState<Record<number, string>>({});
  const [recintoLoading, setRecintoLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRecintos = async () => {
      setRecintoLoading(true);
      const uniqueRecintoIds = Array.from(new Set(votantes.map(v => Number((v as any).recinto_id_externo ?? v.recinto)).filter(Boolean)));
      const names: Record<number, string> = {};
      await Promise.all(
        uniqueRecintoIds.map(async (id) => {
          if (id && !recintoNames[id]) {
            try {
              const recinto: Recinto = await getRecintoById(id);
              names[id] = recinto.nombre;
            } catch {
              names[id] = "Sin recinto";
            }
          }
        })
      );
      setRecintoNames(prev => ({ ...prev, ...names }));
      setRecintoLoading(false);
    };
    if (votantes.length > 0) {
      fetchRecintos();
    }
  }, [votantes]);

  const filteredVotantes = votantes.filter(v => {
    const term = search.trim().toLowerCase();
    return (
      v.ci.toLowerCase().includes(term) ||
      v.nombre_completo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 mt-24">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Lista de Votantes</h1>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cédula o nombre..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {loading || recintoLoading ? (
          <div className="text-center text-lg text-gray-600">Cargando votantes...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : filteredVotantes.length === 0 ? (
          <div className="text-center text-gray-500">No hay votantes registrados.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredVotantes.map((v) => {
              const recintoId = Number((v as any).recinto_id_externo ?? v.recinto);
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center"
                >
                  <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-2 border-blue-200 bg-gray-100 flex items-center justify-center">
                    {v.foto_votante && typeof v.foto_votante === "string" ? (
                      <img
                        src={v.foto_votante}
                        alt={v.nombre_completo}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400">Sin foto</span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                    {v.nombre_completo}
                  </h2>
                  <div className="text-gray-600 text-sm mb-1 text-center">
                    <span className="font-medium">CI:</span> {v.ci}
                  </div>
                  <div className="text-gray-600 text-sm mb-1 text-center">
                    <span className="font-medium">Dirección:</span> {v.direccion}
                  </div>
                  <div className="text-blue-700 text-sm font-medium text-center">
                    {recintoNames[recintoId] || "Sin recinto"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotanteListPage; 