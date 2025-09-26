// Common types for the application

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  path?: string;
}

// Employee Management System Types
export interface Employee {
  id?: number;
  name: string;
  email: string;
  position: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  position: string;
  phone: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  position?: string;
  phone?: string;
}

export interface SearchEmployeeRequest {
  query?: string;
  position?: string;
  limit?: number;
  offset?: number;
}
