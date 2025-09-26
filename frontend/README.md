# Employee Management Frontend

Angular frontend application for the Employee Management System.

## Features

- ✅ Angular 17 with standalone: false
- ✅ Bootstrap 5 styling
- ✅ Font Awesome icons
- ✅ Employee CRUD operations
- ✅ Search functionality
- ✅ Responsive grid layout
- ✅ Modal forms for add/edit
- ✅ Confirmation dialogs
- ✅ Loading states and error handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- Angular CLI

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── employee-management.component.ts
│   │   ├── employee-management.component.html
│   │   └── employee-management.component.css
│   ├── services/
│   │   └── employee.service.ts
│   ├── models/
│   │   └── employee.model.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.css
│   └── app.module.ts
├── styles.css
├── index.html
└── main.ts
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api/employees`.

### Available Operations

- **GET** `/api/employees` - List all employees
- **GET** `/api/employees?query=search` - Search employees
- **POST** `/api/employees` - Create new employee
- **PUT** `/api/employees/:id` - Update employee
- **DELETE** `/api/employees/:id` - Delete employee

## UI Components

### Employee Grid

- Responsive card layout
- Employee avatars with initials
- Hover effects for action buttons
- Empty state handling

### Search Bar

- Real-time search functionality
- Clear search option
- Search by name, email, or phone

### Modals

- Add Employee modal
- Edit Employee modal
- Delete confirmation modal
- Form validation

## Styling

- Bootstrap 5 for responsive layout
- Custom CSS for enhanced styling
- Font Awesome icons
- Smooth animations and transitions
- Mobile-responsive design

## Development

The application uses Angular's traditional module-based architecture (standalone: false) as requested.

### Key Technologies

- **Angular 17** - Frontend framework
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **RxJS** - Reactive programming
- **TypeScript** - Type safety
