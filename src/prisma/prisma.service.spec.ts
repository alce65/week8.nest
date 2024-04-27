import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { Logger } from '@nestjs/common';

jest.mock('@prisma/client', () => ({
  PrismaClient: function () {
    this.$connect = jest.fn();
  },
}));

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, Logger],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to prisma', async () => {
    await service.onModuleInit();
    expect(service.$connect).toHaveBeenCalled();
  });
});
