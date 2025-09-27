import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { Employee } from "../types";

class Database {
  private db: sqlite3.Database;

  constructor() {
    const dbPath = path.join(__dirname, "../../data/employees.db");
    const dbDir = path.dirname(dbPath);

    // Ensure the data directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log("Created data directory:", dbDir);
    }

    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to SQLite database");
        this.initializeTables();
      }
    });
  }

  private initializeTables(): void {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        position TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Employees table initialized successfully");
      }
    });
  }

  // Create a new employee
  createEmployee(
    employee: Omit<Employee, "id" | "created_at" | "updated_at">
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO employees (name, email, position, phone)
        VALUES (?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [employee.name, employee.email, employee.position, employee.phone],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // Get all employees with optional search and pagination
  getEmployees(searchParams?: {
    query?: string;
    position?: string;
    limit?: number;
    offset?: number;
  }): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM employees";
      const params: any[] = [];
      const conditions: string[] = [];

      if (searchParams?.query) {
        conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
        const searchTerm = `%${searchParams.query}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (searchParams?.position) {
        conditions.push("position = ?");
        params.push(searchParams.position);
      }

      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      sql += " ORDER BY created_at DESC";

      if (searchParams?.limit) {
        sql += " LIMIT ?";
        params.push(searchParams.limit.toString());
      }

      if (searchParams?.offset) {
        sql += " OFFSET ?";
        params.push(searchParams.offset.toString());
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Employee[]);
        }
      });
    });
  }

  // Get employee by ID
  getEmployeeById(id: number): Promise<Employee | null> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM employees WHERE id = ?";

      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve((row as Employee) || null);
        }
      });
    });
  }

  // Update employee
  updateEmployee(
    id: number,
    updates: Partial<Omit<Employee, "id" | "created_at" | "updated_at">>
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).filter(
        (key) => updates[key as keyof typeof updates] !== undefined
      );

      if (fields.length === 0) {
        resolve(false);
        return;
      }

      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const sql = `UPDATE employees SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

      const values = fields.map(
        (field) => updates[field as keyof typeof updates]
      );
      values.push(id.toString());

      this.db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Delete employee
  deleteEmployee(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM employees WHERE id = ?";

      this.db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  // Get total count of employees (for pagination)
  getEmployeeCount(searchParams?: {
    query?: string;
    position?: string;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT COUNT(*) as count FROM employees";
      const params: any[] = [];
      const conditions: string[] = [];

      if (searchParams?.query) {
        conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
        const searchTerm = `%${searchParams.query}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (searchParams?.position) {
        conditions.push("position = ?");
        params.push(searchParams.position);
      }

      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }

      this.db.get(sql, params, (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  }

  // Close database connection
  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("Database connection closed");
      }
    });
  }
}

// Create and export a singleton instance
export const database = new Database();
