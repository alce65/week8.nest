import { Logger } from '@nestjs/common';
import { LogMiddleware } from './log.middleware';
import { Request } from 'express';

describe('LogMiddleware', () => {
  const logger = new Logger();
  const logMiddleware = new LogMiddleware(logger);
  it('should be defined', () => {
    expect(logMiddleware).toBeDefined();
  });
  it('should log the request', () => {
    const req = {
      originalUrl: 'http://localhost:3000',
      method: 'GET',
    } as Request;
    const res = {} as globalThis.Response;
    const next = jest.fn();
    jest.spyOn(logger, 'log');
    logMiddleware.use(req, res, next);
    expect(logger.log).toHaveBeenCalledWith(
      `Request URL: [GET] http://localhost:3000`,
      'LogMiddleware',
    );
  });
});
