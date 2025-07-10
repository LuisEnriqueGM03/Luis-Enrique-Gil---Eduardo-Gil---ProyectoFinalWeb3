// Servicio API para el sistema de votación

import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  ApiResponse,
  HabilitarPapeletaRequest,
  HabilitarPapeletaResponse,
  CandidatoData,
  ResultadosData,
} from "../types";
import { API_CONFIG } from "../models/constants";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para requests
    this.client.interceptors.request.use(
      (config) => {
        console.log(
          `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("❌ API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Interceptor para responses
    this.client.interceptors.response.use(
      (response) => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error(
          "❌ API Response Error:",
          error.response?.status,
          error.message
        );
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Error del servidor
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Error del servidor";
      return new Error(`Error ${error.response.status}: ${message}`);
    } else if (error.request) {
      // Error de red
      return new Error("Error de conexión: No se pudo conectar al servidor");
    } else {
      // Error general
      return new Error(`Error: ${error.message}`);
    }
  }

  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url: endpoint,
        data,
      });

      return {
        success: true,
        data: response.data,
        message: "Operación exitosa",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  // Verificar estado del servidor
  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ status: string }>(
        "GET",
        API_CONFIG.ENDPOINTS.HEALTH
      );
      return response.success && response.data?.status === "OK";
    } catch {
      return false;
    }
  }

  // Habilitar papeleta para un votante
  async habilitarPapeleta(
    request: HabilitarPapeletaRequest
  ): Promise<ApiResponse<HabilitarPapeletaResponse>> {
    return this.makeRequest<HabilitarPapeletaResponse>(
      "POST",
      API_CONFIG.ENDPOINTS.HABILITAR,
      request
    );
  }

  // Emitir un voto
  async emitirVoto(
    candidatoId: number,
    mesaId: string
  ): Promise<ApiResponse<{ mensaje: string; voto_id: string }>> {
    return this.makeRequest("POST", API_CONFIG.ENDPOINTS.VOTO, {
      candidato_id: candidatoId,
      mesa_id: mesaId,
    });
  }

  // Obtener resultados de votación
  async obtenerResultados(): Promise<ApiResponse<ResultadosData[]>> {
    return this.makeRequest<ResultadosData[]>(
      "GET",
      API_CONFIG.ENDPOINTS.RESULTADOS
    );
  }

  // Obtener lista de candidatos
  async obtenerCandidatos(): Promise<ApiResponse<CandidatoData[]>> {
    return this.makeRequest<CandidatoData[]>(
      "GET",
      API_CONFIG.ENDPOINTS.CANDIDATOS
    );
  }

  // Método para realizar peticiones personalizadas
  async customRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(method, endpoint, data);
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();

// Funciones de conveniencia para mantener compatibilidad
export const checkApiConnection = (): Promise<boolean> => {
  return apiService.checkConnection();
};

export const habilitarPapeleta = (
  request: HabilitarPapeletaRequest
): Promise<ApiResponse<HabilitarPapeletaResponse>> => {
  return apiService.habilitarPapeleta(request);
};

export const emitirVoto = (
  candidatoId: number,
  mesaId: string
): Promise<ApiResponse<{ mensaje: string; voto_id: string }>> => {
  return apiService.emitirVoto(candidatoId, mesaId);
};

export const obtenerResultados = (): Promise<ApiResponse<ResultadosData[]>> => {
  return apiService.obtenerResultados();
};

export const obtenerCandidatos = (): Promise<ApiResponse<CandidatoData[]>> => {
  return apiService.obtenerCandidatos();
};

export default apiService;
