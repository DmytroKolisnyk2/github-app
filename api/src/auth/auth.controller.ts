import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtUser } from './types/jwt-user.types';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: JwtUser) {
    this.logger.log(`Profile requested for user: ${user.userId}`);
    return user;
  }
}
