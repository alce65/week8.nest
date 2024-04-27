import { JwtService } from '@nestjs/jwt';
import { LoggedGuard } from './logged.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';

const jwtServiceMock: JwtService = {
  verifyAsync: jest.fn().mockResolvedValue({}),
} as unknown as JwtService;
const configServiceMock: ConfigService = {
  get: jest.fn().mockReturnValue('SECRET_JWT'),
} as unknown as ConfigService;

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new LoggedGuard(jwtServiceMock, configServiceMock)).toBeDefined();
  });

  describe('When we call canActivate method', () => {
    it('should return true', async () => {
      const guard = new LoggedGuard(jwtServiceMock, configServiceMock);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'Bearer token',
            },
          }),
        }),
      } as any;
      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    describe('And there are NOT Authorization header', () => {
      it('should throw BadRequestException', async () => {
        const guard = new LoggedGuard(jwtServiceMock, configServiceMock);
        const context = {
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {},
            }),
          }),
        } as ExecutionContext;
        try {
          await guard.canActivate(context);
        } catch (error) {
          expect(error.message).toBe('Authorization header is required');
        }
      });
    });

    describe('And token is invalid', () => {
      it('should throw ForbiddenException', async () => {
        const guard = new LoggedGuard(jwtServiceMock, configServiceMock);
        const context = {
          switchToHttp: () => ({
            getRequest: () => ({
              headers: {
                authorization: 'Bearer token',
              },
            }),
          }),
        } as ExecutionContext;
        jwtServiceMock.verifyAsync = jest.fn().mockRejectedValue(new Error());
        try {
          await guard.canActivate(context);
        } catch (error) {
          expect(error.message).toBe('Invalid token');
        }
      });
    });
  });
});
