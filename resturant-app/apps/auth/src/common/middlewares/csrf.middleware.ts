import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csurf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection = csurf({
    cookie: {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.csrfProtection(req, res, (err) => {
      if (err && err.code === 'EBADCSRFTOKEN') {
        throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
      } else if (err) {
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      next();
    });
  }
}
