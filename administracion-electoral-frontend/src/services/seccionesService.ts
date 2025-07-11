import { BaseApiService } from "./baseApi";
import { Seccion, SeccionFormData } from "../models/seccion";
import { APIResponse } from "../models/base";

export class SeccionesService extends BaseApiService {
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
}

export const seccionesService = new SeccionesService();
export default seccionesService; 