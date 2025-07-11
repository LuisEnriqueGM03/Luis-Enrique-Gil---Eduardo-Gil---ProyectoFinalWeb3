import { BaseApiService } from "./baseApi";
import { Cargo, CargoFormData } from "../models/cargo";
import { APIResponse } from "../models/base";

export class CargosService extends BaseApiService {
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
}

export const cargosService = new CargosService();
export default cargosService; 