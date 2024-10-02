import { Test, TestingModule } from '@nestjs/testing';
import { AuthGrpcController } from './auth-grpc.controller';
import { AuthService } from '../auth.service';

describe('AuthGrpcController', () => {
  let controller: AuthGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGrpcController],
    })
      .useMocker((token) => {
        if (token == AuthService) {
          return {
            validateUserTokenRpc: jest.fn().mockResolvedValue({
              user: { userId: '123', email: 'user@example.com' },
              empty: {},
            }),
          };
        }
      })
      .compile();

    controller = module.get<AuthGrpcController>(AuthGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
