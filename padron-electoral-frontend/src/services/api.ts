import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Recinto,
  Votante,
  ConsultaPadron,
  AuthUser,
  LoginCredentials,
} from "../types";

const BASE_URL = "http://localhost:8000/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para agregar token JWT
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar token expirado
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem("access_token", response.access);
              return this.api.request(error.config);
            } catch {
              this.logout();
            }
          } else {
            this.logout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Autenticación
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response: AxiosResponse<AuthUser> = await this.api.post(
      "/token/",
      credentials
    );
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    return response.data;
  }

  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response = await this.api.post("/token/refresh/", { refresh });
    return response.data;
  }

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  // Consulta pública
  async consultarPadron(ci: string): Promise<ConsultaPadron> {
    const response: AxiosResponse<ConsultaPadron> = await this.api.get(
      `/consulta-padron/?ci=${ci}`
    );
    return response.data;
  }

  // CRUD Recintos
  async getRecintos(): Promise<Recinto[]> {
    const response: AxiosResponse<Recinto[]> = await this.api.get("/recintos/");
    return response.data;
  }

  async createRecinto(recinto: Omit<Recinto, "id">): Promise<Recinto> {
    const response: AxiosResponse<Recinto> = await this.api.post(
      "/recintos/",
      recinto
    );
    return response.data;
  }

  async updateRecinto(id: number, recinto: Partial<Recinto>): Promise<Recinto> {
    const response: AxiosResponse<Recinto> = await this.api.put(
      `/recintos/${id}/`,
      recinto
    );
    return response.data;
  }

  async deleteRecinto(id: number): Promise<void> {
    await this.api.delete(`/recintos/${id}/`);
  }

  // CRUD Votantes
  async getVotantes(): Promise<Votante[]> {
    const response: AxiosResponse<Votante[]> = await this.api.get("/votantes/");
    return response.data;
  }

  async createVotante(votante: FormData): Promise<Votante> {
    const response: AxiosResponse<Votante> = await this.api.post(
      "/votantes/",
      votante,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async updateVotante(id: number, votante: FormData): Promise<Votante> {
    const response: AxiosResponse<Votante> = await this.api.put(
      `/votantes/${id}/`,
      votante,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async deleteVotante(id: number): Promise<void> {
    await this.api.delete(`/votantes/${id}/`);
  }
}

export const apiService = new ApiService();
