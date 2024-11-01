import { MAIL_OPTIONS } from 'src/common/common.constants';
import got from 'got';
import * as FormData from 'form-data';
import { MailService } from './mail.service';
import { Test } from '@nestjs/testing';

jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'testDomain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MAIL_OPTIONS,
          useValue: {
            apiKey: 'testKey',
            domain: TEST_DOMAIN,
            fromEmail: 'testEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      // Arrange
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);

      // Act
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      // Assert
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'verify-email',
        sendVerificationEmailArgs.email,
        'Verify Your Email',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    it('sends email', async () => {
      // Arrange
      const formSpy = jest.spyOn(FormData.prototype, 'append');

      // Act
      const ok = await service.sendEmail('', '', '', []);

      // Assert
      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(ok).toEqual(true);
    });

    it('fails on error', async () => {
      // Arrange
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });

      // Act
      const ok = await service.sendEmail('', '', '', []);

      // Assert
      expect(ok).toEqual(false);
    });

    it('should fail on error', async () => {
      // Arrange
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {
        throw new Error();
      });

      // Act & Assert
      await expect(
        service.sendEmail('template', 'to', 'subject', []),
      ).rejects.toThrowError();
    });
  });
});
