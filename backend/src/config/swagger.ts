import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Employee Management System API",
    version: "1.0.0",
    description:
      "A comprehensive API for managing employees with CRUD operations, search functionality, and SQLite database integration.",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.example.com",
      description: "Production server",
    },
  ],
  components: {
    schemas: {
      Employee: {
        type: "object",
        required: ["name", "email", "position", "phone"],
        properties: {
          id: {
            type: "integer",
            description: "Unique identifier for the employee",
            example: 1,
          },
          name: {
            type: "string",
            description: "Full name of the employee",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email address of the employee",
            example: "john.doe@company.com",
          },
          position: {
            type: "string",
            description: "Job position of the employee",
            example: "Software Engineer",
          },
          phone: {
            type: "string",
            description: "Phone number of the employee",
            example: "+1234567890",
          },
          created_at: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the employee was created",
            example: "2024-01-01T00:00:00.000Z",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the employee was last updated",
            example: "2024-01-01T00:00:00.000Z",
          },
        },
      },
      CreateEmployeeRequest: {
        type: "object",
        required: ["name", "email", "position", "phone"],
        properties: {
          name: {
            type: "string",
            description: "Full name of the employee",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email address of the employee",
            example: "john.doe@company.com",
          },
          position: {
            type: "string",
            description: "Job position of the employee",
            example: "Software Engineer",
          },
          phone: {
            type: "string",
            description: "Phone number of the employee",
            example: "+1234567890",
          },
        },
      },
      UpdateEmployeeRequest: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Full name of the employee",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            description: "Email address of the employee",
            example: "john.doe@company.com",
          },
          position: {
            type: "string",
            description: "Job position of the employee",
            example: "Senior Software Engineer",
          },
          phone: {
            type: "string",
            description: "Phone number of the employee",
            example: "+1234567891",
          },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Indicates if the request was successful",
            example: true,
          },
          data: {
            type: "object",
            description: "Response data",
          },
          message: {
            type: "string",
            description: "Response message",
            example: "Operation completed successfully",
          },
          error: {
            type: "string",
            description: "Error message if the request failed",
            example: "Validation failed",
          },
        },
      },
      EmployeeListResponse: {
        type: "object",
        properties: {
          employees: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Employee",
            },
          },
          pagination: {
            type: "object",
            properties: {
              total: {
                type: "integer",
                description: "Total number of employees",
                example: 100,
              },
              limit: {
                type: "integer",
                description: "Number of employees per page",
                example: 10,
              },
              offset: {
                type: "integer",
                description: "Number of employees to skip",
                example: 0,
              },
              hasMore: {
                type: "boolean",
                description: "Whether there are more employees to load",
                example: true,
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "string",
            description: "Error type",
            example: "Validation Error",
          },
          message: {
            type: "string",
            description: "Error message",
            example: "Invalid input data",
          },
        },
      },
    },
    parameters: {
      EmployeeId: {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
        },
        description: "Employee ID",
        example: 1,
      },
      Query: {
        name: "query",
        in: "query",
        schema: {
          type: "string",
        },
        description: "Search query for name, email, or phone",
        example: "john",
      },
      Position: {
        name: "position",
        in: "query",
        schema: {
          type: "string",
        },
        description: "Filter by position",
        example: "Software Engineer",
      },
      Limit: {
        name: "limit",
        in: "query",
        schema: {
          type: "integer",
          minimum: 1,
          maximum: 100,
        },
        description: "Number of results per page",
        example: 10,
      },
      Offset: {
        name: "offset",
        in: "query",
        schema: {
          type: "integer",
          minimum: 0,
        },
        description: "Number of results to skip",
        example: 0,
      },
    },
    responses: {
      Success: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ApiResponse",
            },
          },
        },
      },
      BadRequest: {
        description: "Bad request - Invalid input",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              error: "Validation Error",
              message: "Invalid input data",
            },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              error: "Employee not found",
              message: "Employee with ID 1 does not exist",
            },
          },
        },
      },
      Conflict: {
        description: "Conflict - Resource already exists",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              error: "Email already exists",
              message: "An employee with this email already exists",
            },
          },
        },
      },
      InternalServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              error: "Internal Server Error",
              message: "Something went wrong",
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Employees",
      description: "Employee management operations",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);
