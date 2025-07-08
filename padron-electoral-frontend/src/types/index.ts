export interface Recinto {
  id?: number;
  nombre: string;
  ubicacion: string;
}

export interface Votante {
  id?: number;
  codigo_unico?: string;
  ci: string;
  nombre_completo: string;
  direccion: string;
  foto_carnet_anverso?: File | string;
  foto_carnet_reverso?: File | string;
  foto_votante?: File | string;
  recinto: number;
  recinto_nombre?: string;
  fecha_registro?: string;
}

export interface ConsultaPadron {
  nombre_completo: string;
  direccion: string;
  recinto_nombre: string;
}

export interface AuthUser {
  username: string;
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
