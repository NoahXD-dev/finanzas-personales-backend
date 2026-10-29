# AGENTS.md — finanzas-personales-backend

API GraphQL para una app de finanzas personales. Los clientes son un frontend Angular 21 y una app Flutter (iOS/Android).

## Stack

- Lenguaje: TypeScript (modo estricto)
- Framework: NestJS
- API: GraphQL
- Base de datos: SQLite (temporal) con Drizzle ORM. Se evalúa migrar a PostgreSQL o MySQL, así que no uses APIs exclusivas de SQLite sin dejarlo anotado.
- Seguridad: JWT para autenticación, bcrypt para contraseñas
- Diagramas: Mermaid

## Comandos

```bash
npm install
npm run start:dev      # servidor en modo watch
npm run build
npm run lint
npm run test           # unitarias
npm run test:e2e       # end-to-end

npx drizzle-kit generate   # genera migración a partir del esquema
npx drizzle-kit migrate    # aplica migraciones
```

Antes de dar una tarea por terminada: `npm run lint`, `npm run build` y `npm run test` deben pasar.

## Estructura y convenciones

- Un módulo de NestJS por dominio (por ejemplo `auth`, `users`, `accounts`, `transactions`, `categories`). Cada módulo tiene su resolver, service y DTOs/inputs.
- Los resolvers solo reciben y devuelven datos. La lógica de negocio va en los services.
- Los services acceden a datos solo a través de Drizzle. No escribas SQL a mano salvo que Drizzle no lo permita.
- Los esquemas de Drizzle viven en un solo lugar (carpeta de base de datos) y se importan desde ahí. No dupliques tipos: infiere con `InferSelectModel` / `InferInsertModel`.
- Valida todos los inputs con `class-validator`. No confíes en datos del cliente.
- Nombres: archivos en `kebab-case`, clases en `PascalCase`, campos GraphQL en `camelCase`.

## Dinero y fechas

- Nunca guardes montos como `float`. Usa enteros en centavos o un tipo decimal, y mantén la misma decisión en todo el proyecto.
- Guarda fechas en UTC (ISO 8601) y deja la conversión de zona horaria a los clientes.

## Seguridad

- Contraseñas: siempre con bcrypt. Nunca las registres en logs ni las devuelvas en respuestas GraphQL.
- Protege con guard JWT todo query o mutation que no sea login o registro.
- Cada consulta de datos financieros debe filtrar por el usuario autenticado. Un usuario nunca debe poder leer o modificar datos de otro.
- Secretos (JWT secret, URL de la base de datos) solo en variables de entorno. No los subas al repositorio ni los escribas en el código. Mantén `.env.example` actualizado.
- No expongas errores internos al cliente; devuelve mensajes controlados.

## Base de datos y migraciones

- Todo cambio de esquema pasa por una migración generada con `drizzle-kit`. No edites migraciones ya aplicadas; crea una nueva.
- Si agregas una columna o tabla, actualiza también los inputs, DTOs y tipos GraphQL relacionados.

## GraphQL

- Los cambios al esquema GraphQL no deben romper a los clientes (Angular y Flutter). Si debes eliminar o renombrar un campo, avísalo antes y propón una transición.
- Los errores usan el mismo formato en todo el proyecto.

## Pruebas

- Los services nuevos llevan pruebas unitarias.
- Los flujos de autenticación y de permisos por usuario llevan pruebas e2e.

## Documentación

- Los diagramas están en Mermaid dentro de `docs/`. Si cambias el modelo de datos o un flujo (por ejemplo autenticación), actualiza el diagrama correspondiente.

## Cómo trabajar

- Haz cambios pequeños y enfocados. No refactorices código fuera del alcance de la tarea.
- Si falta información o hay varias formas razonables de hacer algo, pregunta antes de asumir.
- Reutiliza lo que ya existe en el repo antes de crear algo nuevo.