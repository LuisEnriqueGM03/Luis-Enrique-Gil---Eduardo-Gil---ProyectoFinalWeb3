

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface CrearUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface ActualizarUsuarioRequest {
  id: number;
  nombre?: string;
  email?: string;
  password?: string;
  rol?: string;
}

export interface UsuarioListResponse {
  success: boolean;
  message: string;
  usuarios: Usuario[];
  total: number;
}

export interface UsuarioResponse {
  success: boolean;
  message: string;
  usuario?: Usuario;
} 