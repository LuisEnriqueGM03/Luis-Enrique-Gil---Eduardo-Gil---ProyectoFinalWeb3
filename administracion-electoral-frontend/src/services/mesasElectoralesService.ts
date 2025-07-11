import { BaseApiService } from "./baseApi";
import { MesaElectoral, MesaElectoralFormData } from "../models/mesaElectoral";
import { APIResponse } from "../models/base";

export class MesasElectoralesService extends BaseApiService {
  async getMesasElectorales(): Promise<APIResponse<MesaElectoral>> {
    return this.get<APIResponse<MesaElectoral>>("/mesas-electorales/");
  }

  async getMesaElectoral(id: number): Promise<MesaElectoral> {
    return this.get<MesaElectoral>(`/mesas-electorales/${id}/`);
  }

  async createMesaElectoral(data: MesaElectoralFormData): Promise<MesaElectoral> {
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
}

export const mesasElectoralesService = new MesasElectoralesService();
export default mesasElectoralesService; 