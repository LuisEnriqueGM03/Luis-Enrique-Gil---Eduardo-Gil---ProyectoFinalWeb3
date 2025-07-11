import axios, { AxiosResponse } from "axios";
import { ConsultaPadron } from "../models/ConsultaPadron";

const BASE_URL = "http://localhost:8001/api";

const consultaApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const consultarPadron = async (ci: string): Promise<ConsultaPadron> => {
  const response: AxiosResponse<ConsultaPadron> = await consultaApi.get(`/consulta-padron/?ci=${ci}`);
  return response.data;
}; 