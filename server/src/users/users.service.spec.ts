import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from './entities/verification';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

const mockRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepo: MockRepository<User>;
  let verificationRepo: MockRepository<Verification>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepo(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));
    verificationRepo = module.get(getRepositoryToken(Verification));
    mailService = module.get<MailService>(MailService);
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: 'test@test.com',
      password: 'test1234',
      role: 0,
    };
    it('should fail if user exists', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({
        ok: false,
        error: 'There is a user with that email already',
      });
    });
    it('should create a new user and return it', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      userRepo.create.mockReturnValue(createAccountArgs);
      userRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.create.mockReturnValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue({
        code: 'anyCode',
      });

      const result = await service.createAccount(createAccountArgs);

      expect(userRepo.create).toHaveBeenCalledTimes(1);
      expect(userRepo.create).toHaveBeenCalledWith(createAccountArgs);

      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationRepo.create).toHaveBeenCalledTimes(1);
      expect(verificationRepo.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(verificationRepo.save).toHaveBeenCalledTimes(1);
      expect(verificationRepo.save).toHaveBeenCalledWith(createAccountArgs);

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        createAccountArgs.email,
        expect.any(String),
      );

      expect(result.ok).toBe(true);
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
