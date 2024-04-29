import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [PrismaModule, CoreModule],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
