import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AuthenticatedUser } from '../auth.types.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import type { UserRole } from '../user-role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType<string>() !== 'graphql') {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext<{ req: { user: AuthenticatedUser } }>()
      .req;
    const user = req.user;
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
