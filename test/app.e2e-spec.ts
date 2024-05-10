import { execSync } from 'node:child_process';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';

describe('AppController (e2e)', () => {
  jest.setTimeout(60_000);

  let app: INestApplication;
  let container: StartedPostgreSqlContainer;

  beforeEach(async () => {
    container = await new PostgreSqlContainer().start();
    const dbUrl = container.getConnectionUri();

    execSync('npx prisma migrate dev', { env: { DATABASE_URL: dbUrl } });
    execSync(`npx prisma db seed`, { env: { DATABASE_URL: dbUrl } });

    //Set prisma instance
    const prismaService = new PrismaService(new Logger(), {
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
    console.log('connected to test db...');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
      providers: [PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

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
    it('send user by id', async () => {
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(6);
      expect(response.body[0].email).toEqual('ernestina@sample.es');
      expect(response.body[1].email).toEqual('pepe@sampl.com');
      expect(response.body[2].email).toEqual('luis@sample.com');
      expect(response.body[3].email).toEqual('juan@sample.io');
      expect(response.body[4].email).toEqual('helena@acme.com');
      expect(response.body[5].email).toEqual('sara@prisma.com');
      const userID = response.body[0].id;
      const userResponse = await request(app.getHttpServer()).get(
        `/users/${userID}`,
      );
      expect(response.status).toBe(200);
      expect(userResponse.body.id).toEqual(userID);
      expect(userResponse.body.email).toEqual('ernestina@sample.es');
    });
  });
});
