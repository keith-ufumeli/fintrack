# FinTrack Backend Server

A Node.js/Express backend server for the FinTrack personal finance application with user authentication and data management.

## Features

- **User Authentication**: GitHub OAuth integration with JWT tokens
- **User Management**: Create, update, and manage user profiles
- **Transaction Management**: CRUD operations for financial transactions
- **Loan Management**: Track money lent and borrowed
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signin` - Sign in with GitHub OAuth data
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/deactivate` - Deactivate user account

### Transactions (`/api/transactions`)

- `GET /api/transactions` - Get all transactions for authenticated user
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Loans (`/api/loans`)

- `GET /api/loans` - Get all loans for authenticated user
- `POST /api/loans` - Create a new loan
- `PUT /api/loans/:id` - Update a loan
- `DELETE /api/loans/:id` - Delete a loan

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Environment Configuration
NODE_ENV=development

# Database Configuration
MONGO_URI_TEST=mongodb://localhost:27017/fintrack_test
MONGO_URI_PROD=mongodb://localhost:27017/fintrack_prod

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## API Documentation

Once the server is running, visit `http://localhost:5000/api-docs` to view the interactive Swagger documentation.

## Database Models

### User
- `githubId`: GitHub user ID (unique)
- `username`: GitHub username
- `email`: User email address
- `name`: User's display name
- `avatar`: User's avatar URL
- `isActive`: Account status
- `lastLogin`: Last login timestamp
- `createdAt`: Account creation timestamp

### Transaction
- `user`: Reference to User model
- `type`: "income" or "expense"
- `amount`: Transaction amount
- `description`: Transaction description
- `date`: Transaction date

### Loan
- `user`: Reference to User model
- `person`: Name of person involved
- `amount`: Loan amount
- `type`: "lend" or "borrow"
- `description`: Loan description
- `date`: Loan date
- `status`: "unpaid" or "paid"

## Security Features

- JWT token-based authentication
- User data isolation (users can only access their own data)
- Account deactivation support
- Input validation and sanitization
- CORS configuration

## Development

The server uses ES modules and includes:
- Express.js for the web framework
- Mongoose for MongoDB ODM
- JWT for authentication
- Swagger for API documentation
- CORS for cross-origin requests
