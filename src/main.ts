import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets('public');

  const logger = app.get(Logger);
  logger.verbose(
    `Application in "${app.get(ConfigService).get('NODE_ENV')}" mode`,
    'Bootstrap',
  );
  logger.verbose(`Start Routes Resolver`, 'Bootstrap');
  await app.listen(PORT);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
