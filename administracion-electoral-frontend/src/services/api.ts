import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Seccion,
  SeccionFormData,
  Cargo,
  CargoFormData,
  Recinto,
  RecintoFormData,
  MesaElectoral,
  MesaElectoralFormData,
  Jurado,
  JuradoFormData,
  Eleccion,
  EleccionFormData,
  Candidatura,
  CandidaturaFormData,
  Papeleta,
  PapeletasResponse,
  APIResponse,
  APIError,
} from "../types";

// Base API configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 seconds
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available (for future implementation)
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic CRUD methods
  private async get<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async post<T, D>(endpoint: string, data: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async put<T, D>(endpoint: string, data: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async delete(endpoint: string): Promise<void> {
    try {
      await this.api.delete(endpoint);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): APIError {
    if (error.response) {
      // Server responded with error status
      return {
        detail:
          error.response.data?.detail ||
          error.response.data?.error ||
          "Error del servidor",
        status: error.response.status,
        ...error.response.data,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        detail: "Error de conexión. Verifica tu conexión a internet.",
        status: 0,
      };
    } else {
      // Something else happened
      return {
        detail: error.message || "Error desconocido",
        status: 0,
      };
    }
  }

  // Secciones API
  async getSecciones(): Promise<APIResponse<Seccion>> {
    return this.get<APIResponse<Seccion>>("/secciones/");
  }

  async getSeccion(id: number): Promise<Seccion> {
    return this.get<Seccion>(`/secciones/${id}/`);
  }

  async createSeccion(data: SeccionFormData): Promise<Seccion> {
    return this.post<Seccion, SeccionFormData>("/secciones/", data);
  }

  async updateSeccion(id: number, data: SeccionFormData): Promise<Seccion> {
    return this.put<Seccion, SeccionFormData>(`/secciones/${id}/`, data);
  }

  async deleteSeccion(id: number): Promise<void> {
    return this.delete(`/secciones/${id}/`);
  }

  // Cargos API
  async getCargos(): Promise<APIResponse<Cargo>> {
    return this.get<APIResponse<Cargo>>("/cargos/");
  }

  async getCargo(id: number): Promise<Cargo> {
    return this.get<Cargo>(`/cargos/${id}/`);
  }

  async createCargo(data: CargoFormData): Promise<Cargo> {
    return this.post<Cargo, CargoFormData>("/cargos/", data);
  }

  async updateCargo(id: number, data: CargoFormData): Promise<Cargo> {
    return this.put<Cargo, CargoFormData>(`/cargos/${id}/`, data);
  }

  async deleteCargo(id: number): Promise<void> {
    return this.delete(`/cargos/${id}/`);
  }

  // Recintos API
  async getRecintos(): Promise<APIResponse<Recinto>> {
    return this.get<APIResponse<Recinto>>("/recintos/");
  }

  async getRecinto(id: number): Promise<Recinto> {
    return this.get<Recinto>(`/recintos/${id}/`);
  }

  async createRecinto(data: RecintoFormData): Promise<Recinto> {
    return this.post<Recinto, RecintoFormData>("/recintos/", data);
  }

  async updateRecinto(id: number, data: RecintoFormData): Promise<Recinto> {
    return this.put<Recinto, RecintoFormData>(`/recintos/${id}/`, data);
  }

  async deleteRecinto(id: number): Promise<void> {
    return this.delete(`/recintos/${id}/`);
  }

  // Mesas Electorales API
  async getMesasElectorales(): Promise<APIResponse<MesaElectoral>> {
    return this.get<APIResponse<MesaElectoral>>("/mesas-electorales/");
  }

  async getMesaElectoral(id: number): Promise<MesaElectoral> {
    return this.get<MesaElectoral>(`/mesas-electorales/${id}/`);
  }

  async createMesaElectoral(
    data: MesaElectoralFormData
  ): Promise<MesaElectoral> {
    return this.post<MesaElectoral, MesaElectoralFormData>(
      "/mesas-electorales/",
      data
    );
  }

  async updateMesaElectoral(
    id: number,
    data: MesaElectoralFormData
  ): Promise<MesaElectoral> {
    return this.put<MesaElectoral, MesaElectoralFormData>(
      `/mesas-electorales/${id}/`,
      data
    );
  }

  async deleteMesaElectoral(id: number): Promise<void> {
    return this.delete(`/mesas-electorales/${id}/`);
  }

  // Jurados API
  async getJurados(): Promise<APIResponse<Jurado>> {
    return this.get<APIResponse<Jurado>>("/jurados/");
  }

  async getJurado(id: number): Promise<Jurado> {
    return this.get<Jurado>(`/jurados/${id}/`);
  }

  async createJurado(data: JuradoFormData): Promise<Jurado> {
    return this.post<Jurado, JuradoFormData>("/jurados/", data);
  }

  async updateJurado(id: number, data: JuradoFormData): Promise<Jurado> {
    return this.put<Jurado, JuradoFormData>(`/jurados/${id}/`, data);
  }

  async deleteJurado(id: number): Promise<void> {
    return this.delete(`/jurados/${id}/`);
  }

  // Elecciones API
  async getElecciones(): Promise<APIResponse<Eleccion>> {
    return this.get<APIResponse<Eleccion>>("/elecciones/");
  }

  async getEleccion(id: number): Promise<Eleccion> {
    return this.get<Eleccion>(`/elecciones/${id}/`);
  }

  async createEleccion(data: EleccionFormData): Promise<Eleccion> {
    return this.post<Eleccion, EleccionFormData>("/elecciones/", data);
  }

  async updateEleccion(id: number, data: EleccionFormData): Promise<Eleccion> {
    return this.put<Eleccion, EleccionFormData>(`/elecciones/${id}/`, data);
  }

  async deleteEleccion(id: number): Promise<void> {
    return this.delete(`/elecciones/${id}/`);
  }

  // Candidaturas API
  async getCandidaturas(): Promise<APIResponse<Candidatura>> {
    return this.get<APIResponse<Candidatura>>("/candidaturas/");
  }

  async getCandidatura(id: number): Promise<Candidatura> {
    return this.get<Candidatura>(`/candidaturas/${id}/`);
  }

  async createCandidatura(data: CandidaturaFormData): Promise<Candidatura> {
    return this.post<Candidatura, CandidaturaFormData>("/candidaturas/", data);
  }

  async updateCandidatura(
    id: number,
    data: CandidaturaFormData
  ): Promise<Candidatura> {
    return this.put<Candidatura, CandidaturaFormData>(
      `/candidaturas/${id}/`,
      data
    );
  }

  async deleteCandidatura(id: number): Promise<void> {
    return this.delete(`/candidaturas/${id}/`);
  }

  // Papeletas API
  async getPapeletasDisponibles(): Promise<PapeletasResponse> {
    return this.get<PapeletasResponse>("/papeletas/");
  }

  async getPapeletaPorSeccion(seccionId: number): Promise<Papeleta> {
    return this.get<Papeleta>(`/papeletas/${seccionId}/`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get("/health/");
      return response.data;
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
