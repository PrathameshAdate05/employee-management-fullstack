import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { EmployeeManagementComponent } from "./employee-management.component";
import { EmployeeService } from "../services/employee.service";
import { Employee } from "../models/employee.model";

describe("EmployeeManagementComponent", () => {
  let component: EmployeeManagementComponent;
  let fixture: ComponentFixture<EmployeeManagementComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const mockEmployees: Employee[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      position: "Developer",
      phone: "1234567890",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      position: "Designer",
      phone: "0987654321",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
    },
  ];

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj("EmployeeService", [
      "getEmployees",
      "searchEmployees",
      "getEmployeeById",
      "createEmployee",
      "updateEmployee",
      "deleteEmployee",
    ]);

    await TestBed.configureTestingModule({
      declarations: [EmployeeManagementComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [{ provide: EmployeeService, useValue: employeeServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeManagementComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(
      EmployeeService
    ) as jasmine.SpyObj<EmployeeService>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should load employees on init", () => {
      employeeService.getEmployees.and.returnValue(
        of({
          success: true,
          data: {
            employees: mockEmployees,
            pagination: {
              total: mockEmployees.length,
              limit: 10,
              offset: 0,
              hasMore: false,
            },
          },
        })
      );

      component.ngOnInit();

      expect(employeeService.getEmployees).toHaveBeenCalled();
      expect(component.employees).toEqual(mockEmployees);
      expect(component.filteredEmployees).toEqual(mockEmployees);
    });
  });

  describe("searchEmployees", () => {
    beforeEach(() => {
      component.employees = mockEmployees;
      component.filteredEmployees = mockEmployees;
    });

    it("should show all employees when search query is empty", () => {
      component.searchQuery = "";
      component.searchEmployees();

      expect(component.filteredEmployees).toEqual(mockEmployees);
    });

    it("should call search API when search query is provided", () => {
      component.searchQuery = "john";
      employeeService.searchEmployees.and.returnValue(
        of({
          success: true,
          data: {
            employees: [mockEmployees[0]],
            pagination: {
              total: 1,
              limit: 10,
              offset: 0,
              hasMore: false,
            },
          },
        })
      );

      component.searchEmployees();

      expect(employeeService.searchEmployees).toHaveBeenCalledWith("john");
    });
  });

  describe("onSearchInput", () => {
    beforeEach(() => {
      component.employees = mockEmployees;
      component.filteredEmployees = mockEmployees;
    });

    it("should show all employees when search query is empty", () => {
      component.searchQuery = "";
      component.onSearchInput();

      expect(component.filteredEmployees).toEqual(mockEmployees);
    });

    it("should trigger debounced search when query is provided", (done) => {
      component.searchQuery = "john";
      employeeService.searchEmployees.and.returnValue(
        of({
          success: true,
          data: {
            employees: [mockEmployees[0]],
            pagination: {
              total: 1,
              limit: 10,
              offset: 0,
              hasMore: false,
            },
          },
        })
      );

      component.onSearchInput();

      // Wait for debounce timeout
      setTimeout(() => {
        expect(employeeService.searchEmployees).toHaveBeenCalledWith("john");
        done();
      }, 350);
    });
  });

  describe("clearSearch", () => {
    beforeEach(() => {
      component.employees = mockEmployees;
      component.filteredEmployees = [mockEmployees[0]];
      component.searchQuery = "john";
    });

    it("should clear search query and show all employees", () => {
      component.clearSearch();

      expect(component.searchQuery).toBe("");
      expect(component.filteredEmployees).toEqual(mockEmployees);
    });
  });

  describe("addEmployee", () => {
    beforeEach(() => {
      component.newEmployee = {
        name: "New Employee",
        email: "new@example.com",
        position: "Tester",
        phone: "1111111111",
      };
    });

    it("should create employee when validation passes", () => {
      employeeService.createEmployee.and.returnValue(
        of({
          success: true,
          data: {
            id: 3,
            ...component.newEmployee,
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          },
        })
      );

      component.addEmployee();

      expect(employeeService.createEmployee).toHaveBeenCalledWith({
        name: "New Employee",
        email: "new@example.com",
        position: "Tester",
        phone: "1111111111",
      });
    });

    it("should not create employee when validation fails", () => {
      // Set invalid data
      component.newEmployee = {
        name: "",
        email: "invalid-email",
        position: "",
        phone: "123",
      };

      component.addEmployee();

      expect(employeeService.createEmployee).not.toHaveBeenCalled();
    });
  });

  describe("updateEmployee", () => {
    beforeEach(() => {
      component.selectedEmployee = mockEmployees[0];
      component.editEmployee = {
        name: "Updated Name",
        email: "updated@example.com",
        position: "Senior Developer",
        phone: "1234567890",
      };
    });

    it("should update employee when validation passes", () => {
      employeeService.updateEmployee.and.returnValue(
        of({
          success: true,
          data: {
            ...mockEmployees[0],
            name: "Updated Name",
            position: "Senior Developer",
          },
        })
      );

      component.updateEmployee();

      expect(employeeService.updateEmployee).toHaveBeenCalledWith(1, {
        name: "Updated Name",
        email: "updated@example.com",
        position: "Senior Developer",
        phone: "1234567890",
      });
    });

    it("should not update employee when no employee is selected", () => {
      component.selectedEmployee = null;

      component.updateEmployee();

      expect(employeeService.updateEmployee).not.toHaveBeenCalled();
    });
  });

  describe("deleteEmployee", () => {
    beforeEach(() => {
      component.selectedEmployee = mockEmployees[0];
      component.employees = mockEmployees;
      component.filteredEmployees = mockEmployees;
    });

    it("should delete employee", () => {
      employeeService.deleteEmployee.and.returnValue(of({ success: true }));

      component.deleteEmployee();

      expect(employeeService.deleteEmployee).toHaveBeenCalledWith(1);
      expect(component.employees).toEqual([mockEmployees[1]]);
      expect(component.filteredEmployees).toEqual([mockEmployees[1]]);
    });

    it("should not delete employee when no employee is selected", () => {
      component.selectedEmployee = null;

      component.deleteEmployee();

      expect(employeeService.deleteEmployee).not.toHaveBeenCalled();
    });
  });

  describe("getInitials", () => {
    it("should return initials for single name", () => {
      const initials = component.getInitials("John");
      expect(initials).toBe("J");
    });

    it("should return initials for full name", () => {
      const initials = component.getInitials("John Doe");
      expect(initials).toBe("JD");
    });

    it("should return initials for multiple names", () => {
      const initials = component.getInitials("John Michael Doe");
      expect(initials).toBe("JM");
    });

    it("should handle empty name", () => {
      const initials = component.getInitials("");
      expect(initials).toBe("");
    });
  });

  describe("Modal Management", () => {
    it("should open add modal", () => {
      component.openAddModal();

      expect(component.showAddModal).toBe(true);
      expect(component.newEmployee).toEqual({
        name: "",
        email: "",
        position: "",
        phone: "",
      });
    });

    it("should close add modal", () => {
      component.showAddModal = true;
      component.closeAddModal();

      expect(component.showAddModal).toBe(false);
    });

    it("should open edit modal", () => {
      component.openEditModal(mockEmployees[0]);

      expect(component.showEditModal).toBe(true);
      expect(component.selectedEmployee).toBe(mockEmployees[0]);
      expect(component.editEmployee).toEqual({
        name: mockEmployees[0].name,
        email: mockEmployees[0].email,
        position: mockEmployees[0].position,
        phone: mockEmployees[0].phone,
      });
    });

    it("should open delete modal", () => {
      component.openDeleteModal(mockEmployees[0]);

      expect(component.showDeleteModal).toBe(true);
      expect(component.selectedEmployee).toBe(mockEmployees[0]);
    });
  });
});
