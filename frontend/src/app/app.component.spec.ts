import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";
import { EmployeeManagementComponent } from "./components/employee-management.component";
import { EmployeeService } from "./services/employee.service";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, EmployeeManagementComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [EmployeeService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have correct title", () => {
    expect(component.title).toBe("Employee Management System");
  });

  it("should render employee management component", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("app-employee-management")).toBeTruthy();
  });
});
