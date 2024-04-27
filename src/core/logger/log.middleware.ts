import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl, method } = req;
    this.logger.log(
      `Request URL: [${method.toUpperCase()}] ${originalUrl}`,
      'LogMiddleware',
    );
    next();
  }
}
