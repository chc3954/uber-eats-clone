import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowRoles } from './role.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // canActivate is a method that takes a context and returns a boolean.
  canActivate(context: ExecutionContext): boolean {
    // Get the roles from the metadata of the handler.
    const roles = this.reflector.get<AllowRoles>('roles', context.getHandler());
    // If there are no roles, return true.
    if (!roles) {
      return true;
    }

    // Get the user from the context.
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];
    // If there is no user, return false.
    if (!user) {
      return false;
    }

    // If the roles include 'Any', return true.
    if (roles.includes('Any')) {
      return true;
    }

    // If the roles in the metadata include the user's role, return true.
    return roles.includes(user.role);
  }
}
