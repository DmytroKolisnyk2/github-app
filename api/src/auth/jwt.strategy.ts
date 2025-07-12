import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { KeycloakPayload } from './types/keycloak.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const keycloakUrl = process.env.KEYCLOAK_URL!;
    const publicUrl = process.env.KEYCLOAK_PUBLIC_URL!;
    const realm = process.env.KEYCLOAK_REALM!;
    const clientId = process.env.KEYCLOAK_CLIENT_ID!;

    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
        handleSigningKeyError: (err, cb) => {
          this.logger.error('JWKS signing key error:', err);
          return cb(err);
        },
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: ['account', clientId],
      issuer: `${publicUrl}/realms/${realm}`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: KeycloakPayload) {
    this.logger.debug(
      `JWT payload validated: ${JSON.stringify({
        sub: payload.sub,
        preferred_username: payload.preferred_username,
        email: payload.email,
        issuer: payload.iss,
        audience: payload.aud,
        expiration: payload.exp,
      })}`,
    );

    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      roles: payload.realm_access?.roles || [],
      ...payload,
    };
  }
}
