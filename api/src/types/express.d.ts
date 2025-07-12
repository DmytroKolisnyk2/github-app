/// <reference types="express" />

declare namespace Express {
  interface Request {
    user?: import('../auth/types/jwt-user.types').JwtUser;
  }
}
