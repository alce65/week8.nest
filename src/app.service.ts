import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {
    this.logger.debug('AppService instantiated');
  }
  getHello(): { message: string } {
    return {
      message: 'Hello World!',
    };
  }
}
