import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CryptoService } from '../core/crypto/crypto.service';
import { CreateUserDto } from './entities/user.dto';
import { LoggedGuard } from '../core/auth/logged.guard';
import { Logger } from '@nestjs/common';

const mockUsersService = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({}),
  findForLogin: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
};

const mockCryptoService = {
  hash: jest.fn().mockResolvedValue('12345hash'),
  compare: jest.fn().mockResolvedValue(true),
  createToken: jest.fn().mockResolvedValue('token'),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
        Logger,
      ],
    })
      .overrideGuard(LoggedGuard)
      .useValue(jest.fn().mockReturnValue(true))
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When we use the method loginWithToken', () => {
    it('should return a token', async () => {
      const mockPayload = { id: '1' };
      const result = await controller.loginWithToken({ payload: mockPayload });
      expect(mockUsersService.findOne).toHaveBeenCalled();
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw an error if user is not found', async () => {
      const mockPayload = { id: '1' };
      (mockUsersService.findOne as jest.Mock).mockResolvedValueOnce(null);
      try {
        await controller.loginWithToken({ payload: mockPayload });
      } catch (error) {
        expect(error.message).toEqual('Email and password invalid');
      }
    });
  });

  describe('When we use the method login', () => {
    it('should return a token', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      const result = await controller.login(mockUserDto);
      expect(result).toEqual({ token: 'token' });
    });

    it('should throw an error if email or password are missing', async () => {
      const mockUserDto = {
        email: '',
        password: '',
      } as CreateUserDto;

      expect(controller.login(mockUserDto)).rejects.toThrow(
        'Email and password are required',
      );
    });
    it('should throw an error if user is not found', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      (mockUsersService.findForLogin as jest.Mock).mockResolvedValueOnce(null);
      expect(controller.login(mockUserDto)).rejects.toThrow(
        'Email and password invalid',
      );
    });
    it('should throw an error if password is invalid', async () => {
      const mockUserDto = {
        email: 'test@sample.com',
        password: '12345',
      } as CreateUserDto;
      (mockCryptoService.compare as jest.Mock).mockResolvedValueOnce(false);
      expect(controller.login(mockUserDto)).rejects.toThrow(
        'Email and password invalid',
      );
    });
  });
  describe('When we use the method getAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe('When we use the method getById', () => {
    it('should return the user with the id', async () => {
      const result = await controller.findOne('1');
      expect(mockUsersService.findOne).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the method create', () => {
    it('should create a new user', async () => {
      const mockUserDto = {} as CreateUserDto;
      const result = await controller.create(mockUserDto);
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the method update', () => {
    it('should update a user', async () => {
      const mockUserDto = {
        password: '12345',
      } as CreateUserDto;
      const result = await controller.update('1', mockUserDto);
      expect(mockUsersService.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the method delete', () => {
    it('should delete a user', async () => {
      const result = await controller.delete('1');
      expect(mockUsersService.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
});
