import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employee.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [EmployeeService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEmployees', () => {
    it('should return employees', () => {
      const mockEmployees: Employee[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Developer',
          phone: '1234567890',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ];

      const mockResponse = {
        success: true,
        data: { employees: mockEmployees, total: 1 }
      };

      service.getEmployees().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.employees).toEqual(mockEmployees);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/employees');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle search parameters', () => {
      const searchQuery = 'john';
      const mockResponse = {
        success: true,
        data: { employees: [], total: 0 }
      };

      service.searchEmployees(searchQuery).subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`http://localhost:3000/api/employees?query=${searchQuery}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee by id', () => {
      const mockEmployee: Employee = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        phone: '1234567890',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      const mockResponse = {
        success: true,
        data: mockEmployee
      };

      service.getEmployeeById(1).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockEmployee);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/employees/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createEmployee', () => {
    it('should create new employee', () => {
      const newEmployee: CreateEmployeeRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        position: 'Designer',
        phone: '0987654321'
      };

      const mockResponse = {
        success: true,
        data: {
          id: 2,
          ...newEmployee,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      };

      service.createEmployee(newEmployee).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.name).toBe(newEmployee.name);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/employees');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEmployee);
      req.flush(mockResponse);
    });
  });

  describe('updateEmployee', () => {
    it('should update employee', () => {
      const updateData: UpdateEmployeeRequest = {
        name: 'John Updated',
        position: 'Senior Developer'
      };

      const mockResponse = {
        success: true,
        data: {
          id: 1,
          name: 'John Updated',
          email: 'john@example.com',
          position: 'Senior Developer',
          phone: '1234567890',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      };

      service.updateEmployee(1, updateData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.name).toBe(updateData.name);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/employees/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee', () => {
      const mockResponse = {
        success: true,
        message: 'Employee deleted successfully'
      };

      service.deleteEmployee(1).subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/employees/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});
