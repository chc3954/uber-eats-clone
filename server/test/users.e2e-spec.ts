import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

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
  let verificationRepo: Repository<Verification>;
  let dataSource: DataSource;
  let token: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) =>
    baseTest().set('X-JWT', token).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    dataSource = module.get<DataSource>(DataSource);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    verificationRepo = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('createAccount', () => {
    it('should create new account', () => {
      return publicTest(`
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
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return publicTest(`
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
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return publicTest(`
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
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login.ok).toBe(true);
          expect(res.body.data.login.error).toBe(null);
          expect(res.body.data.login.token).toEqual(expect.any(String));
          token = res.body.data.login.token;
        });
    });

    it('should not be able to login with wrong credentials', () => {
      return publicTest(`
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
        `)
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
      return privateTest(`
          {
            userProfile(userId: ${userId}) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.userProfile.ok).toBe(true);
          expect(res.body.data.userProfile.error).toBe(null);
          expect(res.body.data.userProfile.user.id).toBe(1);
        });
    });

    it('should not find a user profile', () => {
      return privateTest(`
          {
            userProfile(userId: 404) {
              ok
              error
              user {
                id
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.userProfile.ok).toBe(false);
          expect(res.body.data.userProfile.error).toEqual(expect.any(String));
          expect(res.body.data.userProfile.user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.me.email).toBe(testUser.email);
        });
    });

    it('should not allow logged out user', () => {
      return publicTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.errors[0].message).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_MAIL = 'new@email.com';
    it('should change email', () => {
      return privateTest(`
          mutation {
            editProfile(input: {
              email: "${NEW_MAIL}",
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.editProfile.ok).toBe(true);
          expect(res.body.data.editProfile.error).toBe(null);
        });
    });

    it('should have new email', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.me.email).toBe(NEW_MAIL);
        });
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;

    beforeAll(async () => {
      const [verification] = await verificationRepo.find();
      verificationCode = verification.code;
    });

    it('should verify email', () => {
      return publicTest(`
          mutation {
            verifyEmail(input: {
              code: "${verificationCode}"
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.verifyEmail.ok).toBe(true);
          expect(res.body.data.verifyEmail.error).toBe(null);
        });
    });

    it('should fail on verification not found', () => {
      return publicTest(`
          mutation {
            verifyEmail(input: {
              code: "wrongCode"
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.verifyEmail.ok).toBe(false);
          expect(res.body.data.verifyEmail.error).toEqual(expect.any(String));
        });
    });
  });
});
