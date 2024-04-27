import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { LoggedGuard } from '../core/auth/logged.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './entites/task.dto';
import { Logger } from '@nestjs/common';

const mockLoggedGuard = {};
const mockTasksService: TasksService = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
} as unknown as TasksService;

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: 'REPO_SERVICE',
          useValue: mockTasksService,
        },
        Logger,
      ],
      controllers: [TasksController],
    })
      .overrideGuard(LoggedGuard)
      .useValue(mockLoggedGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When we use the method getAll', () => {
    it('Then it should return all tasks', async () => {
      const result = await controller.getAll();
      expect(mockTasksService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe('When we use the method getById', () => {
    it('Then it should return the task with the id', async () => {
      const result = await controller.getById('1');
      expect(mockTasksService.findById).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the method create', () => {
    it('Then it should create a new task', async () => {
      const mockTaskDto = {} as CreateTaskDto;
      const result = await controller.create(mockTaskDto);
      expect(mockTasksService.create).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the method update', () => {
    it('Then it should update a task', async () => {
      const mockTaskDto = {} as UpdateTaskDto;
      const result = await controller.update('1', mockTaskDto);
      expect(mockTasksService.update).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
  describe('When we use the method delete', () => {
    it('Then it should delete a task', async () => {
      const result = await controller.delete('1');
      expect(mockTasksService.delete).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });
});
