// Custom hook para manejar resultados de votación en tiempo real

import { useState, useEffect, useCallback } from "react";
import { socketService } from "../services/socket";
import { apiService } from "../services/api";
import { ResultadosData } from "../types";
import { ResultadosModel } from "../models";

interface UseResultadosReturn {
  resultados: ResultadosData[];
  loading: boolean;
  error: string;
  totalVotos: number;
  chartData: any;
  topCandidatos: ResultadosData[];

  // Acciones
  fetchResultados: () => Promise<void>;
  refresh: () => void;

  // Utilidades
  getPorcentaje: (resultado: ResultadosData) => number;
  getResultadosByCargo: (cargo: string) => ResultadosData[];
}

export const useResultados = (): UseResultadosReturn => {
  const [resultados, setResultados] = useState<ResultadosData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Cargar resultados iniciales
  const fetchResultados = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiService.obtenerResultados();

      if (response.success && response.data) {
        const resultadosData = response.data.map(ResultadosModel.fromApi);
        setResultados(resultadosData);
      } else {
        setError(response.error || "Error al cargar resultados");
      }
    } catch (err) {
      setError("Error de conexión al cargar resultados");
      console.error("Error fetching resultados:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Configurar listener para actualizaciones en tiempo real
  useEffect(() => {
    // Conectar socket
    socketService.connect();

    // Cargar resultados iniciales
    fetchResultados();

    // Listener para actualizaciones de resultados
    const unsubscribe = socketService.onResultadosActualizados((data) => {
      console.log("📊 Resultados actualizados:", data);
      const resultadosData = data.resultados.map(ResultadosModel.fromApi);
      setResultados(resultadosData);
    });

    // Cleanup
    return unsubscribe;
  }, [fetchResultados]);

  // Refresh manual
  const refresh = useCallback(() => {
    fetchResultados();
  }, [fetchResultados]);

  // Calcular total de votos
  const totalVotos = ResultadosModel.getTotalVotos(resultados);

  // Generar datos para gráficos
  const chartData = ResultadosModel.getChartData(resultados);

  // Obtener top candidatos
  const topCandidatos = ResultadosModel.getTopCandidatos(resultados, 3);

  // Obtener porcentaje de un resultado
  const getPorcentaje = useCallback(
    (resultado: ResultadosData): number => {
      return ResultadosModel.getPorcentaje(resultado, totalVotos);
    },
    [totalVotos]
  );

  // Obtener resultados por cargo
  const getResultadosByCargo = useCallback(
    (cargo: string): ResultadosData[] => {
      return resultados.filter(
        (resultado) =>
          resultado.candidato_nombre
            .toLowerCase()
            .includes(cargo.toLowerCase()) ||
          // Aquí podrías implementar una lógica más específica para filtrar por cargo
          // dependiendo de cómo esté estructurada tu data
          true
      );
    },
    [resultados]
  );

  return {
    resultados,
    loading,
    error,
    totalVotos,
    chartData,
    topCandidatos,

    // Acciones
    fetchResultados,
    refresh,

    // Utilidades
    getPorcentaje,
    getResultadosByCargo,
  };
};
