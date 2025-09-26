import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ApiResponse,
  EmployeeListResponse,
} from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apiUrl = "http://localhost:3000/api/employees";

  constructor(private http: HttpClient) {}

  // Get all employees with optional search and pagination
  getEmployees(searchParams?: {
    query?: string;
    position?: string;
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<EmployeeListResponse>> {
    let params = new HttpParams();

    if (searchParams?.query) {
      params = params.set("query", searchParams.query);
    }
    if (searchParams?.position) {
      params = params.set("position", searchParams.position);
    }
    if (searchParams?.limit) {
      params = params.set("limit", searchParams.limit.toString());
    }
    if (searchParams?.offset) {
      params = params.set("offset", searchParams.offset.toString());
    }

    return this.http.get<ApiResponse<EmployeeListResponse>>(this.apiUrl, {
      params,
    });
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  // Create new employee
  createEmployee(
    employee: CreateEmployeeRequest
  ): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, employee);
  }

  // Update employee
  updateEmployee(
    id: number,
    employee: UpdateEmployeeRequest
  ): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  // Delete employee
  deleteEmployee(id: number): Observable<ApiResponse<{ id: number }>> {
    return this.http.delete<ApiResponse<{ id: number }>>(
      `${this.apiUrl}/${id}`
    );
  }

  // Search employees
  searchEmployees(
    query: string
  ): Observable<ApiResponse<EmployeeListResponse>> {
    return this.getEmployees({ query });
  }

  // Filter employees by position
  filterByPosition(
    position: string
  ): Observable<ApiResponse<EmployeeListResponse>> {
    return this.getEmployees({ position });
  }
}
