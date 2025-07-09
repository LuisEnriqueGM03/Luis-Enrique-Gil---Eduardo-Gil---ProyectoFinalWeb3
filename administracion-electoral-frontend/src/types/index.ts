// Base types
export interface BaseModel {
  id: number;
}

// Seccion types
export interface Seccion extends BaseModel {
  nombre: string;
}

export interface SeccionDetail extends Seccion {
  cargos: string[];
  elecciones: string[];
}

export interface SeccionFormData {
  nombre: string;
}

// Cargo types
export interface Cargo extends BaseModel {
  nombre: string;
  secciones_afectadas: Seccion[];
}

export interface CargoFormData {
  nombre: string;
  secciones_afectadas_ids: number[];
}

// Recinto types
export interface Recinto extends BaseModel {
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  capacidad: number;
  horario_apertura: string;
  horario_cierre: string;
}

export interface RecintoDetail extends Recinto {
  mesas: string[];
  total_mesas: number;
}

export interface RecintoFormData {
  nombre: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  capacidad: number;
  horario_apertura: string;
  horario_cierre: string;
}

// Mesa Electoral types
export interface MesaElectoral extends BaseModel {
  numero: number;
  recinto: Recinto;
}

export interface MesaElectoralDetail extends BaseModel {
  numero: number;
  recinto: Recinto;
  jurados: string[];
  total_jurados: number;
}

export interface MesaElectoralFormData {
  numero: number;
  recinto_id: number;
}

// Jurado types
export interface Jurado extends BaseModel {
  nombre_completo: string;
  ci: string;
  mesa: MesaElectoral;
}

export interface JuradoFormData {
  nombre_completo: string;
  ci: string;
  mesa_id: number;
}

// Eleccion types
export type TipoEleccion =
  | "PRESIDENCIAL"
  | "DEPARTAMENTAL"
  | "MUNICIPAL"
  | "JUDICIAL"
  | "LEGISLATIVA";

export interface Eleccion extends BaseModel {
  tipo: TipoEleccion;
  tipo_display: string;
  fecha: string; // ISO date string
  seccion: Seccion;
}

export interface EleccionFormData {
  tipo: TipoEleccion;
  fecha: string;
  seccion_id: number;
}

// Candidatura types
export interface Candidatura extends BaseModel {
  nombre_candidato: string;
  partido_politico: string;
  sigla: string;
  color: string; // Hex color
  cargo: Cargo;
}

export interface CandidaturaFormData {
  nombre_candidato: string;
  partido_politico: string;
  sigla: string;
  color: string;
  cargo_id: number;
}

// Papeleta types
export interface CandidatoSimple {
  nombre_candidato: string;
  partido_politico: string;
  sigla: string;
  color: string;
}

export interface CargoConCandidatos {
  nombre: string;
  candidatos: CandidatoSimple[];
}

export interface Papeleta {
  seccion: string;
  papeleta: CargoConCandidatos[];
}

export interface PapeletaDisponible {
  seccion_id: number;
  seccion_nombre: string;
  url_papeleta: string;
  total_cargos: number;
}

export interface PapeletasResponse {
  papeletas_disponibles: PapeletaDisponible[];
  total_secciones: number;
}

// API Response types
export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface APIError {
  detail?: string;
  error?: string;
  [key: string]: any;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isLoading: boolean;
  isSubmitting: boolean;
}

// Auth types (for future implementation)
export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Map types for geographical features
export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SeccionGeography extends Seccion {
  coordinates?: MapCoordinates[];
  bounds?: MapBounds;
}

export interface RecintoGeography extends Recinto {
  coordinates?: MapCoordinates;
}

// Dashboard statistics types
export interface DashboardStats {
  total_secciones: number;
  total_cargos: number;
  total_recintos: number;
  total_mesas: number;
  total_jurados: number;
  total_elecciones: number;
  total_candidaturas: number;
}

// Table types for data display
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableSort {
  column: string;
  direction: "asc" | "desc";
}

export interface TableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sort: TableSort | null;
  filters: Record<string, any>;
}

// Modal types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current?: boolean;
  children?: NavItem[];
}

// Utility types
export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

export type ActionType = "create" | "read" | "update" | "delete";

export interface CRUDState<T> {
  items: T[];
  currentItem: T | null;
  loadingState: LoadingState;
  error: string | null;
}
