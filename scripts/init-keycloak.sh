#!/bin/bash

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
until curl -s http://keycloak:8080/realms/master > /dev/null; do
  sleep 5
done

# Get admin token
echo "Getting admin token..."
ADMIN_TOKEN=$(curl -s -X POST http://keycloak:8080/realms/master/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

# Create github-app realm
echo "Creating github-app realm..."
curl -s -X POST http://keycloak:8080/admin/realms \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "github-app",
    "enabled": true,
    "displayName": "GitHub App",
    "accessTokenLifespan": 86400,
    "registrationAllowed": true,
    "registrationEmailAsUsername": true,
    "verifyEmail": false,
    "loginWithEmailAllowed": true,
    "duplicateEmailsAllowed": false,
    "resetPasswordAllowed": true,
    "editUsernameAllowed": false,
    "bruteForceProtected": true
  }'

# Create github-app-client client (public)
echo "Creating github-app-client client..."
curl -s -X POST http://keycloak:8080/admin/realms/github-app/clients \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "github-app-client",
    "enabled": true,
    "publicClient": true,
    "redirectUris": ["http://localhost:80/*", "http://localhost/*"],
    "webOrigins": ["http://localhost:80", "http://localhost"],
    "standardFlowEnabled": true,
    "directAccessGrantsEnabled": true
  }'

# Create github-app-admin client (confidential)
echo "Creating github-app-admin client..."
ADMIN_CLIENT_ID=$(curl -s -X POST http://keycloak:8080/admin/realms/github-app/clients \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "github-app-admin",
    "enabled": true,
    "publicClient": false,
    "serviceAccountsEnabled": true,
    "clientAuthenticatorType": "client-secret",
    "secret": "your-client-secret"
  }' | jq -r '.id')

# Create test user
echo "Creating test user..."
curl -s -X POST http://keycloak:8080/admin/realms/github-app/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "email": "user@example.com",
    "firstName": "Test",
    "lastName": "User",
    "enabled": true,
    "credentials": [
      {
        "type": "password",
        "value": "password",
        "temporary": false
      }
    ]
  }'

# Configure realm theme for registration and login pages
echo "Configuring realm theme..."
curl -s -X PUT http://keycloak:8080/admin/realms/github-app \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "loginTheme": "keycloak",
    "accountTheme": "keycloak",
    "adminTheme": "keycloak",
    "emailTheme": "keycloak"
  }'

echo "Keycloak initialization completed." 