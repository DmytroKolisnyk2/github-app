#!/bin/bash

echo "Stopping GitHub Repository Manager..."
docker-compose down

echo "Removing volumes (optional, uncomment if needed)..."
# docker-compose down -v

echo "Application stopped." 