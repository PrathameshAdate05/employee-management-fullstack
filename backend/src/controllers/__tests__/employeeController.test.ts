import { Request, Response } from "express";
import { EmployeeController } from "../employeeController";
import { EmployeeService } from "../../services/employeeService";
import { CreateEmployeeRequest, UpdateEmployeeRequest } from "../../types";

// Mock the EmployeeService
jest.mock("../../services/employeeService", () => ({
  EmployeeService: {
    getEmployees: jest.fn(),
    getEmployeeById: jest.fn(),
    createEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
  },
}));

const mockEmployeeService = EmployeeService as jest.Mocked<
  typeof EmployeeService
>;

describe("EmployeeController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  const mockEmployee = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Developer",
    phone: "1234567890",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  };

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    jest.clearAllMocks();
  });

  describe("getEmployees", () => {
    it("should get all employees successfully", async () => {
      mockRequest.query = {};
      mockEmployeeService.getEmployees.mockResolvedValue({
        employees: [mockEmployee],
        totalCount: 1,
      });

      await EmployeeController.getEmployees(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmployeeService.getEmployees).toHaveBeenCalledWith({});
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          employees: [mockEmployee],
          pagination: {
            total: 1,
            limit: 1,
            offset: 0,
            hasMore: false,
          },
        },
        message: "Employees retrieved successfully",
      });
    });

    it("should handle search parameters", async () => {
      mockRequest.query = {
        query: "john",
        position: "Developer",
        limit: "10",
        offset: "0",
      };
      mockEmployeeService.getEmployees.mockResolvedValue({
        employees: [mockEmployee],
        totalCount: 1,
      });

      await EmployeeController.getEmployees(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmployeeService.getEmployees).toHaveBeenCalledWith({
        query: "john",
        position: "Developer",
        limit: 10,
        offset: 0,
      });
    });

    it("should handle service errors", async () => {
      mockRequest.query = {};
      mockEmployeeService.getEmployees.mockRejectedValue(
        new Error("Database error")
      );

      await EmployeeController.getEmployees(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Failed to fetch employees",
        message: "Database error",
      });
    });
  });

  describe("getEmployeeById", () => {
    it("should get employee by ID successfully", async () => {
      mockRequest.params = { id: "1" };
      mockEmployeeService.getEmployeeById.mockResolvedValue(mockEmployee);

      await EmployeeController.getEmployeeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockEmployee,
        message: "Employee retrieved successfully",
      });
    });

    it("should return 404 for non-existent employee", async () => {
      mockRequest.params = { id: "999" };
      mockEmployeeService.getEmployeeById.mockResolvedValue(null);

      await EmployeeController.getEmployeeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Employee not found",
        message: "Employee with ID 999 does not exist",
      });
    });

    it("should handle service errors", async () => {
      mockRequest.params = { id: "1" };
      mockEmployeeService.getEmployeeById.mockRejectedValue(
        new Error("Database error")
      );

      await EmployeeController.getEmployeeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Failed to fetch employee",
        message: "Database error",
      });
    });
  });

  describe("createEmployee", () => {
    const createRequest: CreateEmployeeRequest = {
      name: "John Doe",
      email: "john@example.com",
      position: "Developer",
      phone: "1234567890",
    };

    it("should create employee successfully", async () => {
      mockRequest.body = createRequest;
      mockEmployeeService.createEmployee.mockResolvedValue(mockEmployee);

      await EmployeeController.createEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmployeeService.createEmployee).toHaveBeenCalledWith(
        createRequest
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockEmployee,
        message: "Employee created successfully",
      });
    });

    it("should handle duplicate email error", async () => {
      mockRequest.body = createRequest;
      mockEmployeeService.createEmployee.mockRejectedValue(
        new Error("UNIQUE constraint failed: employees.email")
      );

      await EmployeeController.createEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(409);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Email already exists",
        message: "An employee with this email already exists",
      });
    });

    it("should handle other service errors", async () => {
      mockRequest.body = createRequest;
      mockEmployeeService.createEmployee.mockRejectedValue(
        new Error("Database error")
      );

      await EmployeeController.createEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Failed to create employee",
        message: "Database error",
      });
    });
  });

  describe("updateEmployee", () => {
    const updateRequest: UpdateEmployeeRequest = {
      name: "John Updated",
      position: "Senior Developer",
    };

    it("should update employee successfully", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = updateRequest;
      const updatedEmployee = { ...mockEmployee, ...updateRequest };
      mockEmployeeService.updateEmployee.mockResolvedValue(updatedEmployee);

      await EmployeeController.updateEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(
        1,
        updateRequest
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: updatedEmployee,
        message: "Employee updated successfully",
      });
    });

    it("should handle duplicate email error", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = updateRequest;
      mockEmployeeService.updateEmployee.mockRejectedValue(
        new Error("UNIQUE constraint failed: employees.email")
      );

      await EmployeeController.updateEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(409);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Email already exists",
        message: "An employee with this email already exists",
      });
    });

    it("should handle employee not found error", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = updateRequest;
      mockEmployeeService.updateEmployee.mockRejectedValue(
        new Error("Employee with ID 999 does not exist")
      );

      await EmployeeController.updateEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Employee not found",
        message: "Employee with ID 999 does not exist",
      });
    });

    it("should handle no data to update error", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {};
      mockEmployeeService.updateEmployee.mockRejectedValue(
        new Error("No data to update")
      );

      await EmployeeController.updateEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "No data to update",
        message: "No data to update",
      });
    });

    it("should handle other service errors", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = updateRequest;
      mockEmployeeService.updateEmployee.mockRejectedValue(
        new Error("Database error")
      );

      await EmployeeController.updateEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Failed to update employee",
        message: "Database error",
      });
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee successfully", async () => {
      mockRequest.params = { id: "1" };
      mockEmployeeService.deleteEmployee.mockResolvedValue(1);

      await EmployeeController.deleteEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(1);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: { id: 1 },
        message: "Employee deleted successfully",
      });
    });

    it("should handle employee not found error", async () => {
      mockRequest.params = { id: "999" };
      mockEmployeeService.deleteEmployee.mockRejectedValue(
        new Error("Employee with ID 999 does not exist")
      );

      await EmployeeController.deleteEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Employee not found",
        message: "Employee with ID 999 does not exist",
      });
    });

    it("should handle other service errors", async () => {
      mockRequest.params = { id: "1" };
      mockEmployeeService.deleteEmployee.mockRejectedValue(
        new Error("Database error")
      );

      await EmployeeController.deleteEmployee(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Failed to delete employee",
        message: "Database error",
      });
    });
  });
});
