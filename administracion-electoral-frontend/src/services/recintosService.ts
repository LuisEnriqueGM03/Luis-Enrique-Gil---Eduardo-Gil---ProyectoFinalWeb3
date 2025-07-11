import { BaseApiService } from "./baseApi";
import { Recinto, RecintoFormData } from "../models/recinto";
import { APIResponse } from "../models/base";

export class RecintosService extends BaseApiService {
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
}

export const recintosService = new RecintosService();
export default recintosService; 