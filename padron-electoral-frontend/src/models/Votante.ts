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