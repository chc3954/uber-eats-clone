import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { JwtService } from './jwt.service';
import { JWT_OPTIONS } from '../common/common.constants';
import exp from 'constants';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'TOKEN'),
  };
});

const TEST_KEY = 'testKey';

describe('JwtService', () => {
  let service: JwtService;

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
      const token = service.sign(1);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, TEST_KEY);
      expect(token).toEqual(expect.any(String));
    });
  });

  describe('verify', () => {
    it('should return the decoded token', () => {});
  });
});
