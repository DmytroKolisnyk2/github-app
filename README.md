# GitHub Repository Manager

A web application that allows users to track and manage GitHub repositories. Built with NestJS, React, TypeScript, and Keycloak for authentication.

## Features

- **User Authentication**: Secure login and registration using Keycloak
- **Repository Management**: Add, view, update, and remove GitHub repositories
- **GitHub Integration**: Fetch and display repository data from GitHub API
- **Responsive UI**: Modern interface built with React and Material UI

## Architecture

The application consists of three main components:

1. **Frontend (Web)**: React application with TypeScript
2. **Backend (API)**: NestJS application with TypeScript
3. **Authentication**: Keycloak server for identity and access management
4. **Database**: PostgreSQL for data storage

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn (for local development)

## Quick Start

### Using the Setup Script

Run the setup script to check prerequisites and create environment files:

```bash
./setup-and-run.sh
```

### Using Docker Compose

1. Clone the repository:

2. Start the application:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost
   - API: http://localhost:3000
   - Keycloak: http://localhost:8080

### Local Development

#### Backend (API)

1. Set up environment variables:
   ```bash
   cd api
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

#### Frontend (Web)

1. Set up environment variables:
   ```bash
   cd web
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
github-app/
├── api/                  # Backend NestJS application
│   ├── src/              # Source code
│   ├── .env.example      # Example environment variables
│   └── ...
├── web/                  # Frontend React application
│   ├── src/              # Source code
│   ├── .env.example      # Example environment variables
│   └── ...
├── scripts/              # Utility scripts
├── docker-compose.yml    # Docker Compose configuration
├── setup-and-run.sh      # Setup script
└── README.md             # This file
```

## Authentication Flow

1. User navigates to the application
2. User clicks "Login" and is redirected to Keycloak
3. User authenticates with Keycloak
4. Keycloak redirects back to the application with an access token
5. The application uses the token to authenticate API requests

## API Documentation

The API provides the following endpoints:

- `GET /api/repos`: Get all repositories for the authenticated user
- `POST /api/repos`: Add a new repository
- `PUT /api/repos/:id/update`: Update repository data from GitHub
- `DELETE /api/repos/:id`: Remove a repository