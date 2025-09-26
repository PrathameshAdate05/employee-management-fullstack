import { database } from "../index";
import { Employee } from "../../types";

describe("Database", () => {
  const getMockEmployee = (): Omit<
    Employee,
    "id" | "created_at" | "updated_at"
  > => ({
    name: "John Doe",
    email: `john.test.${Date.now()}.${Math.random()
      .toString(36)
      .substr(2, 9)}@example.com`,
    position: "Developer",
    phone: "1234567890",
  });

  describe("createEmployee", () => {
    it("should create a new employee", async () => {
      const mockEmployee = getMockEmployee();
      const employeeId = await database.createEmployee(mockEmployee);

      expect(employeeId).toBeGreaterThan(0);

      const createdEmployee = await database.getEmployeeById(employeeId);
      expect(createdEmployee).toBeTruthy();
      expect(createdEmployee?.name).toBe(mockEmployee.name);
      expect(createdEmployee?.email).toBe(mockEmployee.email);
      expect(createdEmployee?.position).toBe(mockEmployee.position);
      expect(createdEmployee?.phone).toBe(mockEmployee.phone);
    });

    it("should throw error for duplicate email", async () => {
      const mockEmployee = getMockEmployee();
      await database.createEmployee(mockEmployee);

      await expect(
        database.createEmployee({
          ...mockEmployee,
          name: "Jane Doe",
        })
      ).rejects.toThrow();
    });
  });

  describe("getEmployees", () => {
    it("should get all employees", async () => {
      // Create test employees with unique emails
      const timestamp = Date.now();
      await database.createEmployee({
        name: "John Doe",
        email: `john.test.${timestamp}@example.com`,
        position: "Developer",
        phone: "1234567890",
      });
      await database.createEmployee({
        name: "Jane Smith",
        email: `jane.test.${timestamp}@example.com`,
        position: "Designer",
        phone: "0987654321",
      });

      const employees = await database.getEmployees();

      expect(employees.length).toBeGreaterThanOrEqual(2);
      // Check that both employees exist (order may vary due to timing)
      const names = employees.map((emp) => emp.name);
      expect(names).toContain("John Doe");
      expect(names).toContain("Jane Smith");
    });

    it("should search employees by query", async () => {
      // Create test employee with unique email
      const timestamp = Date.now();
      await database.createEmployee({
        name: "John Search",
        email: `john.search.${timestamp}@example.com`,
        position: "Developer",
        phone: "1234567890",
      });

      const employees = await database.getEmployees({ query: "john search" });

      expect(employees.length).toBeGreaterThanOrEqual(1);
      expect(
        employees.some((emp) => emp.name.toLowerCase().includes("john search"))
      ).toBe(true);
    });

    it("should search employees by email", async () => {
      // Create test employee with unique email
      const timestamp = Date.now();
      const testEmail = `jane.search.${timestamp}@example.com`;
      await database.createEmployee({
        name: "Jane Search",
        email: testEmail,
        position: "Designer",
        phone: "0987654321",
      });

      const employees = await database.getEmployees({
        query: testEmail,
      });

      expect(employees.length).toBeGreaterThanOrEqual(1);
      expect(employees.some((emp) => emp.email === testEmail)).toBe(true);
    });

    it("should search employees by phone", async () => {
      // Create test employee with unique email
      const timestamp = Date.now();
      const testPhone = `123456789${timestamp % 1000}`;
      await database.createEmployee({
        name: "John Phone",
        email: `john.phone.${timestamp}@example.com`,
        position: "Developer",
        phone: testPhone,
      });

      const employees = await database.getEmployees({ query: testPhone });

      expect(employees.length).toBeGreaterThanOrEqual(1);
      expect(employees.some((emp) => emp.phone === testPhone)).toBe(true);
    });

    it("should filter employees by position", async () => {
      // Create test employee with unique email
      const timestamp = Date.now();
      await database.createEmployee({
        name: "John Position",
        email: `john.position.${timestamp}@example.com`,
        position: "Developer",
        phone: "1234567890",
      });

      const employees = await database.getEmployees({ position: "Developer" });

      expect(employees.length).toBeGreaterThanOrEqual(1);
      expect(employees.some((emp) => emp.position === "Developer")).toBe(true);
    });

    it("should apply pagination", async () => {
      const employees = await database.getEmployees({ limit: 1, offset: 0 });

      expect(employees.length).toBeLessThanOrEqual(1);
      if (employees.length > 0) {
        expect(employees[0]).toBeDefined();
      }
    });

    it("should apply pagination with offset", async () => {
      const employees = await database.getEmployees({ limit: 1, offset: 1 });

      expect(employees.length).toBeLessThanOrEqual(1);
      if (employees.length > 0) {
        expect(employees[0]).toBeDefined();
      }
    });
  });

  describe("getEmployeeById", () => {
    it("should get employee by ID", async () => {
      const mockEmployee = getMockEmployee();
      const employeeId = await database.createEmployee(mockEmployee);

      const employee = await database.getEmployeeById(employeeId);

      expect(employee).toBeTruthy();
      expect(employee?.id).toBe(employeeId);
      expect(employee?.name).toBe("John Doe");
    });

    it("should return null for non-existent employee", async () => {
      const employee = await database.getEmployeeById(999);

      expect(employee).toBeNull();
    });
  });

  describe("updateEmployee", () => {
    it("should update employee", async () => {
      const mockEmployee = getMockEmployee();
      const employeeId = await database.createEmployee(mockEmployee);

      const updates = {
        name: "John Updated",
        position: "Senior Developer",
      };

      const result = await database.updateEmployee(employeeId, updates);

      expect(result).toBe(true);

      const updatedEmployee = await database.getEmployeeById(employeeId);
      expect(updatedEmployee?.name).toBe("John Updated");
      expect(updatedEmployee?.position).toBe("Senior Developer");
      expect(updatedEmployee?.email).toBeDefined(); // Email should still exist
    });

    it("should update email", async () => {
      const mockEmployee = getMockEmployee();
      const employeeId = await database.createEmployee(mockEmployee);

      const updates = {
        email: `john.updated.${Date.now()}@example.com`,
      };

      const result = await database.updateEmployee(employeeId, updates);

      expect(result).toBe(true);

      const updatedEmployee = await database.getEmployeeById(employeeId);
      expect(updatedEmployee?.email).toBe(updates.email);
    });

    it("should return false for empty updates", async () => {
      const mockEmployee = getMockEmployee();
      const employeeId = await database.createEmployee(mockEmployee);

      const result = await database.updateEmployee(employeeId, {});

      expect(result).toBe(false);
    });

    it("should return false for non-existent employee", async () => {
      const updates = { name: "Updated Name" };

      const result = await database.updateEmployee(999, updates);

      expect(result).toBe(false);
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee", async () => {
      const mockEmployee = getMockEmployee();
      const employeeId = await database.createEmployee(mockEmployee);

      const result = await database.deleteEmployee(employeeId);

      expect(result).toBe(true);

      const employee = await database.getEmployeeById(employeeId);
      expect(employee).toBeNull();
    });

    it("should return false for non-existent employee", async () => {
      const result = await database.deleteEmployee(999);

      expect(result).toBe(false);
    });
  });

  describe("getEmployeeCount", () => {
    it("should get total count", async () => {
      const count = await database.getEmployeeCount();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should get count with search query", async () => {
      // Create test employee with unique email
      const timestamp = Date.now();
      await database.createEmployee({
        name: "John Count",
        email: `john.count.${timestamp}@example.com`,
        position: "Developer",
        phone: "1234567890",
      });

      const count = await database.getEmployeeCount({ query: "john count" });

      expect(count).toBeGreaterThanOrEqual(1);
    });

    it("should get count with position filter", async () => {
      // Create test employee with unique email
      const timestamp = Date.now();
      await database.createEmployee({
        name: "John Count Position",
        email: `john.count.position.${timestamp}@example.com`,
        position: "Developer",
        phone: "1234567890",
      });

      const count = await database.getEmployeeCount({ position: "Developer" });

      expect(count).toBeGreaterThanOrEqual(1);
    });
  });
});
