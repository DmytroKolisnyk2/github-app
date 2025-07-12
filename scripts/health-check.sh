#!/bin/bash

echo "Checking if all services are running properly..."

# Check PostgreSQL
echo -n "PostgreSQL: "
if docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; then
  echo "✅ Running"
else
  echo "❌ Not running"
  exit 1
fi

# Check Keycloak
echo -n "Keycloak: "
if curl -s http://localhost:8080/health/ready > /dev/null 2>&1; then
  echo "✅ Running"
else
  echo "❌ Not running"
  exit 1
fi

# Check API
echo -n "API: "
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "✅ Running"
else
  echo "❌ Not running"
  exit 1
fi

# Check Web
echo -n "Web: "
if curl -s http://localhost > /dev/null 2>&1; then
  echo "✅ Running"
else
  echo "❌ Not running"
  exit 1
fi

echo "All services are running properly! 🚀"
echo "You can access the application at http://localhost"
echo "Default user: user / password" 