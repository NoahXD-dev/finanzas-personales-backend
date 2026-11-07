import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DRIZZLE } from '../src/database/database.constants.js';
import {
  closeTestDb,
  createTestDb,
  type TestDb,
} from './helpers/pglite.js';

type GqlResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

function gql(
  server: App,
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
) {
  const req = request(server)
    .post('/graphql')
    .send({ query, variables });
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
  return req;
}

// Prueba HTTP raíz y flujos GraphQL de auth y movimientos con base aislada.
describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let testDb: TestDb;
  let superToken: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'e2e-test-jwt-secret';
    process.env.SUPER_EMAIL = 'e2e-super@test.com';
    process.env.SUPER_PASSWORD = 'e2e-super-password';
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@127.0.0.1:5432/finanzas_e2e';

    testDb = await createTestDb();

    const { AppModule } = await import('../src/app.module.js');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DRIZZLE)
      .useValue(testDb.db)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await gql(
      app.getHttpServer(),
      `mutation Login($input: LoginInput!) {
        login(input: $input) { accessToken }
      }`,
      {
        input: {
          email: 'e2e-super@test.com',
          password: 'e2e-super-password',
        },
      },
    ).expect(200);

    const body = loginRes.body as GqlResponse<{
      login: { accessToken: string };
    }>;
    superToken = body.data!.login.accessToken;
  });

  afterAll(async () => {
    await app.close();
    await closeTestDb(testDb.client);
  });

  // Endpoint REST de bienvenida de Nest (no GraphQL).
  describe('HTTP GET /', () => {
    it('responde 200 con Hello World!', async () => {
      await request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  // Mutations públicas register y login.
  describe('Auth GraphQL', () => {
    it('register devuelve accessToken y datos del usuario', async () => {
      const res = await gql(
        app.getHttpServer(),
        `mutation Register($input: RegisterInput!) {
          register(input: $input) {
            accessToken
            user { email role status }
          }
        }`,
        {
          input: {
            name: 'E2E User',
            email: 'e2e-user@test.com',
            password: 'password123',
          },
        },
      ).expect(200);

      const body = res.body as GqlResponse<{
        register: {
          accessToken: string;
          user: { email: string; role: string; status: boolean };
        };
      }>;

      expect(body.data?.register.accessToken).toBeTruthy();
      expect(body.data?.register.user.email).toBe('e2e-user@test.com');
      expect(body.data?.register.user.role).toBe('user');
      expect(body.data?.register.user.status).toBe(true);
    });

    it('login devuelve accessToken para credenciales válidas', async () => {
      const res = await gql(
        app.getHttpServer(),
        `mutation Login($input: LoginInput!) {
          login(input: $input) { accessToken user { email } }
        }`,
        {
          input: {
            email: 'e2e-user@test.com',
            password: 'password123',
          },
        },
      ).expect(200);

      const body = res.body as GqlResponse<{
        login: { accessToken: string; user: { email: string } };
      }>;

      expect(body.data?.login.accessToken).toBeTruthy();
      expect(body.data?.login.user.email).toBe('e2e-user@test.com');
    });

    it('me sin token devuelve error; con token devuelve el perfil', async () => {
      const noAuth = await gql(
        app.getHttpServer(),
        `query { me { email } }`,
      ).expect(200);

      expect((noAuth.body as GqlResponse<unknown>).errors?.length).toBeGreaterThan(
        0,
      );

      const loginRes = await gql(
        app.getHttpServer(),
        `mutation Login($input: LoginInput!) {
          login(input: $input) { accessToken }
        }`,
        {
          input: {
            email: 'e2e-user@test.com',
            password: 'password123',
          },
        },
      ).expect(200);

      const token = (
        loginRes.body as GqlResponse<{ login: { accessToken: string } }>
      ).data!.login.accessToken;

      const meRes = await gql(
        app.getHttpServer(),
        `query { me { email name } }`,
        undefined,
        token,
      ).expect(200);

      const meBody = meRes.body as GqlResponse<{
        me: { email: string; name: string };
      }>;
      expect(meBody.data?.me.email).toBe('e2e-user@test.com');
      expect(meBody.data?.me.name).toBe('E2E User');
    });
  });

  // Aislamiento de movimientos y permisos super vs user.
  describe('Movimientos y roles (GraphQL)', () => {
    let tokenA: string;
    let tokenB: string;
    let userBId: number;

    beforeAll(async () => {
      await gql(
        app.getHttpServer(),
        `mutation Register($input: RegisterInput!) {
          register(input: $input) { accessToken }
        }`,
        {
          input: {
            name: 'User A',
            email: 'move-a@test.com',
            password: 'pass-a',
          },
        },
      ).expect(200);

      const regB = await gql(
        app.getHttpServer(),
        `mutation Register($input: RegisterInput!) {
          register(input: $input) { accessToken user { id } }
        }`,
        {
          input: {
            name: 'User B',
            email: 'move-b@test.com',
            password: 'pass-b',
          },
        },
      ).expect(200);

      const regBBody = regB.body as GqlResponse<{
        register: { accessToken: string; user: { id: number } };
      }>;
      tokenB = regBBody.data!.register.accessToken;
      userBId = Number(regBBody.data!.register.user.id);

      const loginA = await gql(
        app.getHttpServer(),
        `mutation Login($input: LoginInput!) {
          login(input: $input) { accessToken }
        }`,
        { input: { email: 'move-a@test.com', password: 'pass-a' } },
      ).expect(200);
      tokenA = (
        loginA.body as GqlResponse<{ login: { accessToken: string } }>
      ).data!.login.accessToken;

      await gql(
        app.getHttpServer(),
        `mutation Create($input: CreateMovementInput!) {
          createMovement(input: $input) { id description }
        }`,
        {
          input: {
            description: 'Solo de A',
            amount: 100,
            type: 'income',
            category: 'test',
            date: '2025-07-01',
          },
        },
        tokenA,
      ).expect(200);
    });

    it('cada usuario solo ve sus propios movimientos en movements', async () => {
      const resA = await gql(
        app.getHttpServer(),
        `query { movements { description userId } }`,
        undefined,
        tokenA,
      ).expect(200);

      const listA = (
        resA.body as GqlResponse<{
          movements: { description: string; userId: number }[];
        }>
      ).data!.movements;

      expect(listA).toHaveLength(1);
      expect(listA[0].description).toBe('Solo de A');

      const resB = await gql(
        app.getHttpServer(),
        `query { movements { description } }`,
        undefined,
        tokenB,
      ).expect(200);

      const listB = (
        resB.body as GqlResponse<{ movements: { description: string }[] }>
      ).data!.movements;
      expect(listB).toHaveLength(0);
    });

    it('query users falla para user y responde para super', async () => {
      const asUser = await gql(
        app.getHttpServer(),
        `query { users { email } }`,
        undefined,
        tokenA,
      ).expect(200);

      expect((asUser.body as GqlResponse<unknown>).errors?.length).toBeGreaterThan(
        0,
      );

      const asSuper = await gql(
        app.getHttpServer(),
        `query { users { email } }`,
        undefined,
        superToken,
      ).expect(200);

      const emails = (
        asSuper.body as GqlResponse<{ users: { email: string }[] }>
      ).data!.users.map((u) => u.email);

      expect(emails).toContain('move-a@test.com');
      expect(emails).toContain('e2e-super@test.com');
    });

    it('createMovement guarda ítems dentro del amount y otro usuario no los lee', async () => {
      const created = await gql(
        app.getHttpServer(),
        `mutation Create($input: CreateMovementInput!) {
          createMovement(input: $input) {
            id
            amount
            items { name price subcategory position }
          }
        }`,
        {
          input: {
            description: 'Ticket',
            amount: 100,
            type: 'expense',
            category: 'food',
            date: '2025-08-02',
            items: [
              { name: 'Leche', price: 25, subcategory: 'lácteos' },
              { name: 'Pan', price: 15, subcategory: 'panadería' },
            ],
          },
        },
        tokenA,
      ).expect(200);

      const createdBody = created.body as GqlResponse<{
        createMovement: {
          id: string;
          amount: number;
          items: {
            name: string;
            price: number;
            subcategory: string;
            position: number;
          }[];
        };
      }>;
      expect(createdBody.errors).toBeUndefined();
      expect(createdBody.data?.createMovement.amount).toBe(100);
      expect(createdBody.data?.createMovement.items).toEqual([
        { name: 'Leche', price: 25, subcategory: 'lácteos', position: 0 },
        { name: 'Pan', price: 15, subcategory: 'panadería', position: 1 },
      ]);

      const movementId = Number(createdBody.data!.createMovement.id);
      const denied = await gql(
        app.getHttpServer(),
        `query One($id: Int!) { movement(id: $id) { id } }`,
        { id: movementId },
        tokenB,
      ).expect(200);
      expect(
        (denied.body as GqlResponse<unknown>).errors?.length,
      ).toBeGreaterThan(0);

      const exceed = await gql(
        app.getHttpServer(),
        `mutation Create($input: CreateMovementInput!) {
          createMovement(input: $input) { id }
        }`,
        {
          input: {
            description: 'De más',
            amount: 10,
            type: 'expense',
            category: 'food',
            date: '2025-08-03',
            items: [{ name: 'Carne', price: 11, subcategory: 'carnes' }],
          },
        },
        tokenA,
      ).expect(200);
      expect(
        (exceed.body as GqlResponse<unknown>).errors?.[0]?.message,
      ).toContain('Item total exceeds movement amount');
    });

    it('tras inactivar un usuario, login de esa cuenta falla', async () => {
      const inactive = await gql(
        app.getHttpServer(),
        `mutation SetStatus($id: Int!, $status: Boolean!) {
          setUserStatus(id: $id, status: $status) { status }
        }`,
        { id: userBId, status: false },
        superToken,
      ).expect(200);

      expect(
        (
          inactive.body as GqlResponse<{
            setUserStatus: { status: boolean };
          }>
        ).data?.setUserStatus.status,
      ).toBe(false);

      const loginFail = await gql(
        app.getHttpServer(),
        `mutation Login($input: LoginInput!) {
          login(input: $input) { accessToken }
        }`,
        { input: { email: 'move-b@test.com', password: 'pass-b' } },
      ).expect(200);

      expect(
        (loginFail.body as GqlResponse<unknown>).errors?.[0]?.message,
      ).toContain('Account is inactive');
    });
  });
});
