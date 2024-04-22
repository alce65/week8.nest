import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './entiites/tasks.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }
  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
    });
  }

  async update(id: string, data: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
