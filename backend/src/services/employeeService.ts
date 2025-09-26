import { database } from "../database";
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  SearchEmployeeRequest,
} from "../types";

export class EmployeeService {
  // Create a new employee
  static async createEmployee(
    employeeData: CreateEmployeeRequest
  ): Promise<Employee> {
    const employeeId = await database.createEmployee({
      name: employeeData.name.trim(),
      email: employeeData.email.trim().toLowerCase(),
      position: employeeData.position.trim(),
      phone: employeeData.phone.trim(),
    });

    const newEmployee = await database.getEmployeeById(employeeId);
    if (!newEmployee) {
      throw new Error("Failed to retrieve created employee");
    }

    return newEmployee;
  }

  // Get all employees with optional search and pagination
  static async getEmployees(searchParams?: SearchEmployeeRequest): Promise<{
    employees: Employee[];
    totalCount: number;
  }> {
    const employees = await database.getEmployees(searchParams);
    const totalCount = await database.getEmployeeCount(searchParams);

    return { employees, totalCount };
  }

  // Get employee by ID
  static async getEmployeeById(id: number): Promise<Employee | null> {
    return await database.getEmployeeById(id);
  }

  // Update employee
  static async updateEmployee(
    id: number,
    updates: UpdateEmployeeRequest
  ): Promise<Employee> {
    // Check if employee exists
    const existingEmployee = await database.getEmployeeById(id);
    if (!existingEmployee) {
      throw new Error(`Employee with ID ${id} does not exist`);
    }

    // Prepare update data
    const updateData: UpdateEmployeeRequest = {};

    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.email !== undefined)
      updateData.email = updates.email.trim().toLowerCase();
    if (updates.position !== undefined)
      updateData.position = updates.position.trim();
    if (updates.phone !== undefined) updateData.phone = updates.phone.trim();

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("No data to update");
    }

    const updated = await database.updateEmployee(id, updateData);
    if (!updated) {
      throw new Error("Employee could not be updated");
    }

    const updatedEmployee = await database.getEmployeeById(id);
    if (!updatedEmployee) {
      throw new Error("Failed to retrieve updated employee");
    }

    return updatedEmployee;
  }

  // Delete employee
  static async deleteEmployee(id: number): Promise<number> {
    // Check if employee exists
    const existingEmployee = await database.getEmployeeById(id);
    if (!existingEmployee) {
      throw new Error(`Employee with ID ${id} does not exist`);
    }

    const deleted = await database.deleteEmployee(id);
    if (!deleted) {
      throw new Error("Employee could not be deleted");
    }

    return id;
  }

  // Check if email exists (for validation)
  static async emailExists(email: string): Promise<boolean> {
    const employees = await database.getEmployees({ query: email });
    return employees.some(
      (emp) => emp.email.toLowerCase() === email.toLowerCase()
    );
  }
}
