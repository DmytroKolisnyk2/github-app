import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Observable } from 'rxjs';
import { JwtUser } from './types/jwt-user.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();
    const path = req.path;
    const method = req.method;

    if (isPublic) {
      this.logger.debug(`Public route access: ${method} ${path}`);
      return true;
    }

    this.logger.debug(`Protected route access attempt: ${method} ${path}`);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      this.logger.warn(`No Authorization header found for: ${method} ${path}`);
    } else {
      this.logger.debug(
        `Authorization header found: ${authHeader.substring(0, 15)}...`,
      );
    }

    return super.canActivate(context);
  }

  handleRequest<TUser extends JwtUser>(
    err: Error | null,
    user: TUser,
    info: Error | null,
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest();
    const path = req.path;
    const method = req.method;

    if (err || !user) {
      const errorMessage = err?.message || 'Unknown authentication error';
      const infoMessage = info?.message || 'No additional info';

      this.logger.error(
        `Authentication failed for ${method} ${path}: ${errorMessage}, Info: ${infoMessage}`,
      );
      this.logger.debug(`JWT verification error details:`, err, info);

      throw err || new UnauthorizedException('User authentication failed');
    }

    return user;
  }
}
