import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('api/health')
  health() {
    return { status: 'ok' };
  }
}
