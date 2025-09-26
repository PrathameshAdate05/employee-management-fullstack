import { EmployeeService } from "../employeeService";
import { database } from "../../database";
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  SearchEmployeeRequest,
} from "../../types";

// Mock the database
jest.mock("../../database", () => ({
  database: {
    createEmployee: jest.fn(),
    getEmployeeById: jest.fn(),
    getEmployees: jest.fn(),
    getEmployeeCount: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
  },
}));

const mockDatabase = database as jest.Mocked<typeof database>;

describe("EmployeeService", () => {
  const mockEmployee = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Developer",
    phone: "1234567890",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  };

  const mockCreateRequest: CreateEmployeeRequest = {
    name: "John Doe",
    email: "john@example.com",
    position: "Developer",
    phone: "1234567890",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEmployee", () => {
    it("should create a new employee", async () => {
      mockDatabase.createEmployee.mockResolvedValue(1);
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await EmployeeService.createEmployee(mockCreateRequest);

      expect(mockDatabase.createEmployee).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        position: "Developer",
        phone: "1234567890",
      });
      expect(mockDatabase.getEmployeeById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEmployee);
    });

    it("should trim and lowercase email", async () => {
      const requestWithSpaces = {
        ...mockCreateRequest,
        name: "  John Doe  ",
        email: "  JOHN@EXAMPLE.COM  ",
        position: "  Developer  ",
        phone: "  1234567890  ",
      };

      mockDatabase.createEmployee.mockResolvedValue(1);
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);

      await EmployeeService.createEmployee(requestWithSpaces);

      expect(mockDatabase.createEmployee).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        position: "Developer",
        phone: "1234567890",
      });
    });

    it("should throw error if employee retrieval fails", async () => {
      mockDatabase.createEmployee.mockResolvedValue(1);
      mockDatabase.getEmployeeById.mockResolvedValue(null);

      await expect(
        EmployeeService.createEmployee(mockCreateRequest)
      ).rejects.toThrow("Failed to retrieve created employee");
    });
  });

  describe("getEmployees", () => {
    it("should get all employees", async () => {
      const mockEmployees = [mockEmployee];
      const mockTotalCount = 1;

      mockDatabase.getEmployees.mockResolvedValue(mockEmployees);
      mockDatabase.getEmployeeCount.mockResolvedValue(mockTotalCount);

      const result = await EmployeeService.getEmployees();

      expect(mockDatabase.getEmployees).toHaveBeenCalledWith(undefined);
      expect(mockDatabase.getEmployeeCount).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({
        employees: mockEmployees,
        totalCount: mockTotalCount,
      });
    });

    it("should get employees with search parameters", async () => {
      const searchParams: SearchEmployeeRequest = {
        query: "john",
        position: "Developer",
        limit: 10,
        offset: 0,
      };

      const mockEmployees = [mockEmployee];
      const mockTotalCount = 1;

      mockDatabase.getEmployees.mockResolvedValue(mockEmployees);
      mockDatabase.getEmployeeCount.mockResolvedValue(mockTotalCount);

      const result = await EmployeeService.getEmployees(searchParams);

      expect(mockDatabase.getEmployees).toHaveBeenCalledWith(searchParams);
      expect(mockDatabase.getEmployeeCount).toHaveBeenCalledWith(searchParams);
      expect(result).toEqual({
        employees: mockEmployees,
        totalCount: mockTotalCount,
      });
    });
  });

  describe("getEmployeeById", () => {
    it("should get employee by ID", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);

      const result = await EmployeeService.getEmployeeById(1);

      expect(mockDatabase.getEmployeeById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEmployee);
    });

    it("should return null for non-existent employee", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(null);

      const result = await EmployeeService.getEmployeeById(999);

      expect(result).toBeNull();
    });
  });

  describe("updateEmployee", () => {
    const updateRequest: UpdateEmployeeRequest = {
      name: "John Updated",
      position: "Senior Developer",
    };

    it("should update employee", async () => {
      const updatedEmployee = {
        ...mockEmployee,
        name: "John Updated",
        position: "Senior Developer",
      };

      mockDatabase.getEmployeeById
        .mockResolvedValueOnce(mockEmployee) // First call for existence check
        .mockResolvedValueOnce(updatedEmployee); // Second call after update
      mockDatabase.updateEmployee.mockResolvedValue(true);

      const result = await EmployeeService.updateEmployee(1, updateRequest);

      expect(mockDatabase.getEmployeeById).toHaveBeenCalledWith(1);
      expect(mockDatabase.updateEmployee).toHaveBeenCalledWith(1, {
        name: "John Updated",
        position: "Senior Developer",
      });
      expect(result).toEqual(updatedEmployee);
    });

    it("should trim update data", async () => {
      const updateRequestWithSpaces: UpdateEmployeeRequest = {
        name: "  John Updated  ",
        email: "  JOHN.UPDATED@EXAMPLE.COM  ",
        position: "  Senior Developer  ",
        phone: "  0987654321  ",
      };

      const updatedEmployee = {
        ...mockEmployee,
        name: "John Updated",
        email: "john.updated@example.com",
        position: "Senior Developer",
        phone: "0987654321",
      };

      mockDatabase.getEmployeeById
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(updatedEmployee);
      mockDatabase.updateEmployee.mockResolvedValue(true);

      await EmployeeService.updateEmployee(1, updateRequestWithSpaces);

      expect(mockDatabase.updateEmployee).toHaveBeenCalledWith(1, {
        name: "John Updated",
        email: "john.updated@example.com",
        position: "Senior Developer",
        phone: "0987654321",
      });
    });

    it("should throw error if employee does not exist", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(null);

      await expect(
        EmployeeService.updateEmployee(999, updateRequest)
      ).rejects.toThrow("Employee with ID 999 does not exist");
    });

    it("should throw error if no data to update", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);

      await expect(EmployeeService.updateEmployee(1, {})).rejects.toThrow(
        "No data to update"
      );
    });

    it("should throw error if update fails", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);
      mockDatabase.updateEmployee.mockResolvedValue(false);

      await expect(
        EmployeeService.updateEmployee(1, updateRequest)
      ).rejects.toThrow("Employee could not be updated");
    });

    it("should throw error if retrieval after update fails", async () => {
      mockDatabase.getEmployeeById
        .mockResolvedValueOnce(mockEmployee)
        .mockResolvedValueOnce(null);
      mockDatabase.updateEmployee.mockResolvedValue(true);

      await expect(
        EmployeeService.updateEmployee(1, updateRequest)
      ).rejects.toThrow("Failed to retrieve updated employee");
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);
      mockDatabase.deleteEmployee.mockResolvedValue(true);

      const result = await EmployeeService.deleteEmployee(1);

      expect(mockDatabase.getEmployeeById).toHaveBeenCalledWith(1);
      expect(mockDatabase.deleteEmployee).toHaveBeenCalledWith(1);
      expect(result).toBe(1);
    });

    it("should throw error if employee does not exist", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(null);

      await expect(EmployeeService.deleteEmployee(999)).rejects.toThrow(
        "Employee with ID 999 does not exist"
      );
    });

    it("should throw error if deletion fails", async () => {
      mockDatabase.getEmployeeById.mockResolvedValue(mockEmployee);
      mockDatabase.deleteEmployee.mockResolvedValue(false);

      await expect(EmployeeService.deleteEmployee(1)).rejects.toThrow(
        "Employee could not be deleted"
      );
    });
  });

  describe("emailExists", () => {
    it("should return true if email exists", async () => {
      mockDatabase.getEmployees.mockResolvedValue([mockEmployee]);

      const result = await EmployeeService.emailExists("john@example.com");

      expect(mockDatabase.getEmployees).toHaveBeenCalledWith({
        query: "john@example.com",
      });
      expect(result).toBe(true);
    });

    it("should return false if email does not exist", async () => {
      mockDatabase.getEmployees.mockResolvedValue([]);

      const result = await EmployeeService.emailExists(
        "nonexistent@example.com"
      );

      expect(result).toBe(false);
    });

    it("should be case insensitive", async () => {
      mockDatabase.getEmployees.mockResolvedValue([mockEmployee]);

      const result = await EmployeeService.emailExists("JOHN@EXAMPLE.COM");

      expect(result).toBe(true);
    });
  });
});
