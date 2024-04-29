import { execSync } from 'node:child_process';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  jest.setTimeout(60_000);

  let app: INestApplication;
  let container: StartedPostgreSqlContainer;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaClient;

  beforeEach(async () => {
    container = await new PostgreSqlContainer().start();
    const dbUrl = container.getConnectionUri();
    execSync(`set DATABASE_URL=${dbUrl} npm prisma db seed`);
    prisma = new PrismaClient({
      datasourceUrl: dbUrl,
    });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    // await prisma.task.deleteMany();
    // await prisma.avatar.deleteMany();
    // await prisma.user.deleteMany();
  });
  afterAll(() => {
    container.stop();
  });

  describe('/ (GET)', () => {
    it('send { message: "Hello World!" })', async () => {
      const response = await request(app.getHttpServer()).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Hello World!' });
    });
  });
  describe('/users (GET)', () => {
    it('send users)', async () => {
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(6);
      const userID = response.body[0].id;
      const userResponse = await request(app.getHttpServer()).get(
        `/users/${userID}`,
      );
      expect(response.status).toBe(200);
      expect(userResponse.body.id).toEqual(userID);
    });
  });
});
