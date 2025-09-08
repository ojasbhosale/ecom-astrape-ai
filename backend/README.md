# E-commerce Backend API

A RESTful API built with Node.js, Express.js, and PostgreSQL for an e-commerce application.

## Features

- JWT-based authentication
- User registration and login
- Product management (CRUD operations)
- Shopping cart functionality
- Input validation and error handling
- Rate limiting and security headers

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Database Setup

1. Create a PostgreSQL database:
\`\`\`sql
CREATE DATABASE ecommerce_db;
\`\`\`

2. Run the database schema script:
\`\`\`bash
psql -U your_username -d ecommerce_db -f ../scripts/database.sql
\`\`\`

### 3. Environment Configuration

1. Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Update the `.env` file with your database credentials and JWT secret:
\`\`\`env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
\`\`\`

### 4. Start the Server

Development mode:
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user

### Items
- `GET /items` - Get all items (with optional filters)
- `POST /items` - Create new item (requires auth)
- `PUT /items/:id` - Update item (requires auth)
- `DELETE /items/:id` - Delete item (requires auth)

### Cart
- `GET /cart` - Get user's cart (requires auth)
- `POST /cart/add` - Add item to cart (requires auth)
- `POST /cart/remove` - Remove item from cart (requires auth)

## Query Parameters for Items

- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

Example: `GET /items?category=Electronics&minPrice=100&maxPrice=500`

## Authentication

Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Error Handling

The API returns consistent error responses:
\`\`\`json
{
  "error": "Error message",
  "details": "Additional error details (in development)"
}
\`\`\`

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS configuration
- Security headers with Helmet
- Input validation
