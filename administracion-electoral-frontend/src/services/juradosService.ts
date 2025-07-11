import { BaseApiService } from "./baseApi";
import { Jurado, JuradoFormData } from "../models/jurado";
import { APIResponse } from "../models/base";

export class JuradosService extends BaseApiService {
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
}

export const juradosService = new JuradosService();
export default juradosService; 