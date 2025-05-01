# Student Association Management Platform API

A RESTful API for managing student associations, including users, events, projects, and forum discussions.

## Features

- **User Authentication**: Secure registration and login with JWT
- **User Management**: Create, read, update, delete operations for users
- **Event Management**: Create and manage association events
- **Project Collaboration**: Create projects and manage team members
- **Forum Discussions**: Categories, threads and replies for community discussions

## Tech Stack

- Node.js with Express
- TypeScript
- PostgreSQL database
- JWT for authentication
- Docker for containerization

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Docker and Docker Compose (for containerized development)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository
2. Start the Docker containers:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database on port 5432
- Adminer (DB management UI) on port 8080

### Manual Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a PostgreSQL database named `association_db`
4. Configure your environment variables in `.env` (copy from `.env.example`)
5. Run the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Events

- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get current user's projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Forum

- `GET /api/forum/categories` - Get all categories
- `GET /api/forum/categories/:id` - Get category by ID
- `POST /api/forum/categories` - Create new category (admin only)
- `PUT /api/forum/categories/:id` - Update category (admin only)
- `DELETE /api/forum/categories/:id` - Delete category (admin only)
- `GET /api/forum/categories/:categoryId/threads` - Get threads in category
- `GET /api/forum/threads/:id` - Get thread with replies
- `POST /api/forum/threads` - Create new thread
- `PUT /api/forum/threads/:id` - Update thread
- `DELETE /api/forum/threads/:id` - Delete thread
- `POST /api/forum/replies` - Create new reply
- `PUT /api/forum/replies/:id` - Update reply
- `DELETE /api/forum/replies/:id` - Delete reply

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Database Migrations

Database will be initialized automatically when the API starts. If changes are needed:

1. Edit the migration file in `src/db/migrations/init.sql`
2. Restart the server

## Default Admin Account

The system includes a default admin account for initial setup:

- Email: admin@example.com
- Password: admin123

**Important**: Change this password immediately in production!
