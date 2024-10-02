import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { HashingService, JwtServiceUtils } from './utils';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './utils/constants';
import { AccessTokenStrategy } from './strategies';
import { UserRepository } from '../database/repository/user.repository';
import { DatabaseModule } from '../database/database.module';
import { AuthGrpcController } from './auth-grpc/auth-grpc.controller';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRE || '10d' },
    }),
    PassportModule,
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService, JwtServiceUtils, HashingService],
})
export class AuthModule {}
