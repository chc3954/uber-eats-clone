import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from './entities/verification';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

// Define a mock user repository
const mockRepo = () => ({
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

// Define a mock jwt service
const mockJwtService = () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
});

// Define a mock mail service
const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

// Define a type for a mock repository
type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  // Define the variables that will be used in the tests
  let service: UserService;
  let userRepo: MockRepository<User>;
  let verificationRepo: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

  // Create a new testing module before each test
  beforeEach(async () => {
    // Define the testing module
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
    // Get the service and repositories from the module
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
      // Mock the database calls
      userRepo.findOne.mockResolvedValue(undefined);
      userRepo.create.mockReturnValue(createAccountArgs);
      userRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.create.mockReturnValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue({
        code: 'code',
      });

      // Call the service
      const result = await service.createAccount(createAccountArgs);

      // Check if the result is correct
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
      // Mock the database call
      userRepo.findOne.mockResolvedValue(null);

      // Call the service
      const result = await service.login(loginArgs);

      // Check if the result is correct
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
      // Mock the database call
      userRepo.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      });

      // Call the service
      const result = await service.login(loginArgs);

      // Check if the result is correct
      expect(result).toEqual({
        ok: false,
        error: 'Incorrect password.',
      });
    });

    it('should return a token', async () => {
      // Mock the database call
      userRepo.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      });

      // Call the service
      const result = await service.login(loginArgs);

      // Check if the result is correct
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result.ok).toBe(true);
      expect(result.token).toBe('token');
    });

    it('should fail on exception', async () => {
      // Mock the database call
      userRepo.findOne.mockRejectedValue(new Error('test'));

      // Call the service
      const result = await service.login(loginArgs);

      // Check if the result is correct
      expect(result).toEqual({
        ok: false,
        error: 'Could not log user in.',
      });
    });
  });

  describe('findById', () => {
    it('should find a existing user', async () => {
      // Mock the database call
      userRepo.findOneOrFail.mockResolvedValue({
        id: 1,
      });

      // Call the service
      const result = await service.findById(1);

      // Check if the result is correct
      expect(result).toEqual({
        ok: true,
        user: { id: 1 },
      });
    });

    it('should fail if no user is found', async () => {
      // Mock the database call
      userRepo.findOneOrFail.mockRejectedValue(new Error('test'));

      // Call the service
      const result = await service.findById(1);

      // Check if the result is correct
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

      // Mock the database calls
      userRepo.findOne.mockResolvedValue(oldUser);
      verificationRepo.create.mockReturnValue(newVerification);
      verificationRepo.save.mockResolvedValue(newVerification);

      // Call the service
      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);

      // Check if the database calls are correct
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

      // Mock the database calls
      userRepo.findOne.mockResolvedValue({ password: 'oldPassword' });

      // Call the service
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      // Check if the result is correct
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        password: editProfileArgs.input.password,
      });
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      // Mock the database call
      userRepo.findOne.mockRejectedValue(new Error('test'));

      // Call the service
      const result = await service.editProfile(1, { email: 'try@new.com' });

      // Check if the result is correct
      expect(result).toEqual({ ok: false, error: 'Could not update profile.' });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockedVerification = {
        id: 1,
        user: { verified: false },
      };
      // Mock the database calls
      verificationRepo.findOne.mockResolvedValue(mockedVerification);

      // Call the service
      const result = await service.verifyEmail('');

      // Check if the result is correct
      expect(verificationRepo.findOne).toHaveBeenCalledTimes(1);
      expect(verificationRepo.findOne).toHaveBeenCalledWith({
        where: { code: '' },
        relations: ['user'],
      });
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({ verified: true });
      expect(verificationRepo.delete).toHaveBeenCalledTimes(1);
      expect(verificationRepo.delete).toHaveBeenCalledWith(
        mockedVerification.id,
      );
      expect(result).toEqual({ ok: true });
    });

    it('should fail if verification not found', async () => {
      // Mock the database call
      verificationRepo.findOne.mockResolvedValue(null);

      // Call the service
      const result = await service.verifyEmail('');

      // Check if the result is correct
      expect(result).toEqual({ ok: false, error: 'Could not verify email.' });
    });

    it('should fail on exception', async () => {
      // Mock the database call
      verificationRepo.findOne.mockRejectedValue(new Error('test'));

      // Call the service
      const result = await service.verifyEmail('');

      // Check if the result is correct
      expect(result).toEqual({ ok: false, error: 'Could not verify email.' });
    });
  });
});
