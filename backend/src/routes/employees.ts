import { Router } from "express";
import { EmployeeController } from "../controllers/employeeController";
import {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
} from "../middleware/validation";

const router = Router();

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     description: Retrieve a list of employees with optional search and pagination
 *     tags: [Employees]
 *     parameters:
 *       - $ref: '#/components/parameters/Query'
 *       - $ref: '#/components/parameters/Position'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/Offset'
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/EmployeeListResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     employees:
 *                       - id: 1
 *                         name: "John Doe"
 *                         email: "john.doe@company.com"
 *                         position: "Software Engineer"
 *                         phone: "+1234567890"
 *                         created_at: "2024-01-01T00:00:00.000Z"
 *                         updated_at: "2024-01-01T00:00:00.000Z"
 *                     pagination:
 *                       total: 1
 *                       limit: 10
 *                       offset: 0
 *                       hasMore: false
 *                   message: "Employees retrieved successfully"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", EmployeeController.getEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     description: Retrieve a specific employee by their unique identifier
 *     tags: [Employees]
 *     parameters:
 *       - $ref: '#/components/parameters/EmployeeId'
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     name: "John Doe"
 *                     email: "john.doe@company.com"
 *                     position: "Software Engineer"
 *                     phone: "+1234567890"
 *                     created_at: "2024-01-01T00:00:00.000Z"
 *                     updated_at: "2024-01-01T00:00:00.000Z"
 *                   message: "Employee retrieved successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", validateEmployeeId, EmployeeController.getEmployeeById);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Create new employee
 *     description: Create a new employee with the provided information
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeRequest'
 *           examples:
 *             example1:
 *               summary: Example employee
 *               value:
 *                 name: "John Doe"
 *                 email: "john.doe@company.com"
 *                 position: "Software Engineer"
 *                 phone: "+1234567890"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *             examples:
 *               success:
 *                 summary: Employee created
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     name: "John Doe"
 *                     email: "john.doe@company.com"
 *                     position: "Software Engineer"
 *                     phone: "+1234567890"
 *                     created_at: "2024-01-01T00:00:00.000Z"
 *                     updated_at: "2024-01-01T00:00:00.000Z"
 *                   message: "Employee created successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", validateCreateEmployee, EmployeeController.createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Update employee
 *     description: Update an existing employee's information
 *     tags: [Employees]
 *     parameters:
 *       - $ref: '#/components/parameters/EmployeeId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeRequest'
 *           examples:
 *             example1:
 *               summary: Update position and phone
 *               value:
 *                 position: "Senior Software Engineer"
 *                 phone: "+1234567891"
 *             example2:
 *               summary: Update all fields
 *               value:
 *                 name: "John Smith"
 *                 email: "john.smith@company.com"
 *                 position: "Lead Software Engineer"
 *                 phone: "+1234567892"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Employee'
 *             examples:
 *               success:
 *                 summary: Employee updated
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                     name: "John Doe"
 *                     email: "john.doe@company.com"
 *                     position: "Senior Software Engineer"
 *                     phone: "+1234567891"
 *                     created_at: "2024-01-01T00:00:00.000Z"
 *                     updated_at: "2024-01-01T12:00:00.000Z"
 *                   message: "Employee updated successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put(
  "/:id",
  validateEmployeeId,
  validateUpdateEmployee,
  EmployeeController.updateEmployee
);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete employee
 *     description: Delete an employee by their unique identifier
 *     tags: [Employees]
 *     parameters:
 *       - $ref: '#/components/parameters/EmployeeId'
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *             examples:
 *               success:
 *                 summary: Employee deleted
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 1
 *                   message: "Employee deleted successfully"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", validateEmployeeId, EmployeeController.deleteEmployee);

export default router;
