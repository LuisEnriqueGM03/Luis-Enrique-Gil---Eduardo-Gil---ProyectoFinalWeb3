import { BaseApiService } from "./baseApi";
import { Papeleta, PapeletasResponse } from "../models/papeleta";

export class PapeletasService extends BaseApiService {
  async getPapeletasDisponibles(): Promise<PapeletasResponse> {
    return this.get<PapeletasResponse>("/papeletas/");
  }

  async getPapeletaPorSeccion(seccionId: number): Promise<Papeleta> {
    return this.get<Papeleta>(`/papeletas/${seccionId}/generar/`);
  }
}

export const papeletasService = new PapeletasService();
export default papeletasService; 