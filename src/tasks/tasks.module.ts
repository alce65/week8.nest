import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

// export const REPO_SERVICE = 'REPO_SERVICE';
export type RepoFindId = {
  findById(id: string): Promise<any>;
};

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [
    {
      provide: 'REPO_SERVICE',
      useClass: TasksService,
    },
    TasksService,
  ],
  controllers: [TasksController],
})
export class TasksModule {}
