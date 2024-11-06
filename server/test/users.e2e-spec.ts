import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import exp from 'constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'test@user.com',
  password: '1234',
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let dataSource: DataSource;
  let token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    app = module.createNestApplication();
    userRepo = module.get(getRepositoryToken(User));
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('createAccount', () => {
    it('should create new account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Owner
            }) {
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: Owner
            }) {
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            login(input: {
              email: "${testUser.email}",
              password: "${testUser.password}",
            }) {
              ok
              error
              token
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login.ok).toBe(true);
          expect(res.body.data.login.error).toBe(null);
          expect(res.body.data.login.token).toEqual(expect.any(String));
          token = res.body.data.login.token;
        });
    });

    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            login(input: {
              email: "${testUser.email}",
              password: "worngPassword",
            }) {
              ok
              error
              token
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login.ok).toBe(false);
          expect(res.body.data.login.error).toEqual(expect.any(String));
          expect(res.body.data.login.token).toEqual(null);
        });
    });
  });

  describe('userProfile', () => {
    let userId: number;

    beforeAll(async () => {
      const [user] = await userRepo.find();
      userId = user.id;
    });
    it('should see a user profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token)
        .send({
          query: `
          {
            userProfile(userId: ${userId}) {
              ok
              error
              user {
                id
              }
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.userProfile.ok).toBe(true);
          expect(res.body.data.userProfile.error).toBe(null);
          expect(res.body.data.userProfile.user.id).toBe(1);
        });
    });

    it('should not find a user profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token)
        .send({
          query: `
          {
            userProfile(userId: 404) {
              ok
              error
              user {
                id
              }
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.userProfile.ok).toBe(false);
          expect(res.body.data.userProfile.error).toEqual(expect.any(String));
          expect(res.body.data.userProfile.user).toBe(null);
        });
    });
  });
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
