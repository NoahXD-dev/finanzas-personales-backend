# Graph Report - finanzas-personales-backend  (2026-10-23)

## Corpus Check
- 53 files · ~6,484 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .gql 1)

## Summary
- 379 nodes · 754 edges · 15 communities
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth Guards and JWT
- Movements Service API
- Auth Docs Concepts
- Project Package Metadata
- Database Schema Bootstrap
- App Shell and Tests
- Movement Types Inputs
- TypeScript Compiler Config
- Dev Dependencies
- Stack and Modules Docs
- NPM Scripts
- Runtime Dependencies
- Oxlint Rules
- Build TypeScript Config
- Nest CLI Config

## God Nodes (most connected - your core abstractions)
1. `AuthenticatedUser` - 31 edges
2. `MovementsService` - 19 edges
3. `compilerOptions` - 19 edges
4. `scripts` - 17 edges
5. `@nestjs/common` - 17 edges
6. `@nestjs/graphql` - 17 edges
7. `AuthService` - 17 edges
8. `JWT` - 17 edges
9. `API GraphQL finanzas personales` - 15 edges
10. `CurrentUser` - 14 edges

## Surprising Connections (you probably didn't know these)
- `AuthPayload` --references--> `User`  [EXTRACTED]
  src/auth/auth-payload.entity.ts → src/auth/user.entity.ts
- `User` --references--> `UserRole`  [EXTRACTED]
  src/auth/user.entity.ts → src/auth/user-role.enum.ts
- `CreateMovementInput` --references--> `MovementType`  [EXTRACTED]
  src/movements/create-movement.input.ts → src/movements/movement.entity.ts
- `MovementFilterInput` --references--> `MovementType`  [EXTRACTED]
  src/movements/movement-summary.entity.ts → src/movements/movement.entity.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **API GraphQL de movimientos** — readme_movements, readme_movement, readme_movement_summary, readme_movements_by_category, readme_movements_by_month, readme_create_movement, readme_update_movement, readme_delete_movement, readme_movimiento [EXTRACTED 1.00]
- **Autenticación JWT y ciclo de cuenta** — readme_register, readme_login, readme_logout, readme_me, readme_users, readme_set_user_status, readme_jwt, readme_access_token, readme_token_version, readme_user_status, readme_revocacion_sesion [EXTRACTED 1.00]
- **Stack tecnológico del backend** — readme_api_graphql, readme_nestjs, readme_apollo_graphql, readme_drizzle_orm, readme_sqlite, readme_jwt, readme_bcrypt [EXTRACTED 1.00]

## Communities (15 total, 0 thin omitted)

### Community 0 - "Auth Guards and JWT"
Cohesion: 0.06
Nodes (19): @nestjs/jwt, AuthPayload, AuthResolver, AuthService, DrizzleDB, JwtPayload, IS_PUBLIC_KEY, Public() (+11 more)

### Community 1 - "Movements Service API"
Cohesion: 0.15
Nodes (6): AuthenticatedUser, CurrentUser, movements, Movement, MovementsResolver, MovementsService

### Community 2 - "Auth Docs Concepts"
Cohesion: 0.14
Nodes (31): accessToken, Módulo auth, Balance, bcrypt, createMovement, deleteMovement, expense, income (+23 more)

### Community 3 - "Project Package Metadata"
Cohesion: 0.06
Nodes (31): author, description, license, name, overrides, @graphql-tools/utils, private, type (+23 more)

### Community 4 - "Database Schema Bootstrap"
Cohesion: 0.10
Nodes (13): bcrypt, better-sqlite3, drizzle-orm, DatabaseBootstrapService, DrizzleDB, DRIZZLE, DatabaseModule, Movement (+5 more)

### Community 5 - "App Shell and Tests"
Cohesion: 0.10
Nodes (12): graphql, @nestjs/common, @nestjs/testing, supertest, AppController, AppModule, AppService, AuthModule (+4 more)

### Community 6 - "Movement Types Inputs"
Cohesion: 0.20
Nodes (11): @nestjs/graphql, CreateMovementInput, MovementType, expense, income, MovementByCategory, MovementByMonth, MovementFilterInput (+3 more)

### Community 7 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental, isolatedModules (+11 more)

### Community 8 - "Dev Dependencies"
Cohesion: 0.11
Nodes (19): devDependencies, drizzle-kit, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint, prettier (+11 more)

### Community 9 - "Stack and Modules Docs"
Cohesion: 0.13
Nodes (19): Frontend Angular, API GraphQL finanzas personales, Apollo GraphQL, app.module, CORS_ORIGIN, Módulo database, DATABASE_URL, Drizzle ORM (+11 more)

### Community 10 - "NPM Scripts"
Cohesion: 0.12
Nodes (17): scripts, build, db:generate, db:migrate, db:push, deploy, format, lint (+9 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @apollo/server, @as-integrations/express5, bcrypt, better-sqlite3, drizzle-orm, graphql, @nestjs/apollo (+7 more)

### Community 13 - "Oxlint Rules"
Cohesion: 0.29
Nodes (6): env, node, rules, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, $schema

### Community 14 - "Build TypeScript Config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, rootDir, exclude, extends, include

### Community 15 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

## Knowledge Gaps
- **34 isolated node(s):** `@apollo/server`, `@as-integrations/express5`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 174 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `API GraphQL finanzas personales` connect `Stack and Modules Docs` to `Auth Docs Concepts`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **What connects `@apollo/server`, `@as-integrations/express5`, `@nestjs/platform-express` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth Guards and JWT` be split into smaller, more focused modules?**
  _Cohesion score 0.06277665995975855 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/core` connect `Stack and Modules Docs` to `Auth Guards and JWT`, `Project Package Metadata`, `App Shell and Tests`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Should `Movements Service API` be split into smaller, more focused modules?**
  _Cohesion score 0.14793741109530584 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/common` connect `App Shell and Tests` to `Auth Guards and JWT`, `Project Package Metadata`, `Database Schema Bootstrap`, `Movement Types Inputs`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Auth Docs Concepts` be split into smaller, more focused modules?**
  _Cohesion score 0.1408199643493761 - nodes in this community are weakly interconnected._