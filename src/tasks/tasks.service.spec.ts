import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './entites/task.dto';
import { Logger } from '@nestjs/common';

const mockPrisma = {
  task: {
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockReturnValue({}),
    create: jest.fn().mockReturnValue({}),
    update: jest.fn().mockReturnValue({}),
    delete: jest.fn().mockReturnValue({}),
  },
};

describe('Given a instance of the class TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        TasksService,
        Logger,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When we use the method findAll', () => {
    it('Then it should return all tasks', async () => {
      const result = await service.findAll();
      expect(mockPrisma.task.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When we use the method findById', () => {
    it('Then it should return the task with the id', async () => {
      const result = await service.findById('1');
      expect(mockPrisma.task.findUnique).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('Then it should throw an error if the task is not found', async () => {
      mockPrisma.task.findUnique.mockReturnValueOnce(null);
      expect(service.findById('1')).rejects.toThrow('Task 1 not found');
    });
  });

  describe('When we use the method create', () => {
    it('Then it should create a new task', async () => {
      const mockTaskDto = {} as CreateTaskDto;
      const result = await service.create(mockTaskDto);
      expect(mockPrisma.task.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('When we use the method update', () => {
    it('Then it should update the task with the id', async () => {
      const mockTaskDto = {} as CreateTaskDto;
      const result = await service.update('1', mockTaskDto);
      expect(mockPrisma.task.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('Then it should throw an error if the task is not found', async () => {
      mockPrisma.task.update.mockRejectedValueOnce(new Error());
      expect(service.update('1', {} as CreateTaskDto)).rejects.toThrow(
        'Task 1 not found',
      );
    });
  });

  describe('When we use the method delete', () => {
    it('Then it should delete the task with the id', async () => {
      const result = await service.delete('1');
      expect(mockPrisma.task.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('Then it should throw an error if the task is not found', async () => {
      mockPrisma.task.delete.mockRejectedValueOnce(new Error());
      expect(service.delete('1')).rejects.toThrow('Task 1 not found');
    });
  });
});
