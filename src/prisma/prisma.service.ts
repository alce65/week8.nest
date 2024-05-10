import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly logger: Logger,
    optionsArg?: Prisma.PrismaClientOptions,
  ) {
    super(optionsArg);
    this.logger.debug('Instantiated', 'PrismaService');
  }
  async onModuleInit() {
    await this.$connect();
  }
}
