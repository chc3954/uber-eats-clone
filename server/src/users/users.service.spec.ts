import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
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
      // Arrange
      userRepo.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });

      // Act
      const result = await service.createAccount(createAccountArgs);

      // Assert
      expect(result).toEqual({
        ok: false,
        error: 'There is a user with that email already.',
      });
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create a new user and return it', async () => {
      // Arrange
      userRepo.findOne.mockResolvedValue(undefined);
      userRepo.create.mockReturnValue(createAccountArgs);
      userRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.create.mockReturnValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue(createAccountArgs);
      verificationRepo.save.mockResolvedValue({
        code: 'code',
      });

      // Act
      const result = await service.createAccount(createAccountArgs);

      // Assert
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
      // Arrange
      userRepo.findOne.mockRejectedValue(new Error('test'));

      // Act
      const result = await service.createAccount(createAccountArgs);

      // Assert
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
      // Arrange
      userRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await service.login(loginArgs);

      // Assert
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
      // Arrange
      userRepo.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      });

      // Act
      const result = await service.login(loginArgs);

      // Assert
      expect(result).toEqual({
        ok: false,
        error: 'Incorrect password.',
      });
    });

    it('should return a token', async () => {
      // Arrange
      userRepo.findOne.mockResolvedValue({
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      });

      // Act
      const result = await service.login(loginArgs);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
      expect(result.ok).toBe(true);
      expect(result.token).toBe('token');
    });

    it('should fail on exception', async () => {
      // Arrange
      userRepo.findOne.mockRejectedValue(new Error('test'));

      // Act
      const result = await service.login(loginArgs);

      // Assert
      expect(result).toEqual({
        ok: false,
        error: 'Could not log user in.',
      });
    });
  });

  describe('findById', () => {
    it('should find a existing user', async () => {
      // Arrange
      userRepo.findOneOrFail.mockResolvedValue({
        id: 1,
      });

      // Act
      const result = await service.findById(1);

      // Assert
      expect(result).toEqual({
        ok: true,
        user: { id: 1 },
      });
    });

    it('should fail if no user is found', async () => {
      // Arrange
      userRepo.findOneOrFail.mockRejectedValue(new Error('test'));

      // Act
      const result = await service.findById(1);

      // Assert
      expect(result).toEqual({
        ok: false,
        error: 'Could not find user.',
      });
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      // Arrange
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

      // Act
      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);

      // Assert
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
      // Arrange
      const editProfileArgs = {
        userId: 1,
        input: { password: 'newPassword' },
      };
      userRepo.findOne.mockResolvedValue({ password: 'oldPassword' });

      // Act
      const result = await service.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      // Assert
      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith({
        password: editProfileArgs.input.password,
      });
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      // Arrange
      userRepo.findOne.mockRejectedValue(new Error('test'));

      // Act
      const result = await service.editProfile(1, { email: 'try@new.com' });

      // Assert
      expect(result).toEqual({ ok: false, error: 'Could not update profile.' });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      // Arrange
      const mockedVerification = {
        id: 1,
        user: { verified: false },
      };
      verificationRepo.findOne.mockResolvedValue(mockedVerification);

      // Act
      const result = await service.verifyEmail('');

      // Assert
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
      // Arrange
      verificationRepo.findOne.mockResolvedValue(null);

      // Act
      const result = await service.verifyEmail('');

      // Assert
      expect(result).toEqual({ ok: false, error: 'Could not verify email.' });
    });

    it('should fail on exception', async () => {
      // Arrange
      verificationRepo.findOne.mockRejectedValue(new Error('test'));

      // Act
      const result = await service.verifyEmail('');

      // Assert
      expect(result).toEqual({ ok: false, error: 'Could not verify email.' });
    });
  });
});
