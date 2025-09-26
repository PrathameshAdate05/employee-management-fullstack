import { Request, Response } from "express";
import { EmployeeService } from "../services/employeeService";
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  SearchEmployeeRequest,
  ApiResponse,
} from "../types";

export class EmployeeController {
  // Get all employees with optional search and pagination
  static async getEmployees(req: Request, res: Response): Promise<void> {
    try {
      const { query, position, limit, offset } = req.query;

      const searchParams: SearchEmployeeRequest = {
        query: query as string,
        position: position as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const { employees, totalCount } = await EmployeeService.getEmployees(
        searchParams
      );

      const response: ApiResponse = {
        success: true,
        data: {
          employees,
          pagination: {
            total: totalCount,
            limit: searchParams.limit || totalCount,
            offset: searchParams.offset || 0,
            hasMore: searchParams.offset
              ? searchParams.offset + (searchParams.limit || totalCount) <
                totalCount
              : false,
          },
        },
        message: "Employees retrieved successfully",
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch employees",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get employee by ID
  static async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const employee = await EmployeeService.getEmployeeById(id);

      if (!employee) {
        res.status(404).json({
          success: false,
          error: "Employee not found",
          message: `Employee with ID ${id} does not exist`,
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: employee,
        message: "Employee retrieved successfully",
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch employee",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Create new employee
  static async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeData: CreateEmployeeRequest = req.body;
      const newEmployee = await EmployeeService.createEmployee(employeeData);

      const response: ApiResponse = {
        success: true,
        data: newEmployee,
        message: "Employee created successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating employee:", error);

      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        res.status(409).json({
          success: false,
          error: "Email already exists",
          message: "An employee with this email already exists",
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to create employee",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update employee
  static async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateEmployeeRequest = req.body;

      const updatedEmployee = await EmployeeService.updateEmployee(
        id,
        updateData
      );

      const response: ApiResponse = {
        success: true,
        data: updatedEmployee,
        message: "Employee updated successfully",
      };

      res.json(response);
    } catch (error) {
      console.error("Error updating employee:", error);

      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        res.status(409).json({
          success: false,
          error: "Email already exists",
          message: "An employee with this email already exists",
        });
        return;
      }

      if (error instanceof Error && error.message.includes("does not exist")) {
        res.status(404).json({
          success: false,
          error: "Employee not found",
          message: error.message,
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message.includes("No data to update")
      ) {
        res.status(400).json({
          success: false,
          error: "No data to update",
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to update employee",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delete employee
  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deletedId = await EmployeeService.deleteEmployee(id);

      const response: ApiResponse = {
        success: true,
        data: { id: deletedId },
        message: "Employee deleted successfully",
      };

      res.json(response);
    } catch (error) {
      console.error("Error deleting employee:", error);

      if (error instanceof Error && error.message.includes("does not exist")) {
        res.status(404).json({
          success: false,
          error: "Employee not found",
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to delete employee",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
