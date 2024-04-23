import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './entites/task.dto';
import { Task } from './entites/task.entity';

const select = {
  id: true,
  title: true,
  isDone: true,
  owner: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
};

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      select,
    });
  }
  async findById(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select,
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data,
      select,
    });
  }

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data,
        select,
      });
    } catch (error) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async delete(id: string): Promise<Task> {
    try {
      return await this.prisma.task.delete({
        where: { id },
        select,
      });
    } catch (error) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
