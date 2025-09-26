# Employee Management System

A full-stack employee management application built with Express.js (TypeScript) backend and Angular frontend. This monorepo provides a complete CRUD system for managing employee data with a modern, responsive user interface.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Design Decisions](#design-decisions)
- [Contributing](#contributing)

## 🎯 Project Overview

This Employee Management System is designed to provide a comprehensive solution for managing employee information. It features a clean, modern interface with real-time search capabilities, form validation, and toast notifications for better user experience.

### Key Features:

- **Employee CRUD Operations**: Create, Read, Update, Delete employees
- **Real-time Search**: Search employees by name, email, or phone with debounced input
- **Form Validation**: Client-side and server-side validation with visual feedback
- **Responsive Design**: Mobile-first approach with Bootstrap styling
- **Toast Notifications**: User-friendly feedback using ngx-toastr
- **Professional UI**: Minimalistic design with smooth animations

## 🛠 Tech Stack

### Backend

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **SQLite3** for lightweight database
- **Swagger/OpenAPI** for API documentation
- **ESLint** for code quality

### Frontend

- **Angular 20** (non-standalone components)
- **TypeScript** for type safety
- **Bootstrap 5** for responsive UI
- **Font Awesome** for icons
- **ngx-toastr** for notifications
- **Angular Forms** with validation

## 📁 Project Structure

```
employee-management-fullstack/
├── backend/                          # Express.js Backend
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   └── swagger.ts           # Swagger API documentation
│   │   ├── controllers/              # Route controllers
│   │   │   └── employeeController.ts
│   │   ├── database/                 # Database layer
│   │   │   └── index.ts             # SQLite database operations
│   │   ├── middleware/               # Express middleware
│   │   │   ├── index.ts             # General middleware
│   │   │   └── validation.ts       # Validation middleware
│   │   ├── routes/                  # API routes
│   │   │   └── employees.ts         # Employee routes
│   │   ├── services/                # Business logic layer
│   │   │   └── employeeService.ts
│   │   ├── types/                   # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── index.ts                 # Main server file
│   ├── data/                        # SQLite database files
│   │   └── employees.db
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   └── .gitignore
├── frontend/                         # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # Angular components
│   │   │   │   └── employee-management.component.*
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   │   └── employee.model.ts
│   │   │   ├── services/            # Angular services
│   │   │   │   └── employee.service.ts
│   │   │   ├── utils/               # Utility functions and validators
│   │   │   │   ├── index.ts         # Utility exports
│   │   │   │   └── validators/      # Form validation utilities
│   │   │   │       ├── employee.validator.ts
│   │   │   │       ├── employee.validator.spec.ts
│   │   │   │       └── index.ts
│   │   │   ├── app.component.*      # Root component
│   │   │   └── app.module.ts        # Main module
│   │   ├── styles.css               # Global styles
│   │   └── index.html
│   ├── package.json
│   ├── angular.json
│   ├── tsconfig.json
│   └── .gitignore
├── .gitignore                        # Root-level gitignore
└── README.md                         # This file
```

## ✨ Features

### Backend Features

- **RESTful API** with proper HTTP status codes
- **Clean Architecture** (Routes → Middleware → Controller → Service → Database)
- **Input Validation** with comprehensive error handling
- **Swagger Documentation** with interactive API explorer
- **SQLite Database** with automatic table creation
- **CORS Support** for frontend integration

### Frontend Features

- **Real-time Search** with 300ms debouncing
- **Form Validation** with visual feedback
- **Toast Notifications** for user feedback
- **Responsive Design** for all screen sizes
- **Professional UI** with smooth animations
- **Modal Dialogs** for add/edit operations
- **Confirmation Dialogs** for delete operations

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd employee-management-fullstack
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

````

## 🏃‍♂️ Running the Application

### Backend Server

```bash
cd backend
npm run dev
````

The backend server will start on `http://localhost:3000`

### Frontend Development Server

```bash
cd frontend
ng serve
```

The frontend will start on `http://localhost:4200`

### Access Points

- **Frontend Application**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs

## 📚 API Documentation

The API documentation is available at `http://localhost:3000/api/docs` when the backend server is running. It provides:

- **Interactive API Explorer**
- **Request/Response Examples**
- **Schema Definitions**
- **Try It Out** functionality

### Available Endpoints

| Method | Endpoint             | Description                            |
| ------ | -------------------- | -------------------------------------- |
| GET    | `/api/employees`     | Get all employees with optional search |
| GET    | `/api/employees/:id` | Get employee by ID                     |
| POST   | `/api/employees`     | Create new employee                    |
| PUT    | `/api/employees/:id` | Update employee                        |
| DELETE | `/api/employees/:id` | Delete employee                        |

## 🧪 Testing

### Frontend Testing

The frontend includes comprehensive unit tests using Jasmine and Karma:

```bash
cd frontend
npm test
```

#### Test Files Created:

- **`employee.service.spec.ts`**: Tests for the Employee Service API calls
- **`employee-management.component.spec.ts`**: Tests for the main component functionality
- **`app.component.spec.ts`**: Tests for the root app component

#### Test Coverage:

- ✅ **Service Testing**: HTTP requests, API responses, error handling (31 tests)
- ✅ **Component Testing**: User interactions, form validation, modal management
- ✅ **Unit Testing**: Individual methods and functions
- ✅ **Integration Testing**: Component-service interactions
- ✅ **All Tests Passing**: 31/31 tests successful

#### Running Tests:

```bash
# Interactive mode (opens browser)
npm test

# Headless mode (CI/CD friendly)
npm run test:ci
```

### Backend Testing

The backend includes comprehensive unit and integration tests using Jest:

```bash
cd backend
npm test
```

#### Test Files Created:

- **`database.test.ts`**: Tests for SQLite database operations
- **`employeeService.test.ts`**: Tests for business logic and data validation
- **`employeeController.test.ts`**: Tests for HTTP request/response handling
- **`validation.test.ts`**: Tests for input validation middleware
- **`integration.test.ts`**: End-to-end API testing with Supertest

#### Test Coverage:

- ✅ **Database Layer**: SQLite operations, CRUD functionality, search and pagination (15 tests)
- ✅ **Service Layer**: Business logic, data validation, error handling (18 tests)
- ✅ **Controller Layer**: HTTP request/response handling, status codes (18 tests)
- ✅ **Middleware**: Input validation, error handling (15 tests)
- ✅ **Integration Tests**: End-to-end API testing with Supertest (8 tests)
- ✅ **Test Status**: 91/91 tests passing (all tests successful)

#### Running Tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 🎨 Design Decisions

### Architecture Choices

#### 1. **Clean Architecture Pattern**

- **Routes**: Handle HTTP requests and responses
- **Middleware**: Validation and error handling
- **Controllers**: Business logic coordination
- **Services**: Core business logic
- **Database**: Data persistence layer

#### 2. **Monorepo Structure**

- **Shared Configuration**: Single `.gitignore` for both projects
- **Independent Deployment**: Backend and frontend can be deployed separately
- **Code Organization**: Clear separation of concerns

#### 3. **Database Choice: SQLite**

- **Lightweight**: No external database server required
- **File-based**: Easy to backup and version control
- **Development-friendly**: Perfect for local development

#### 4. **Frontend Architecture**

- **Non-standalone Components**: Traditional Angular module structure
- **Service Layer**: Centralized API communication
- **Reactive Forms**: Built-in validation and error handling

### UI/UX Decisions

#### 1. **Real-time Search**

- **Debounced Input**: 300ms delay to prevent excessive API calls
- **Performance Optimized**: Reduces server load
- **User-friendly**: Immediate feedback without button clicks

#### 2. **Toast Notifications**

- **Non-intrusive**: Doesn't block the UI
- **Professional**: Clean, modern appearance
- **Informative**: Clear success/error messages

#### 3. **Form Validation**

- **Client-side**: Immediate feedback
- **Visual Indicators**: Color-coded input states
- **Comprehensive**: Email format, phone validation, required fields

#### 4. **Responsive Design**

- **Mobile-first**: Works on all screen sizes
- **Grid Layout**: Flexible employee card display
- **Touch-friendly**: Appropriate button sizes for mobile

### Technical Decisions

#### 1. **TypeScript Everywhere**

- **Type Safety**: Prevents runtime errors
- **Better IDE Support**: Enhanced development experience
- **Maintainability**: Easier refactoring and debugging

#### 2. **Validation Strategy**

- **Dual Validation**: Both client and server-side
- **Consistent Error Messages**: Unified error handling
- **User Experience**: Clear, actionable error messages

#### 3. **Error Handling**

- **Graceful Degradation**: App continues to work with errors
- **User Feedback**: Toast notifications for all operations
- **Logging**: Server-side error logging for debugging
