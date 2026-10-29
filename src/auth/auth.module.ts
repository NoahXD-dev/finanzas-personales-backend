import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
}

function resolveJwtExpiresIn(): JwtSignOptions['expiresIn'] {
  return (process.env.JWT_EXPIRES_IN ?? '7d') as JwtSignOptions['expiresIn'];
}

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: resolveJwtSecret(),
      signOptions: {
        expiresIn: resolveJwtExpiresIn(),
      },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
