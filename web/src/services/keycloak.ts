import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = () => {
  return keycloak
    .init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    })
    .then((authenticated) => {
      if (!authenticated) {
        console.warn('User is not authenticated');
      }
      return authenticated;
    })
    .catch((error) => {
      console.error('Failed to initialize Keycloak', error);
      return false;
    });
};

export const login = () => keycloak.login();

export const register = () => {
  window.location.href = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/registrations?client_id=${keycloakConfig.clientId}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}`;
};

export const logout = () => keycloak.logout();

export const getToken = () => keycloak.token;

export const isAuthenticated = () => !!keycloak.token;

export const updateToken = (minValidity = 5) => {
  return new Promise<string>((resolve, reject) => {
    keycloak
      .updateToken(minValidity)
      .then(() => {
        resolve(keycloak.token as string);
      })
      .catch(() => {
        reject(new Error('Failed to refresh token'));
      });
  });
};

export const getUsername = () => keycloak.tokenParsed?.preferred_username;

export const getUserRoles = () => {
  return keycloak.tokenParsed?.realm_access?.roles || [];
};

export default keycloak; 