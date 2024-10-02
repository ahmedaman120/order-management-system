import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@app/common';
import { SingupRequestDTO, SigninRequestDTO, SigninResponseDto } from './dto';
import { Get } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request, Response } from 'express';

@ApiInternalServerErrorResponse()
@ApiNotAcceptableResponse()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    res
      .header('Access-Control-Allow-Credentials', 'true')
      .cookie('XSRF-TOKEN', req.csrfToken(), {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
      })
      .send({ csrfToken: req.csrfToken() });
  }

  @ApiOperation({
    summary: 'signup user',
  })
  @ApiResponse({ type: SingupRequestDTO })
  @ApiConflictResponse()
  // permissions
  @Public()
  @Post('user/signup')
  signup(
    @Body() signUpRequestDto: SingupRequestDTO,
  ): Promise<SigninResponseDto> {
    return this.authService.signup(signUpRequestDto);
  }

  @ApiOperation({
    summary: 'signin user',
  })
  @ApiResponse({ type: SigninRequestDTO })
  @ApiNotFoundResponse()
  // permissions
  @Public()
  @Post('user/signin')
  signin(
    @Body() signinRequestDto: SigninRequestDTO,
  ): Promise<SigninResponseDto> {
    return this.authService.signin(signinRequestDto);
  }
}
