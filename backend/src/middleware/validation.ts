import { Request, Response, NextFunction } from "express";
import { CreateEmployeeRequest, UpdateEmployeeRequest } from "../types";

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

const isValidString = (value: any): boolean => {
  return typeof value === "string" && value.trim().length > 0;
};

// Middleware to validate employee creation data
export const validateCreateEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, position, phone }: CreateEmployeeRequest = req.body;

  // Check required fields
  if (!name || !email || !position || !phone) {
    res.status(400).json({
      success: false,
      error: "Missing required fields",
      message: "Name, email, position, and phone are required",
    });
    return;
  }

  // Validate field types and formats
  if (!isValidString(name)) {
    res.status(400).json({
      success: false,
      error: "Invalid name",
      message: "Name must be a non-empty string",
    });
    return;
  }

  if (!isValidString(email)) {
    res.status(400).json({
      success: false,
      error: "Invalid email",
      message: "Email must be a non-empty string",
    });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({
      success: false,
      error: "Invalid email format",
      message: "Please provide a valid email address",
    });
    return;
  }

  if (!isValidString(position)) {
    res.status(400).json({
      success: false,
      error: "Invalid position",
      message: "Position must be a non-empty string",
    });
    return;
  }

  if (!isValidString(phone)) {
    res.status(400).json({
      success: false,
      error: "Invalid phone",
      message: "Phone must be a non-empty string",
    });
    return;
  }

  if (!isValidPhone(phone)) {
    res.status(400).json({
      success: false,
      error: "Invalid phone number",
      message: "Please provide a valid phone number",
    });
    return;
  }

  next();
};

// Middleware to validate employee update data
export const validateUpdateEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, position, phone }: UpdateEmployeeRequest = req.body;

  // Check if at least one field is provided
  if (
    name === undefined &&
    email === undefined &&
    position === undefined &&
    phone === undefined
  ) {
    res.status(400).json({
      success: false,
      error: "No data to update",
      message: "Please provide at least one field to update",
    });
    return;
  }

  // Validate each provided field
  if (name !== undefined && !isValidString(name)) {
    res.status(400).json({
      success: false,
      error: "Invalid name",
      message: "Name must be a non-empty string",
    });
    return;
  }

  if (email !== undefined) {
    if (!isValidString(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email",
        message: "Email must be a non-empty string",
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        success: false,
        error: "Invalid email format",
        message: "Please provide a valid email address",
      });
      return;
    }
  }

  if (position !== undefined && !isValidString(position)) {
    res.status(400).json({
      success: false,
      error: "Invalid position",
      message: "Position must be a non-empty string",
    });
    return;
  }

  if (phone !== undefined) {
    if (!isValidString(phone)) {
      res.status(400).json({
        success: false,
        error: "Invalid phone",
        message: "Phone must be a non-empty string",
      });
      return;
    }

    if (!isValidPhone(phone)) {
      res.status(400).json({
        success: false,
        error: "Invalid phone number",
        message: "Please provide a valid phone number",
      });
      return;
    }
  }

  next();
};

// Middleware to validate employee ID parameter
export const validateEmployeeId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      success: false,
      error: "Invalid employee ID",
      message: "Employee ID must be a number",
    });
    return;
  }

  next();
};
