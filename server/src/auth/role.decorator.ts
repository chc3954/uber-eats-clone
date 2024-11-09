import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

// AllowRoles is a type that is either a key of UserRole or 'Any'.
export type AllowRoles = keyof typeof UserRole | 'Any';

// Role is a decorator that takes an array of AllowRoles and sets the metadata of the handler to the roles.
export const Role = (roles: AllowRoles[]) => SetMetadata('roles', roles);
