import { JwtDecodedEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceUtils {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateAccessToken(payload: {
    _id: string;
    email: string;
  }): Promise<string> {
    const { _id, email } = payload;

    const accessToken = await this.jwtService.signAsync(
      {
        sub: _id,
        email,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
      },
    );

    return accessToken;
  }

  verifyAccessToken(token: string): JwtDecodedEntity | null {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    if (!decoded) return null;

    return {
      _id: decoded.sub,
      email: decoded.email,
    };
  }
}
