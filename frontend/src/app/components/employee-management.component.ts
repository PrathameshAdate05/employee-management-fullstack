import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "../services/employee.service";
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "../models/employee.model";
import { EmployeeValidator } from "../utils/validators";

@Component({
  selector: "app-employee-management",
  standalone: false,
  templateUrl: "./employee-management.component.html",
  styleUrls: ["./employee-management.component.css"],
})
export class EmployeeManagementComponent implements OnInit {
  @ViewChild("addFormRef") addForm!: ElementRef<HTMLFormElement>;

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = "";
  isLoading: boolean = false;
  private searchTimeout: any;

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedEmployee: Employee | null = null;

  // Form data
  newEmployee: CreateEmployeeRequest = {
    name: "",
    email: "",
    position: "",
    phone: "",
  };

  editEmployee: UpdateEmployeeRequest = {};

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;

    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.employees = response.data.employees;
          this.filteredEmployees = [...this.employees];
        } else {
          const errorMessage =
            response.message || response.error || "Failed to load employees";
          this.toastr.error(errorMessage, "Error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(
          "Error loading employees: " + error.message,
          "Connection Error"
        );
        this.isLoading = false;
      },
    });
  }

  searchEmployees(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.isLoading = true;
    this.employeeService.searchEmployees(this.searchQuery.trim()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.filteredEmployees = response.data.employees;
        } else {
          const errorMessage =
            response.message || response.error || "Search failed";
          this.toastr.error(errorMessage, "Search Error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("Search error: " + error.message, "Search Error");
        this.isLoading = false;
      },
    });
  }

  onSearchInput(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    // Debounce the search to avoid too many API calls
    this.debounceSearch();
  }

  private debounceSearch(): void {
    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a new timeout for search
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300); // 500ms delay
  }

  private performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.isLoading = true;
    this.employeeService.searchEmployees(this.searchQuery.trim()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.filteredEmployees = response.data.employees;
        } else {
          const errorMessage =
            response.message || response.error || "Search failed";
          this.toastr.error(errorMessage, "Search Error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error("Search error: " + error.message, "Search Error");
        this.isLoading = false;
      },
    });
  }

  clearSearch(): void {
    this.searchQuery = "";
    this.filteredEmployees = [...this.employees];
  }

  openAddModal(): void {
    this.resetNewEmployeeForm();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetNewEmployeeForm();
    this.resetFormValidation();
  }

  private resetNewEmployeeForm(): void {
    this.newEmployee = { name: "", email: "", position: "", phone: "" };
  }

  private resetFormValidation(): void {
    // Reset form validation state using ViewChild reference
    if (this.addForm) {
      this.addForm.nativeElement.reset();
      // Remove any validation classes
      const formControls =
        this.addForm.nativeElement.querySelectorAll(".form-control");
      formControls.forEach((control) => {
        control.classList.remove("is-valid", "is-invalid");
      });
    }
  }

  openEditModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.editEmployee = {
      name: employee.name,
      email: employee.email,
      position: employee.position,
      phone: employee.phone,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEmployee = null;
    this.editEmployee = {};
  }

  openDeleteModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedEmployee = null;
  }

  addEmployee(): void {
    const validation = EmployeeValidator.validateEmployeeData(this.newEmployee);
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        this.toastr.warning(error, "Validation Error");
      });
      return;
    }

    this.isLoading = true;
    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.employees.unshift(response.data);
          this.filteredEmployees = [...this.employees];
          this.closeAddModal();
          this.resetFormValidation();
          this.toastr.success(
            `Employee "${response.data.name}" added successfully`,
            "Success"
          );
        } else {
          // Handle API error response with message and error fields
          const errorMessage =
            response.message || response.error || "Failed to create employee";
          this.toastr.error(errorMessage, "Error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        // Handle HTTP error responses (4xx, 5xx status codes)
        let errorMessage = "Error creating employee";

        if (error.error && typeof error.error === "object") {
          // If the error response has the expected format
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.toastr.error(errorMessage, "Error");
        this.isLoading = false;
      },
    });
  }

  updateEmployee(): void {
    if (!this.selectedEmployee) {
      return;
    }

    const validation = EmployeeValidator.validateEmployeeData(
      this.editEmployee
    );
    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        this.toastr.warning(error, "Validation Error");
      });
      return;
    }

    this.isLoading = true;
    this.employeeService
      .updateEmployee(this.selectedEmployee.id!, this.editEmployee)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const index = this.employees.findIndex(
              (emp) => emp.id === this.selectedEmployee!.id
            );
            if (index !== -1) {
              this.employees[index] = response.data;
              this.filteredEmployees = [...this.employees];
            }
            this.closeEditModal();
            this.toastr.success(
              `Employee "${response.data.name}" updated successfully`,
              "Success"
            );
          } else {
            const errorMessage =
              response.message || response.error || "Failed to update employee";
            this.toastr.error(errorMessage, "Error");
          }
          this.isLoading = false;
        },
        error: (error) => {
          // Handle HTTP error responses (4xx, 5xx status codes)
          let errorMessage = "Error updating employee";

          if (error.error && typeof error.error === "object") {
            // If the error response has the expected format
            if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.error) {
              errorMessage = error.error.error;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.toastr.error(errorMessage, "Error");
          this.isLoading = false;
        },
      });
  }

  deleteEmployee(): void {
    if (!this.selectedEmployee) {
      return;
    }

    const employeeName = this.selectedEmployee.name;
    this.isLoading = true;

    this.employeeService.deleteEmployee(this.selectedEmployee.id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.employees = this.employees.filter(
            (emp) => emp.id !== this.selectedEmployee!.id
          );
          this.filteredEmployees = [...this.employees];
          this.closeDeleteModal();
          this.toastr.success(
            `Employee "${employeeName}" deleted successfully`,
            "Success"
          );
        } else {
          const errorMessage =
            response.message || response.error || "Failed to delete employee";
          this.toastr.error(errorMessage, "Error");
        }
        this.isLoading = false;
      },
      error: (error) => {
        // Handle HTTP error responses (4xx, 5xx status codes)
        let errorMessage = "Error deleting employee";

        if (error.error && typeof error.error === "object") {
          // If the error response has the expected format
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.toastr.error(errorMessage, "Error");
        this.isLoading = false;
      },
    });
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
}
