import axios, { AxiosResponse } from "axios";
import { Recinto } from "../models/Recinto";

const BASE_URL = "http://localhost:8000/api";

const recintoApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRecintos = async (): Promise<Recinto[]> => {
  const response = await recintoApi.get("/recintos/");
  return Array.isArray(response.data) ? response.data : response.data.results;
};

export const getRecintoById = async (id: number): Promise<Recinto> => {
  const response: AxiosResponse<Recinto> = await recintoApi.get(`/recintos/${id}/`);
  return response.data;
}; 