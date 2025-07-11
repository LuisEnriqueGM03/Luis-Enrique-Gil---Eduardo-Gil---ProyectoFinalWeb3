import React from 'react';

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