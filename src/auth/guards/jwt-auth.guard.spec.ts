import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedUser } from '../auth.types.js';
import { AuthService } from '../auth.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { UserRole } from '../user-role.enum.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

const authUser: AuthenticatedUser = {
  id: 1,
  name: 'Test',
  email: 't@test.com',
  role: UserRole.user,
  tokenVersion: 0,
  status: true,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
  inactivatedAt: null,
  inactivatedBy: null,
};

function createGqlContext(authorization?: string) {
  const req = {
    headers: { authorization },
    user: undefined as AuthenticatedUser | undefined,
  };
  return {
    getType: () => 'graphql',
    getHandler: () => ({}),
    getClass: () => ({}),
    getArgs: () => [{}, {}, { req }, {}],
  } as unknown as ExecutionContext;
}

// Prueba el guard JWT en contexto GraphQL: rutas públicas y Bearer.
describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  let authService: Pick<AuthService, 'validateJwtPayload'>;

  beforeEach(() => {
    reflector = new Reflector();
    jwtService = new JwtService({ secret: 'guard-test-secret' });
    authService = {
      validateJwtPayload: vi.fn().mockResolvedValue(authUser),
    };
    guard = new JwtAuthGuard(reflector, jwtService, authService as AuthService);
  });

  it('deja pasar peticiones que no son GraphQL sin validar token', async () => {
    const ctx = {
      getType: () => 'http',
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('deja pasar operaciones marcadas como @Public()', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return true;
      return undefined;
    });

    const ctx = createGqlContext();
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('rechaza GraphQL protegido sin header Authorization', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const ctx = createGqlContext();
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('rechaza token Bearer inválido o mal formado', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const badFormat = createGqlContext('NotBearer xxx');
    await expect(guard.canActivate(badFormat)).rejects.toThrow(
      UnauthorizedException,
    );

    const badToken = createGqlContext('Bearer not-a-valid-jwt');
    await expect(guard.canActivate(badToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('valida JWT y asigna req.user en operaciones protegidas', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const token = jwtService.sign({
      sub: 1,
      role: UserRole.user,
      tokenVersion: 0,
    });
    const req = {
      headers: { authorization: `Bearer ${token}` },
      user: undefined as AuthenticatedUser | undefined,
    };
    const ctx = {
      getType: () => 'graphql',
      getHandler: () => ({}),
      getClass: () => ({}),
      getArgs: () => [{}, {}, { req }, {}],
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(req.user).toEqual(authUser);
    expect(authService.validateJwtPayload).toHaveBeenCalled();
  });
});
