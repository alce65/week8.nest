import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { LoggedGuard } from '../core/auth/logged.guard';
import { TasksService } from './tasks.service';

const mockLoggedGuard = {};
const mockTasksService = {};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
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
});
