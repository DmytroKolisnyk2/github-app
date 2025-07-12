import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtUser } from 'src/auth/types/jwt-user.types';

export const GetUser = createParamDecorator<undefined, JwtUser>(
  (_data: undefined, ctx: ExecutionContext): JwtUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  },
);
