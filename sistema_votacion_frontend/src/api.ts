import axios from "axios";
import { CandidatoData, ResultadoData, VotanteData } from "./socket";

// Configuración de Axios
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en API:", error);

    if (error.response) {
      // El servidor respondió con un código de estado de error
      console.error("Respuesta de error:", error.response.data);
      console.error("Código de estado:", error.response.status);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("Sin respuesta del servidor");
    } else {
      // Error al configurar la petición
      console.error("Error de configuración:", error.message);
    }

    return Promise.reject(error);
  }
);

// Tipos de respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface HabilitarPapeletaRequest {
  ci: string;
  mesa_id: string;
}

export interface HabilitarPapeletaResponse {
  success: boolean;
  message: string;
  votante: VotanteData;
}

export interface EmitirVotoRequest {
  candidato_id: string;
  mesa_id: string;
}

export interface EmitirVotoResponse {
  success: boolean;
  message: string;
  voto_id: string;
}

export interface CandidatosResponse {
  success: boolean;
  candidatos: CandidatoData[];
  timestamp: string;
}

export interface ResultadosResponse {
  success: boolean;
  resultados: ResultadoData[];
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  server: string;
}

// Funciones de la API
export const apiService = {
  // Verificar estado del servidor
  checkHealth: async (): Promise<HealthResponse> => {
    try {
      const response = await api.get<HealthResponse>("/health");
      return response.data;
    } catch (error) {
      throw new Error("Error al verificar el estado del servidor");
    }
  },

  // Habilitar papeleta
  habilitarPapeleta: async (
    data: HabilitarPapeletaRequest
  ): Promise<HabilitarPapeletaResponse> => {
    try {
      const response = await api.post<HabilitarPapeletaResponse>(
        "/habilitar",
        data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Error al habilitar papeleta";
      throw new Error(message);
    }
  },

  // Emitir voto (alternativa HTTP)
  emitirVoto: async (data: EmitirVotoRequest): Promise<EmitirVotoResponse> => {
    try {
      const response = await api.post<EmitirVotoResponse>("/voto", data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || "Error al emitir voto";
      throw new Error(message);
    }
  },

  // Obtener candidatos
  obtenerCandidatos: async (): Promise<CandidatosResponse> => {
    try {
      const response = await api.get<CandidatosResponse>("/candidatos");
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Error al obtener candidatos";
      throw new Error(message);
    }
  },

  // Obtener resultados
  obtenerResultados: async (): Promise<ResultadosResponse> => {
    try {
      const response = await api.get<ResultadosResponse>("/resultados");
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Error al obtener resultados";
      throw new Error(message);
    }
  },

  // Simular consulta de votante (para uso local)
  simularConsultaVotante: (ci: string): VotanteData | null => {
    const votantesSimulados: { [key: string]: VotanteData } = {
      "12345678": {
        ci: "12345678",
        nombre: "Juan Pérez",
        apellido: "García",
        edad: 35,
        direccion: "Calle 123, Ciudad",
      },
      "87654321": {
        ci: "87654321",
        nombre: "María López",
        apellido: "Rodríguez",
        edad: 28,
        direccion: "Avenida 456, Ciudad",
      },
      "11223344": {
        ci: "11223344",
        nombre: "Carlos Mendoza",
        apellido: "Silva",
        edad: 42,
        direccion: "Plaza 789, Ciudad",
      },
      "55667788": {
        ci: "55667788",
        nombre: "Ana Martínez",
        apellido: "Fernández",
        edad: 31,
        direccion: "Barrio Central, Ciudad",
      },
      "99887766": {
        ci: "99887766",
        nombre: "Luis Hernández",
        apellido: "Torres",
        edad: 29,
        direccion: "Sector Norte, Ciudad",
      },
    };

    return votantesSimulados[ci] || null;
  },
};

// Utilidades para manejo de errores
export const handleApiError = (error: any): string => {
  if (error.response) {
    return (
      error.response.data?.error ||
      error.response.data?.message ||
      "Error del servidor"
    );
  } else if (error.request) {
    return "No se pudo conectar con el servidor. Verifica tu conexión.";
  } else {
    return error.message || "Error desconocido";
  }
};

// Función para validar formato de CI
export const validateCI = (ci: string): boolean => {
  // Validación básica: debe ser un número de 8 dígitos
  const ciRegex = /^\d{8}$/;
  return ciRegex.test(ci);
};

// Función para formatear CI
export const formatCI = (ci: string): string => {
  // Remover espacios y caracteres no numéricos
  const cleaned = ci.replace(/\D/g, "");

  // Formatear como XX.XXX.XXX si tiene 8 dígitos
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(
      5,
      8
    )}`;
  }

  return cleaned;
};

// Función para limpiar CI (solo números)
export const cleanCI = (ci: string): string => {
  return ci.replace(/\D/g, "");
};

// Estado de la conexión API
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    await apiService.checkHealth();
    return true;
  } catch (error) {
    console.error("Error de conexión con la API:", error);
    return false;
  }
};

export default api;
