import { Logger, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CoreModule } from '../core/core.module';

export type RepoFindId = {
  findById(id: string): Promise<any>;
};

export const REPO_SERVICE = 'REPO_SERVICE';

@Module({
  imports: [PrismaModule, CoreModule],
  providers: [
    {
      provide: 'REPO_SERVICE',
      useClass: TasksService,
    },
    Logger,
  ],
  controllers: [TasksController],
})
export class TasksModule {}
