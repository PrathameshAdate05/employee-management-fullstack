import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "../../models/employee.model";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class EmployeeValidator {
  /**
   * Validates employee data for both create and update operations
   * @param employee - Employee data to validate
   * @returns Validation result with isValid flag and error messages
   */
  static validateEmployeeData(
    employee: CreateEmployeeRequest | UpdateEmployeeRequest
  ): ValidationResult {
    const errors: string[] = [];

    // Required field validation
    if (!employee.name || employee.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!employee.email || employee.email.trim().length === 0) {
      errors.push("Email is required");
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employee.email.trim())) {
        errors.push("Please enter a valid email address");
      }
    }

    if (!employee.position || employee.position.trim().length === 0) {
      errors.push("Position is required");
    }

    if (!employee.phone || employee.phone.trim().length === 0) {
      errors.push("Phone number is required");
    } else {
      // Phone number validation (basic)
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = employee.phone.replace(/[\s\-\(\)]/g, "");
      if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
        errors.push("Please enter a valid phone number");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Checks if employee data has all required fields filled
   * @param employee - Employee data to check
   * @returns True if all required fields are present
   */
  static isValidEmployee(
    employee: CreateEmployeeRequest | UpdateEmployeeRequest
  ): boolean {
    const requiredFields = ["name", "email", "position", "phone"];
    return requiredFields.every((field) => {
      const value = employee[field as keyof typeof employee];
      return value && value.toString().trim().length > 0;
    });
  }

  /**
   * Validates email format
   * @param email - Email to validate
   * @returns True if email format is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validates phone number format
   * @param phone - Phone number to validate
   * @returns True if phone format is valid
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }

  /**
   * Validates if a string is not empty after trimming
   * @param value - String to validate
   * @returns True if string is not empty
   */
  static isNotEmpty(value: string): boolean {
    return Boolean(value && value.trim().length > 0);
  }
}
