import { BaseApiService } from "./baseApi";
import { Candidatura, CandidaturaFormData } from "../models/candidatura";
import { APIResponse } from "../models/base";

export class CandidaturasService extends BaseApiService {
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
}

export const candidaturasService = new CandidaturasService();
export default candidaturasService; 