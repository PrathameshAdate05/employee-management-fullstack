import { EmployeeValidator, ValidationResult } from "./employee.validator";
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "../../models/employee.model";

describe("EmployeeValidator", () => {
  const validEmployee: CreateEmployeeRequest = {
    name: "John Doe",
    email: "john@example.com",
    position: "Developer",
    phone: "1234567890",
  };

  describe("validateEmployeeData", () => {
    it("should return valid for correct employee data", () => {
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(validEmployee);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return invalid for missing name", () => {
      const invalidEmployee = { ...validEmployee, name: "" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
    });

    it("should return invalid for missing email", () => {
      const invalidEmployee = { ...validEmployee, email: "" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Email is required");
    });

    it("should return invalid for invalid email format", () => {
      const invalidEmployee = { ...validEmployee, email: "invalid-email" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Please enter a valid email address");
    });

    it("should return invalid for missing position", () => {
      const invalidEmployee = { ...validEmployee, position: "" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Position is required");
    });

    it("should return invalid for missing phone", () => {
      const invalidEmployee = { ...validEmployee, phone: "" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Phone number is required");
    });

    it("should return invalid for invalid phone format", () => {
      const invalidEmployee = { ...validEmployee, phone: "123" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Please enter a valid phone number");
    });

    it("should return invalid for phone with invalid characters", () => {
      const invalidEmployee = { ...validEmployee, phone: "abc123def" };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Please enter a valid phone number");
    });

    it("should return invalid for multiple validation errors", () => {
      const invalidEmployee: CreateEmployeeRequest = {
        name: "",
        email: "invalid-email",
        position: "",
        phone: "123",
      };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
      expect(result.errors).toContain("Please enter a valid email address");
      expect(result.errors).toContain("Position is required");
      expect(result.errors).toContain("Please enter a valid phone number");
    });

    it("should handle whitespace-only values as invalid", () => {
      const invalidEmployee = { ...validEmployee, name: "   " };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(invalidEmployee);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
    });

    it("should work with UpdateEmployeeRequest", () => {
      const updateEmployee: UpdateEmployeeRequest = {
        name: "Updated Name",
        email: "updated@example.com",
        position: "Senior Developer",
        phone: "9876543210",
      };
      const result: ValidationResult =
        EmployeeValidator.validateEmployeeData(updateEmployee);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe("isValidEmployee", () => {
    it("should return true for valid employee", () => {
      const result = EmployeeValidator.isValidEmployee(validEmployee);
      expect(result).toBe(true);
    });

    it("should return false for employee with missing fields", () => {
      const invalidEmployee = { ...validEmployee, name: "" };
      const result = EmployeeValidator.isValidEmployee(invalidEmployee);
      expect(result).toBe(false);
    });

    it("should return false for employee with whitespace-only fields", () => {
      const invalidEmployee = { ...validEmployee, name: "   " };
      const result = EmployeeValidator.isValidEmployee(invalidEmployee);
      expect(result).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid email", () => {
      expect(EmployeeValidator.isValidEmail("test@example.com")).toBe(true);
      expect(EmployeeValidator.isValidEmail("user.name@domain.co.uk")).toBe(
        true
      );
      expect(EmployeeValidator.isValidEmail("test+tag@example.org")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(EmployeeValidator.isValidEmail("invalid-email")).toBe(false);
      expect(EmployeeValidator.isValidEmail("@example.com")).toBe(false);
      expect(EmployeeValidator.isValidEmail("test@")).toBe(false);
      expect(EmployeeValidator.isValidEmail("test.example.com")).toBe(false);
      expect(EmployeeValidator.isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("should return true for valid phone numbers", () => {
      expect(EmployeeValidator.isValidPhone("1234567890")).toBe(true);
      expect(EmployeeValidator.isValidPhone("+1234567890")).toBe(true);
      expect(EmployeeValidator.isValidPhone("123-456-7890")).toBe(true);
      expect(EmployeeValidator.isValidPhone("(123) 456-7890")).toBe(true);
      expect(EmployeeValidator.isValidPhone("123 456 7890")).toBe(true);
    });

    it("should return false for invalid phone numbers", () => {
      expect(EmployeeValidator.isValidPhone("123")).toBe(false);
      expect(EmployeeValidator.isValidPhone("abc123def")).toBe(false);
      expect(EmployeeValidator.isValidPhone("0123456789")).toBe(false); // starts with 0
      expect(EmployeeValidator.isValidPhone("")).toBe(false);
    });
  });

  describe("isNotEmpty", () => {
    it("should return true for non-empty strings", () => {
      expect(EmployeeValidator.isNotEmpty("test")).toBe(true);
      expect(EmployeeValidator.isNotEmpty("  test  ")).toBe(true);
    });

    it("should return false for empty strings", () => {
      expect(EmployeeValidator.isNotEmpty("")).toBe(false);
      expect(EmployeeValidator.isNotEmpty("   ")).toBe(false);
    });
  });
});
