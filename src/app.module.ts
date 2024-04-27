import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LogGuard } from './core/logger/log.guard';
import { LogInterceptor } from './core/logger/log.interceptor';
import { CoreModule } from './core/core.module';
import { config } from 'process';
import { LogMiddleware } from './core/logger/log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
    UsersModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LogGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },

    AppService,
    Logger,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly logger: Logger) {
    this.logger.debug('Instantiated', 'AppModule');
    config;
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
