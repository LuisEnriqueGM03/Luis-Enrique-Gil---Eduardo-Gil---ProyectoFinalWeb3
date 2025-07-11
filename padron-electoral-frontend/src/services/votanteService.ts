import axios, { AxiosResponse } from "axios";
import { Votante } from "../models/Votante";

const BASE_URL = "http://localhost:8001/api";

const votanteApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVotantes = async (): Promise<Votante[]> => {
  const response: AxiosResponse<Votante[]> = await votanteApi.get("/votantes/");
  return response.data;
};

export const createVotante = async (votante: FormData): Promise<Votante> => {
  const response: AxiosResponse<Votante> = await votanteApi.post("/votantes/", votante, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateVotante = async (id: number, votante: FormData): Promise<Votante> => {
  const response: AxiosResponse<Votante> = await votanteApi.put(`/votantes/${id}/`, votante, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteVotante = async (id: number): Promise<void> => {
  await votanteApi.delete(`/votantes/${id}/`);
}; 