import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { AuthModule } from './auth/auth.module.js';
import { MovementsModule } from './movements/movements.module.js';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.VITEST
        ? join(tmpdir(), 'finanzas-personales-schema-test.gql')
        : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: unknown }) => ({ req }),
    }),
    AuthModule,
    MovementsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
