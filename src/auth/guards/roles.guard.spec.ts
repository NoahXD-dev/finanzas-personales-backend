import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedUser } from '../auth.types.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { UserRole } from '../user-role.enum.js';
import { RolesGuard } from './roles.guard.js';

function gqlContextWithUser(user?: AuthenticatedUser): ExecutionContext {
  const req = { user };
  return {
    getType: () => 'graphql',
    getHandler: () => ({}),
    getClass: () => ({}),
    getArgs: () => [{}, {}, { req }, {}],
  } as unknown as ExecutionContext;
}

const regularUser: AuthenticatedUser = {
  id: 2,
  name: 'User',
  email: 'u@test.com',
  role: UserRole.user,
  tokenVersion: 0,
  status: true,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
  inactivatedAt: null,
  inactivatedBy: null,
};

// Prueba el guard de roles en resolvers GraphQL con @Roles().
describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('permite acceso si el handler no declara roles requeridos', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = gqlContextWithUser(regularUser);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('deniega con ForbiddenException si el rol del usuario no está en la lista', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [UserRole.super];
      return undefined;
    });

    const ctx = gqlContextWithUser(regularUser);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('permite acceso cuando el rol del usuario coincide con el requerido', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === ROLES_KEY) return [UserRole.super];
      return undefined;
    });

    const superUser: AuthenticatedUser = {
      ...regularUser,
      id: 1,
      role: UserRole.super,
    };
    const ctx = gqlContextWithUser(superUser);

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('deja pasar contextos no GraphQL sin comprobar roles', () => {
    const ctx = {
      getType: () => 'http',
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;

    expect(guard.canActivate(ctx)).toBe(true);
  });
});
