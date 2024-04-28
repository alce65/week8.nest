import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './entities/user.dto';
import { SignUser, User } from './entities/user.entity';
import { ImgData } from '../types/image.data';

// const av: AvatarCreateNestedOneWithoutUserInput;

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
  avatar: {
    select: {
      publicId: true,
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

  async create(data: CreateUserDto, imgData: ImgData | null): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        avatar: imgData ? { create: imgData } : {},
      },
      select,
    });
  }

  async update(
    id: string,
    data: UpdateUserDto,
    imgData: ImgData | null,
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          avatar: imgData
            ? {
                upsert: {
                  create: imgData,
                  update: imgData,
                },
              }
            : {},
        },
        select,
      });
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const deleteAvatar = this.prisma.avatar.delete({
        where: { userId: id },
      });
      const deleteUser = this.prisma.user.delete({
        where: { id },
        select,
      });

      const transaction = await this.prisma.$transaction([
        deleteAvatar,
        deleteUser,
      ]);

      return transaction[1];
    } catch (error) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
