import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): { status: string; service: string } {
    return { status: 'ok', service: 'example-service' };
  }
}
