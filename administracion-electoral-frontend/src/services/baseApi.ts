import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export class BaseApiService {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }

  protected async get<T>(endpoint: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(endpoint);
    return response.data;
  }

  protected async post<T, D>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(endpoint, data);
    return response.data;
  }

  protected async put<T, D>(endpoint: string, data: D): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(endpoint, data);
    return response.data;
  }

  protected async delete(endpoint: string): Promise<void> {
    await this.api.delete(endpoint);
  }
} 