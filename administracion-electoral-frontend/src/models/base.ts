// Base types
export interface BaseModel {
  id: number;
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

// Utility types
export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

export type ActionType = "create" | "read" | "update" | "delete";

export interface CRUDState<T> {
  items: T[];
  currentItem: T | null;
  loadingState: LoadingState;
  error: string | null;
} 