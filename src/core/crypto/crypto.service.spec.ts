import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { hash, compare } from 'bcrypt';
import { SignUser } from 'src/users/entities/user.entity';
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedValue'),
  compare: jest.fn().mockResolvedValue(true),
}));

const configServiceMock: ConfigService = {
  get: jest.fn().mockReturnValue('SECRET_JWT'),
} as unknown as ConfigService;

const jwtServiceMock: JwtService = {
  signAsync: jest.fn().mockResolvedValue('token'),
  verifyAsync: jest.fn().mockResolvedValue({}),
} as unknown as JwtService;

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        CryptoService,
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we call hash method', () => {
    it('should return a hashed value', async () => {
      const value = 'value';
      const result = await service.hash(value);
      expect(hash).toHaveBeenCalledWith(value, 10);
      expect(result).toBe('hashedValue');
    });
  });

  describe('When we call compare method', () => {
    it('should return a boolean', async () => {
      const value = 'value';
      const hash = 'hash';
      const result = await service.compare(value, hash);
      expect(compare).toHaveBeenCalledWith(value, hash);
      expect(result).toBe(true);
    });
  });

  describe('When we call createToken method', () => {
    it('should return a token', async () => {
      const user: SignUser = { id: 'id', role: 'user', password: '' };
      const result = await service.createToken(user);
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
        { id: 'id', role: 'user' },
        { secret: 'SECRET_JWT' },
      );
      expect(result).toBe('token');
    });
  });

  describe('When we call verifyToken method', () => {
    it('should return a token', async () => {
      const token = 'token';
      const result = await service.verifyToken(token);
      expect(jwtServiceMock.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'SECRET_JWT',
      });
      expect(result).toEqual({});
    });
  });
});
