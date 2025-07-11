import { Usuario, CrearUsuarioRequest, ActualizarUsuarioRequest, UsuarioListResponse, UsuarioResponse } from '../models/Usuario';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7145/api';
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export class UsuarioService {
  async obtenerUsuarios(): Promise<UsuarioListResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return await response.json();
  }

  async obtenerUsuarioPorId(id: number): Promise<UsuarioResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener usuario');
    return await response.json();
  }

  async crearUsuario(data: CrearUsuarioRequest): Promise<UsuarioResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (response.status === 201) {
      try {
        const json = await response.json();
        if (typeof json === 'object' && json !== null && 'success' in json) {
          return json;
        }
        return { success: true, message: 'Usuario creado correctamente', usuario: json };
      } catch {
        return { success: true, message: 'Usuario creado correctamente' };
      }
    }
    if (!response.ok) throw new Error('Error al crear usuario');
    return await response.json();
  }

  async actualizarUsuario(data: ActualizarUsuarioRequest): Promise<UsuarioResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${data.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      try {
        const json = await response.json();
        if (typeof json === 'object' && json !== null && 'success' in json) {
          return json;
        }
        return { success: true, message: 'Usuario actualizado correctamente', usuario: json };
      } catch {
        return { success: true, message: 'Usuario actualizado correctamente' };
      }
    }
    if (!response.ok) throw new Error('Error al actualizar usuario');
    return await response.json();
  }

  async eliminarUsuario(id: number): Promise<UsuarioResponse | undefined> {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (response.status === 204) {
      return { success: true, message: 'Usuario eliminado correctamente' };
    }
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return await response.json();
  }
}

export const usuarioService = new UsuarioService(); 