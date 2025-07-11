import { BaseApiService } from "./baseApi";
import { Eleccion, EleccionFormData } from "../models/eleccion";
import { APIResponse } from "../models/base";

export class EleccionesService extends BaseApiService {
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
}

export const eleccionesService = new EleccionesService();
export default eleccionesService; 