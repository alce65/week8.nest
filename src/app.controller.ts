import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
  ) {
    this.logger.debug('Instantiated', 'AppController');
  }

  @Get()
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
