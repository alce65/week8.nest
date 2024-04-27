import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: Logger) {
    super();
    this.logger.debug('Instantiated', 'PrismaService');
  }
  async onModuleInit() {
    await this.$connect();
  }
}
