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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface EmployeeListResponse {
  employees: Employee[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
