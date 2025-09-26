# Employee Management System Backend

A TypeScript-based Express.js backend API for an employee management system with SQLite database.

## Features

- ✅ Express.js with TypeScript
- ✅ SQLite database integration
- ✅ Employee CRUD operations (Create, Read, Update, Delete)
- ✅ Employee search functionality
- ✅ Data validation and error handling
- ✅ Security middleware (Helmet)
- ✅ CORS enabled
- ✅ Request logging
- ✅ Environment configuration
- ✅ ESLint configuration
- ✅ Health check endpoint
- ✅ Swagger API documentation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp env.example .env
```

3. Update the `.env` file with your configuration.

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3000/api/docs`

The Swagger documentation includes:

- Complete API reference
- Interactive testing interface
- Request/response examples
- Schema definitions
- Error codes and descriptions

### Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## API Endpoints

### Health Check

- `GET /api/health` - Returns server health status
- `GET /` - Returns API information

### Documentation

- `GET /api/docs` - Interactive Swagger UI documentation

### Employee Management

- `GET /api/employees` - Get all employees (with optional search and pagination)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Query Parameters for GET /api/employees

- `query` - Search in name, email, or phone
- `position` - Filter by position
- `limit` - Number of results per page
- `offset` - Number of results to skip

### Employee Data Structure

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@company.com",
  "position": "Software Engineer",
  "phone": "+1234567890",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
src/
├── index.ts          # Main server file
├── routes/           # API routes
│   ├── index.ts      # General API routes
│   └── employees.ts  # Employee CRUD routes
├── controllers/      # Business logic controllers
│   └── employeeController.ts
├── services/         # Service layer for business logic
│   └── employeeService.ts
├── middleware/       # Custom middleware
│   ├── index.ts      # General middleware
│   └── validation.ts # Validation middleware
├── config/           # Configuration files
│   └── swagger.ts    # Swagger documentation config
├── database/         # Database connection and queries
│   └── index.ts
└── types/           # TypeScript type definitions
    └── index.ts
data/
└── employees.db     # SQLite database file (auto-created)
```

## Architecture

The project follows a clean architecture pattern:

- **Routes** → **Middleware** → **Controllers** → **Services** → **Database**
- **Routes**: Define API endpoints and apply middleware
- **Middleware**: Handle validation, authentication, logging
- **Controllers**: Handle HTTP requests/responses and business logic coordination
- **Services**: Contain business logic and data processing
- **Database**: Handle data persistence and SQL queries

## Environment Variables

See `env.example` for available environment variables.

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Add tests for new features
4. Update documentation as needed

## License

MIT
