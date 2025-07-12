export interface KeycloakPayload {
  sub: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  iss?: string;
  aud?: string | string[];
  exp?: number;
}
