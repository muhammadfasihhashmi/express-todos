# Express Todos API

A RESTful Todo API built with **Node.js, Express.js, PostgreSQL, and Prisma ORM**. The project is a hands-on backend learning project covering relational databases, API development, password security, and JWT authentication.

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – HTTP server and API routing
- **PostgreSQL** – Relational database
- **Prisma ORM** – Database schema, migrations, and queries
- **bcrypt** – Password hashing and verification
- **jsonwebtoken (JWT)** – Token-based authentication
- **pg / @prisma/adapter-pg** – PostgreSQL driver adapter
- **dotenv** – Environment variable configuration
- **Nodemon** – Development server auto-restart

## Features

### Authentication
- User registration with input validation.
- Email normalization before database lookup/storage.
- Password hashing with bcrypt.
- Login with password verification.
- JWT generation after successful login.
- Authentication middleware for protected Todo routes.
- Centralized error-handling middleware.

### Todo API
- Retrieve all todos.
- Retrieve a todo by its ID.
- Create a todo.
- Update a todo.
- Delete a todo.
- Validate Todo IDs and request data.

> **Current project status:** Todo endpoints currently require a valid JWT. User-specific Todo ownership (filtering reads, updates, and deletes by the authenticated user's ID) is not implemented yet. This is planned alongside Prisma User–Todo relationships.

## Project Structure

```text
express-todos/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   └── todo.controller.js
├── generated/
│   └── prisma/              # Generated Prisma Client (do not commit)
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── prisma/
│   ├── migrations/
│   ├── models/
│   │   ├── todo.prisma
│   │   └── user.prisma
│   └── schema.prisma
├── routes/
│   ├── auth.routes.js
│   └── todo.routes.js
├── utils/
│   └── helpers.js
├── .env.example
├── .gitignore
├── app.js
├── package.json
└── prisma7.config.ts
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (a version supported by Prisma 7)
- PostgreSQL
- npm

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd express-todos
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a template:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
JWT_SECRET=replace_with_a_long_random_secret
```

Update the database URL with your PostgreSQL username, password, host, port, and database name. Use a strong, private value for `JWT_SECRET`.

**Never commit your real `.env` file or share database credentials / JWT secrets.**

### 4. Create the database

Create the PostgreSQL database specified in `DATABASE_URL` if it does not already exist.

### 5. Run Prisma migrations and generate the client

The repository currently names its Prisma configuration file `prisma7.config.ts`. Use:

```bash
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

If you rename the file to Prisma's conventional `prisma.config.ts`, you can run the commands without the `--config` option:

```bash
npx prisma migrate dev
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

The server uses the `PORT` environment variable. With the example configuration, the API will be available at:

```text
http://localhost:5000
```

For a regular start:

```bash
npm start
```

## API Endpoints

Base URL: `http://localhost:5000`

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Not required |
| `POST` | `/auth/login` | Log in and receive a JWT | Not required |

#### Register

`POST /auth/register`

Request body:

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "your-password"
}
```

#### Login

`POST /auth/login`

Request body:

```json
{
  "email": "alex@example.com",
  "password": "your-password"
}
```

A successful login returns a JWT token. Use this token when calling Todo endpoints.

### Todos

All Todo endpoints are mounted under `/todos` and require a valid JWT.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos` | Get all todos |
| `GET` | `/todos/:id` | Get a todo by ID |
| `POST` | `/todos` | Create a todo |
| `PATCH` | `/todos/:id` | Update a todo |
| `DELETE` | `/todos/:id` | Delete a todo |

Include this header in each Todo request:

```http
Authorization: Bearer <your-jwt-token>
```

#### Create a Todo

`POST /todos`

```json
{
  "title": "Learn Prisma relationships"
}
```

#### Update a Todo

`PATCH /todos/:id`

You can provide `title`, `completed`, or both:

```json
{
  "title": "Practice Prisma relations",
  "completed": true
}
```

## Error Handling

The API uses a centralized Express error middleware. It handles common Prisma errors such as unique-constraint violations (`P2002`) and missing records (`P2025`), along with general server errors.

Authentication failures return `401 Unauthorized`.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |

## Learning Roadmap

This project is being developed incrementally. Upcoming work includes:

- Defining the one-to-many relationship between `User` and `Todo` in Prisma.
- Associating each Todo with its owner.
- Restricting Todo queries and mutations to the authenticated user.
- Strengthening authorization and request validation.

---

Built as part of my backend learning journey with PostgreSQL, Express.js, and Prisma ORM.
