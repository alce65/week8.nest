import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './entites/task.dto';
import { LoggedGuard } from '../core/auth/logged.guard';
import { CreatorGuard } from '../core/auth/creator.guard';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Owner = (creatorId: string) => SetMetadata('ownerKey', creatorId);
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseGuards(LoggedGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly logger: Logger,
    @Inject('REPO_SERVICE') private taskService: TasksService,
  ) {
    this.logger.debug('Instantiated', 'TasksController');
  }

  @Get()
  async getAll() {
    return await this.taskService.findAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.taskService.findById(id);
  }

  @Post()
  async create(@Body() data: CreateTaskDto) {
    return await this.taskService.create(data);
  }

  @Owner('owner')
  @UseGuards(CreatorGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    return await this.taskService.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.taskService.delete(id);
  }
}
