import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service.js';
import type { JwtPayload } from '../auth.types.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<string>() !== 'graphql') {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext<{ req: { headers: Record<string, string | undefined>; user?: unknown } }>().req;
    const token = this.extractBearerToken(req.headers.authorization);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      req.user = await this.authService.validateJwtPayload(payload);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractBearerToken(header?: string): string | undefined {
    if (!header?.startsWith('Bearer ')) {
      return undefined;
    }
    const token = header.slice('Bearer '.length).trim();
    return token.length > 0 ? token : undefined;
  }
}
