import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { JwtService } from './jwt.service';
import { JWT_OPTIONS } from '../common/common.constants';
import exp from 'constants';

const TEST_KEY = 'testKey';
const TOKEN = 'TOKEN';
const USER_ID = 1;

// Define a mock jwt service
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => TOKEN),
    verify: jest.fn(() => ({ id: USER_ID })),
  };
});

describe('JwtService', () => {
  let service: JwtService;

  // Create a new testing module before each test
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: JWT_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', () => {
      // Act
      const token = service.sign(1);

      // Assert
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, TEST_KEY);
      expect(token).toEqual(expect.any(String));
    });
  });

  describe('verify', () => {
    it('should return the decoded token', () => {
      // Act
      const decodedToken = service.verify(TOKEN);

      // Assert
      expect(decodedToken).toEqual({ id: USER_ID });
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY);
    });
  });
});
