import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashingService, JwtServiceUtils } from './utils';
import { SingupRequestDTO, SigninRequestDTO, SigninResponseDto } from './dto';
import { ValidateTokenResponseRPCDto } from '@app/grpc/proto/auth';
import { UserRepository } from '../database/repository/user.repository';
import { IUser } from '../database/repository/interfaces/user.interface';
import { Document } from 'mongoose';

// Extend Document to create a new type without password
type UserDocumentWithoutPassword = Omit<
  Document<unknown, object, IUser> & IUser & Required<{ _id: string }>,
  'password'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtServiceUtils,
    private readonly hashingService: HashingService,
    private readonly usersRepository: UserRepository,
  ) {}

  async signup(payload: SingupRequestDTO): Promise<SigninResponseDto> {
    const { email, password, ...rest } = payload;

    // check if user email exists
    const exists = await this.usersRepository.findByEmail(email);

    if (exists) {
      throw new ConflictException('email already exists');
    }

    // hash password
    const hashedPassword = await this.hashingService.hash(password);

    const user = await this.usersRepository.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error('Error creating user');
    }

    // generate access token

    const accessToken = await this.jwtService.generateAccessToken({
      _id: <string>user._id,
      email: <string>user.email,
    });

    const userBody = this.excludePassword(user);
    return {
      user: userBody,
      accessToken,
    };
  }

  async signin(payload: SigninRequestDTO): Promise<SigninResponseDto> {
    try {
      const user: IUser = await this.usersRepository.findByEmail(payload.email);

      if (!user) {
        throw new NotFoundException('Wrong credentials');
      }

      // check password

      const passwordMatch = await this.hashingService.compare(
        <string>user.password,
        payload.password,
      );

      if (!passwordMatch) {
        throw new NotFoundException('Wrong credentials');
      }

      // generate access token

      const accessToken = await this.jwtService.generateAccessToken({
        _id: user._id,
        email: <string>user.email,
      });

      return {
        user,
        accessToken,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // grpc methods

  async validateUserTokenRpc(
    token: string,
  ): Promise<ValidateTokenResponseRPCDto> {
    if (!token) {
      return {
        empty: {},
      };
    }

    try {
      const decoded = this.jwtService.verifyAccessToken(token);

      if (!decoded) {
        return {
          empty: {},
        };
      }

      return {
        user: {
          userId: decoded._id,
          email: decoded.email,
        },
      };
    } catch (err) {
      console.log(err);
      return {
        empty: {},
      };
    }
  }

  excludePassword<T extends Document & IUser>(
    user: T,
  ): UserDocumentWithoutPassword {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest as UserDocumentWithoutPassword;
  }
}
