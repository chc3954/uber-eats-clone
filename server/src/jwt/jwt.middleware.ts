import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-jwt'];

    // If there is a token, verify it and get the user.
    if (token) {
      const decoded = this.jwtService.verify(token.toString());

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const { ok, user } = await this.usersService.findById(decoded['id']);
          if (ok) {
            req['user'] = user;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
    next();
  }
}
