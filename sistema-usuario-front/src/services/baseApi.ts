export class BaseApiService {
  protected readonly BASE_URL = "https://localhost:7145/api";
  protected async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      throw new Error('Error en la petición: ' + (error as Error).message);
    }
  }
} 