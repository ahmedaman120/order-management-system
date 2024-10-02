import { AuthService } from './auth.service';
import { HashingService, JwtServiceUtils } from './utils';
import { UserRepository } from '../database/repository/user.repository';
import { TestBed } from '@automock/jest';
import { SingupRequestDTO } from './dto';
import { ConflictException } from '@nestjs/common';
describe('AuthService', () => {
  let service: AuthService;
  let hashService: jest.Mocked<HashingService>;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtServiceUtils>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    service = unit;
    hashService = unitRef.get(HashingService);
    jwtService = unitRef.get(JwtServiceUtils);
    userRepository = unitRef.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test Suite - Signup', () => {
    it('signup function should throw error when email already exists', async () => {
      const mockDBUser: any = {
        _id: '1',
        __v: 0,
        updatedDate: new Date(),
        createdDate: new Date(),
        email: 'test@example.com',
        password: 'test',
        firstName: 'ahmed',
        lastName: 'ayman',
        name: 'ahmed ayman',
        bio: 'test',
        lastSeen: new Date(),
      };
      const mockDTO: SingupRequestDTO = {
        email: 'test@example.com',
        password: 'test',
        firstName: 'ahmed',
        lastName: 'ayman',
        bio: 'test',
      };
      userRepository.findByEmail.mockResolvedValue(mockDBUser);
      try {
        await service.signup(mockDTO);
      } catch (error) {
        expect(error.message).toBe('email already exists');
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it("signup function should throw error when there's issue in creating user", async () => {
      userRepository.create.mockResolvedValue(null);
      const mockDTO: SingupRequestDTO = {
        email: 'test@example.com',
        password: 'test',
        firstName: 'ahmed',
        lastName: 'ayman',
        bio: 'test',
      };
      try {
        await service.signup(mockDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error creating user');
      }
    });

    it('signup function should return valid body', async () => {
      const mockDTO: SingupRequestDTO = {
        email: 'test@example.com',
        password: 'test',
        firstName: 'ahmed',
        lastName: 'ayman',
        bio: 'test',
      };
      const mockDBUser: any = {
        _id: '1',
        __v: 0,
        updatedDate: new Date(),
        createdDate: new Date(),
        email: 'test@example.com',
        password: 'test',
        firstName: 'ahmed',
        lastName: 'ayman',
        name: 'ahmed ayman',
        bio: 'test',
        lastSeen: new Date(),
      };
      const hashPassword =
        '$argon2i$v=19$m=16,t=2,p=1$cTRjNFBtNm1jdnpLNmlzdQ$VsAqUZkpKvJfMAVVy1WsJQ';

      const jwtToken = 'jdasbnjldsan.adbldasbnljsa.ajlsbdnadsln';
      userRepository.create.mockResolvedValue(mockDBUser);
      jwtService.generateAccessToken.mockResolvedValue(jwtToken);
      hashService.hash.mockResolvedValue(hashPassword);
      const user = await service.signup(mockDTO);

      expect(user.user['password']).not.toBeDefined();
    });
  });
});
