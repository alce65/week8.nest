import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {
    this.logger.debug('Instantiated', 'AppService');
  }
  getHello(): { message: string } {
    return {
      message: 'Hello World!',
    };
  }
}
