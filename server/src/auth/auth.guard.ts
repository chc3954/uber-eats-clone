import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowRoles } from './role.decorator';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // canActivate is a method that takes a context and returns a boolean.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the roles from the metadata of the handler.
    const roles = this.reflector.get<AllowRoles>('roles', context.getHandler());
    // If there are no roles, return true.
    if (!roles) {
      return true;
    }

    // Get the user from the context.
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;

    if (token) {
      const decoded = this.jwtService.verify(token.toString());

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id']);

        if (user) {
          gqlContext['user'] = user;
          return roles.includes('Any') || roles.includes(user.role);
        }
      }
      return false;
    }
  }
}
