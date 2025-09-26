import { Request, Response, NextFunction } from "express";
import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
} from "../validation";

describe("Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockNext = jest.fn();

    mockRequest = {};
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
  });

  describe("validateCreateEmployee", () => {
    const validEmployee = {
      name: "John Doe",
      email: "john@example.com",
      position: "Developer",
      phone: "1234567890",
    };

    it("should pass validation for valid data", () => {
      mockRequest.body = validEmployee;

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it("should fail validation for missing name", () => {
      mockRequest.body = {
        email: "john@example.com",
        position: "Developer",
        phone: "1234567890",
      };

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Missing required fields",
        message: "Name, email, position, and phone are required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation for missing email", () => {
      mockRequest.body = {
        name: "John Doe",
        position: "Developer",
        phone: "1234567890",
      };

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Missing required fields",
        message: "Name, email, position, and phone are required",
      });
    });

    it("should fail validation for empty name", () => {
      mockRequest.body = {
        name: "",
        email: "john@example.com",
        position: "Developer",
        phone: "1234567890",
      };

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Missing required fields",
        message: "Name, email, position, and phone are required",
      });
    });

    it("should fail validation for invalid email format", () => {
      mockRequest.body = {
        name: "John Doe",
        email: "invalid-email",
        position: "Developer",
        phone: "1234567890",
      };

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid email format",
        message: "Please provide a valid email address",
      });
    });

    it("should fail validation for invalid phone number", () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        position: "Developer",
        phone: "abc",
      };

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid phone number",
        message: "Please provide a valid phone number",
      });
    });

    it("should pass validation for phone with formatting", () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        position: "Developer",
        phone: "+1 (123) 456-7890",
      };

      validateCreateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("validateUpdateEmployee", () => {
    it("should pass validation for valid update data", () => {
      mockRequest.body = {
        name: "John Updated",
        position: "Senior Developer",
      };

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it("should fail validation for no data to update", () => {
      mockRequest.body = {};

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "No data to update",
        message: "Please provide at least one field to update",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation for all undefined fields", () => {
      mockRequest.body = {
        name: undefined,
        email: undefined,
        position: undefined,
        phone: undefined,
      };

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "No data to update",
        message: "Please provide at least one field to update",
      });
    });

    it("should fail validation for empty name", () => {
      mockRequest.body = {
        name: "",
        email: "john@example.com",
      };

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid name",
        message: "Name must be a non-empty string",
      });
    });

    it("should fail validation for invalid email format", () => {
      mockRequest.body = {
        email: "invalid-email",
      };

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid email format",
        message: "Please provide a valid email address",
      });
    });

    it("should fail validation for invalid phone number", () => {
      mockRequest.body = {
        phone: "abc",
      };

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid phone number",
        message: "Please provide a valid phone number",
      });
    });

    it("should pass validation for partial update", () => {
      mockRequest.body = {
        name: "John Updated",
      };

      validateUpdateEmployee(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("validateEmployeeId", () => {
    it("should pass validation for valid ID", () => {
      mockRequest.params = { id: "123" };

      validateEmployeeId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it("should fail validation for non-numeric ID", () => {
      mockRequest.params = { id: "abc" };

      validateEmployeeId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid employee ID",
        message: "Employee ID must be a number",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation for empty ID", () => {
      mockRequest.params = { id: "" };

      validateEmployeeId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Invalid employee ID",
        message: "Employee ID must be a number",
      });
    });

    it("should pass validation for zero ID", () => {
      mockRequest.params = { id: "0" };

      validateEmployeeId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it("should pass validation for negative ID", () => {
      mockRequest.params = { id: "-1" };

      validateEmployeeId(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
