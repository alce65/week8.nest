import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './entities/user.dto';

const mockPrisma = {
  user: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockReturnValue({}),
    create: jest.fn().mockReturnValue({}),
    update: jest.fn().mockReturnValue({}),
    delete: jest.fn().mockReturnValue({}),
  },
};

describe('Given the class UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we use the method findAll', () => {
    it('Then it should return all users', async () => {
      const result = await service.findAll();
      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method findOne', () => {
    it('Then it should return the user with the id', async () => {
      const result = await service.findOne('1');
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('Then it should throw an error if the user is not found', async () => {
      mockPrisma.user.findUnique.mockReturnValueOnce(null);
      expect(service.findOne('1')).rejects.toThrow('User 1 not found');
    });
  });

  describe('When we use the method findForLogin', () => {
    it('Then it should return the user with the email', async () => {
      const result = await service.findForLogin('email');
      expect(mockPrisma.user.findUnique).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method create', () => {
    it('Then it should return the created user', async () => {
      const data: CreateUserDto = {} as CreateUserDto;
      const result = await service.create(data);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update', () => {
    it('Then it should return the updated user', async () => {
      const result = await service.update('1', {} as CreateUserDto);
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('Then it should throw an error if the user is not found', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error());
      const data: CreateUserDto = {} as CreateUserDto;
      expect(service.update('1', data)).rejects.toThrow('User 1 not found');
    });
  });

  describe('When we use the method delete', () => {
    it('Then it should return the deleted user', async () => {
      const result = await service.delete('1');
      expect(mockPrisma.user.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('Then it should throw an error if the user is not found', async () => {
      mockPrisma.user.delete.mockRejectedValue(new Error());
      expect(service.delete('1')).rejects.toThrow('User 1 not found');
    });
  });
});
