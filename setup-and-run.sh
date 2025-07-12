#!/bin/bash

echo "================================================"
echo "  GitHub App Setup and Run Script"
echo "================================================"
echo ""

echo "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker and try again."
  exit 1
fi
echo "✅ Docker is running"

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose down
echo "✅ Existing containers stopped"

# Clean up volumes if requested
if [ "$1" == "--clean" ]; then
  echo "Removing volumes for a clean installation..."
  docker volume rm github-app_postgres_data 2>/dev/null || true
  echo "✅ Volumes removed"
fi

# Build the containers
echo "Building containers..."
docker-compose build
echo "✅ Containers built"

# Start the containers
echo "Starting containers..."
docker-compose up -d
echo "✅ Containers started"

# Wait for services to be ready
echo "Waiting for services to be ready..."
echo "This may take a minute or two..."
attempt=0
max_attempts=30

while [ $attempt -lt $max_attempts ]; do
  if curl -s http://localhost:8080/realms/master > /dev/null && \
     curl -s http://localhost:3000/api/health > /dev/null && \
     curl -s http://localhost > /dev/null; then
    echo "✅ All services are up and running!"
    break
  fi
  attempt=$((attempt+1))
  echo "Waiting for services to be ready... ($attempt/$max_attempts)"
  sleep 5
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Timeout waiting for services to be ready."
  echo "Please check the logs with: docker-compose logs"
  exit 1
fi

# Show access information
echo ""
echo "================================================"
echo "  GitHub App is now running!"
echo "================================================"
echo ""
echo "Access the application at: http://localhost"
echo ""
echo "Login with:"
echo "  - Username: user@example.com"
echo "  - Password: password"
echo ""
echo "Or register a new account using the 'Create an Account' button"
echo ""
echo "Keycloak admin console: http://localhost:8080/admin"
echo "  - Username: admin"
echo "  - Password: admin"
echo ""
echo "API endpoint: http://localhost:3000"
echo ""
echo "To stop the application, run: ./stop.sh"
echo "To view logs, run: docker-compose logs -f"
echo "================================================" 