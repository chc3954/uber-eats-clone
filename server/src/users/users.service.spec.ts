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
  findOneOrFail: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepo: MockRepository<User>;
  let verificationRepo: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

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
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));
    verificationRepo = module.get(getRepositoryToken(Verification));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
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
        error: 'There is a user with that email already.',
      });
    });

    it('should create a new user and return it', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      userRepo.create.mockReturnValue(createAccountArgs);
      userRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.create.mockReturnValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue({
        code: 'code',
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

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error('test'));
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Could not create account.',
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'test@test.com',
      password: 'test1234',
    };

    it('should fail if user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        select: ['id', 'password'],
        where: { email: loginArgs.email },
      });
      expect(result).toEqual({
        ok: false,
        error: 'Incorrect email.',
      });
    });

    it('should fail if incorrect password', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      });
      const result = await service.login(loginArgs);

      expect(result).toEqual({
        ok: false,
        error: 'Incorrect password.',
      });
    });

    it('should return a token', async () => {
      userRepo.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      });
      const result = await service.login(loginArgs);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));

      expect(result.ok).toBe(true);
      expect(result.token).toBe('token');
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error('test'));
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Could not log user in.',
      });
    });
  });

  describe('findById', () => {
    it('should find a existing user', async () => {
      userRepo.findOneOrFail.mockResolvedValue({
        id: 1,
      });
      const result = await service.findById(1);
      expect(result).toEqual({
        ok: true,
        user: { id: 1 },
      });
    });

    it('should fail if no user is found', async () => {
      userRepo.findOneOrFail.mockRejectedValue(new Error('test'));
      const result = await service.findById(1);
      expect(result).toEqual({
        ok: false,
        error: 'Could not find user.',
      });
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: 'test@test.com',
        verified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'test@new.com' },
      };
      const newUser = {
        email: editProfileArgs.input.email,
        verified: false,
      };
      const newVerification = { code: 'code' };

      userRepo.findOne.mockResolvedValue(oldUser);
      verificationRepo.create.mockReturnValue(newVerification);
      verificationRepo.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);

      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: editProfileArgs.userId },
      });

      expect(verificationRepo.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationRepo.save).toHaveBeenCalledWith(newVerification);

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        newVerification.code,
      );
    });

    it('should change password', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { password: 'newPassword' },
      };

      userRepo.findOne.mockResolvedValue({ password: 'oldPassword' });
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        password: editProfileArgs.input.password,
      });

      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      userRepo.findOne.mockRejectedValue(new Error('test'));
      const result = await service.editProfile(1, { email: 'try@new.com' });
      expect(result).toEqual({ ok: false, error: 'Could not update profile.' });
    });
  });

  it.todo('verifyEmail');
});
