import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { EmployeeManagementComponent } from "./components/employee-management.component";

@NgModule({
  declarations: [AppComponent, EmployeeManagementComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      enableHtml: true,
      newestOnTop: true,
      tapToDismiss: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
