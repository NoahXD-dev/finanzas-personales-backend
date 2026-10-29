import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { users } from '../database/schema/users.js';
import {
  closeTestDb,
  createTestDb,
  type TestSqlite,
} from '../../test/helpers/sqlite.js';
import { AuthService } from './auth.service.js';
import { UserRole } from './user-role.enum.js';

const JWT_SECRET = 'test-jwt-secret';

async function insertUser(
  db: TestSqlite['db'],
  data: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'super';
    status?: boolean;
    tokenVersion?: number;
  },
) {
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const [row] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.trim().toLowerCase(),
      passwordHash,
      role: data.role ?? 'user',
      tokenVersion: data.tokenVersion ?? 0,
      status: data.status ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return row;
}

// Prueba registro, login, logout, estado de usuarios y validación de JWT.
describe('AuthService', () => {
  let testDb: TestSqlite;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    testDb = createTestDb();
    jwtService = new JwtService({ secret: JWT_SECRET });
    authService = new AuthService(testDb.db, jwtService);
  });

  afterEach(() => {
    closeTestDb(testDb.sqlite);
  });

  // register: datos normalizados, rol user y token en la respuesta.
  describe('register', () => {
    it('crea usuario con email en minúsculas, nombre recortado, rol user, activo y accessToken', async () => {
      const result = await authService.register({
        name: '  Ana Pérez  ',
        email: '  ANA@Example.COM  ',
        password: 'secret123',
      });

      expect(result.accessToken).toBeTruthy();
      expect(result.user.name).toBe('Ana Pérez');
      expect(result.user.email).toBe('ana@example.com');
      expect(result.user.role).toBe(UserRole.user);
      expect(result.user.status).toBe(true);

      const payload = jwtService.verify(result.accessToken);
      expect(payload.sub).toBe(result.user.id);
      expect(payload.tokenVersion).toBe(0);
    });

    it('rechaza un email ya registrado con ConflictException', async () => {
      await authService.register({
        name: 'Uno',
        email: 'dup@test.com',
        password: 'pass',
      });

      await expect(
        authService.register({
          name: 'Dos',
          email: 'dup@test.com',
          password: 'other',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // login: credenciales válidas e inválidas; cuenta inactiva.
  describe('login', () => {
    it('devuelve accessToken y usuario cuando email y contraseña son correctos', async () => {
      await insertUser(testDb.db, {
        name: 'Login User',
        email: 'login@test.com',
        password: 'correct',
      });

      const result = await authService.login({
        email: 'login@test.com',
        password: 'correct',
      });

      expect(result.accessToken).toBeTruthy();
      expect(result.user.email).toBe('login@test.com');
    });

    it('usa el mismo mensaje para contraseña incorrecta y usuario inexistente', async () => {
      await insertUser(testDb.db, {
        name: 'U',
        email: 'u@test.com',
        password: 'good',
      });

      await expect(
        authService.login({ email: 'u@test.com', password: 'bad' }),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        authService.login({ email: 'nobody@test.com', password: 'x' }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('rechaza login de cuenta inactiva con mensaje específico', async () => {
      await insertUser(testDb.db, {
        name: 'Inactivo',
        email: 'off@test.com',
        password: 'pass',
        status: false,
      });

      await expect(
        authService.login({ email: 'off@test.com', password: 'pass' }),
      ).rejects.toThrow('Account is inactive');
    });
  });

  // logout: incrementa tokenVersion para invalidar sesiones.
  describe('logout', () => {
    it('incrementa tokenVersion del usuario y devuelve true', async () => {
      const row = await insertUser(testDb.db, {
        name: 'Out',
        email: 'out@test.com',
        password: 'p',
      });

      const ok = await authService.logout(row.id);
      expect(ok).toBe(true);

      const [updated] = await testDb.db
        .select()
        .from(users)
        .where(eq(users.id, row.id));
      expect(updated.tokenVersion).toBe(1);
    });

    it('lanza UnauthorizedException si el usuario no existe', async () => {
      await expect(authService.logout(99999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // setUserStatus: activar/inactivar, super protegido, revocación de token.
  describe('setUserStatus', () => {
    it('inactiva usuario guardando actor, fecha y revocando sesión (tokenVersion+1)', async () => {
      const superRow = await insertUser(testDb.db, {
        name: 'Super',
        email: 'super@test.com',
        password: 's',
        role: 'super',
      });
      const target = await insertUser(testDb.db, {
        name: 'Target',
        email: 'target@test.com',
        password: 't',
      });

      const user = await authService.setUserStatus(
        superRow.id,
        target.id,
        false,
      );

      expect(user.status).toBe(false);
      expect(user.inactivatedBy).toBe(superRow.id);
      expect(user.inactivatedAt).toBeTruthy();

      const [row] = await testDb.db
        .select()
        .from(users)
        .where(eq(users.id, target.id));
      expect(row.tokenVersion).toBe(1);
    });

    it('no permite inactivar al usuario super', async () => {
      const superRow = await insertUser(testDb.db, {
        name: 'Super',
        email: 'super2@test.com',
        password: 's',
        role: 'super',
      });

      await expect(
        authService.setUserStatus(superRow.id, superRow.id, false),
      ).rejects.toThrow(BadRequestException);
    });

    it('devuelve el usuario sin cambios si el status ya es el solicitado', async () => {
      const actor = await insertUser(testDb.db, {
        name: 'Actor',
        email: 'actor@test.com',
        password: 'a',
        role: 'super',
      });
      const target = await insertUser(testDb.db, {
        name: 'Active',
        email: 'active@test.com',
        password: 'p',
        status: true,
      });

      const user = await authService.setUserStatus(actor.id, target.id, true);
      expect(user.id).toBe(target.id);
      expect(user.status).toBe(true);
    });

    it('al reactivar limpia inactivatedAt e inactivatedBy', async () => {
      const superRow = await insertUser(testDb.db, {
        name: 'Super',
        email: 'super3@test.com',
        password: 's',
        role: 'super',
      });
      const target = await insertUser(testDb.db, {
        name: 'WasOff',
        email: 'wasoff@test.com',
        password: 'p',
        status: false,
        tokenVersion: 2,
      });
      const now = new Date().toISOString();
      await testDb.db
        .update(users)
        .set({
          inactivatedBy: superRow.id,
          inactivatedAt: now,
        })
        .where(eq(users.id, target.id));

      const user = await authService.setUserStatus(
        superRow.id,
        target.id,
        true,
      );

      expect(user.status).toBe(true);
      expect(user.inactivatedAt).toBeNull();
      expect(user.inactivatedBy).toBeNull();
    });

    it('lanza NotFoundException si el id de usuario no existe', async () => {
      const actor = await insertUser(testDb.db, {
        name: 'Super',
        email: 'super4@test.com',
        password: 's',
        role: 'super',
      });

      await expect(
        authService.setUserStatus(actor.id, 88888, false),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // validateJwtPayload: coherencia con tokenVersion y status en BD.
  describe('validateJwtPayload', () => {
    it('acepta payload cuando el usuario existe, está activo y tokenVersion coincide', async () => {
      const row = await insertUser(testDb.db, {
        name: 'Jwt',
        email: 'jwt@test.com',
        password: 'p',
      });

      const auth = await authService.validateJwtPayload({
        sub: row.id,
        role: UserRole.user,
        tokenVersion: 0,
      });

      expect(auth.id).toBe(row.id);
      expect(auth.email).toBe('jwt@test.com');
    });

    it('rechaza si el usuario no existe, está inactivo o tokenVersion no coincide', async () => {
      const inactive = await insertUser(testDb.db, {
        name: 'Off',
        email: 'off2@test.com',
        password: 'p',
        status: false,
      });

      await expect(
        authService.validateJwtPayload({
          sub: 99999,
          role: UserRole.user,
          tokenVersion: 0,
        }),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        authService.validateJwtPayload({
          sub: inactive.id,
          role: UserRole.user,
          tokenVersion: 0,
        }),
      ).rejects.toThrow(UnauthorizedException);

      const active = await insertUser(testDb.db, {
        name: 'Ver',
        email: 'ver@test.com',
        password: 'p',
        tokenVersion: 3,
      });

      await expect(
        authService.validateJwtPayload({
          sub: active.id,
          role: UserRole.user,
          tokenVersion: 0,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
