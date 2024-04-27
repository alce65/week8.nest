import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';
import { SignUser, User } from './entities/user.entity';

const select = {
  id: true,
  email: true,
  role: true,
  tasks: {
    select: {
      id: true,
      title: true,
      isDone: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {
    this.logger.debug('Instantiated', 'UsersService');
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select,
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async findForLogin(email: string): Promise<SignUser | null> {
    const result = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        role: true,
      },
    });

    return result;
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
      select,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select,
      });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select,
      });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
