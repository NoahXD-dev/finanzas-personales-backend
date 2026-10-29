import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import { BusinessException } from '../exceptions/business.exception.js';
import { GlobalExceptionFilter } from './global-exception.filter.js';

// Prueba el mapeo de excepciones a respuestas GraphQL y HTTP.
describe('GlobalExceptionFilter', () => {
  const filter = new GlobalExceptionFilter();

  it('convierte BusinessException en GraphQLError con código en extensions', () => {
    const host = {
      getType: () => 'graphql',
    } as ArgumentsHost;

    const error = filter.catch(
      new BusinessException('Regla de negocio', 'BUSINESS_RULE', 422),
      host,
    ) as GraphQLError;

    expect(error).toBeInstanceOf(GraphQLError);
    expect(error.message).toBe('Regla de negocio');
    expect(error.extensions?.code).toBe('BUSINESS_RULE');
  });

  it('convierte HttpException en GraphQLError con código derivado del status', () => {
    const host = {
      getType: () => 'graphql',
    } as ArgumentsHost;

    const error = filter.catch(
      new BadRequestException('Datos inválidos'),
      host,
    ) as GraphQLError;

    expect(error.message).toBe('Datos inválidos');
    expect(error.extensions?.code).toBe('BAD_REQUEST');
  });

  it('responde JSON HTTP con status y mensaje para contexto no GraphQL', () => {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const host = {
      getType: () => 'http',
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(new BadRequestException('Bad'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      message: 'Bad',
      code: 'BAD_REQUEST',
    });
  });

  it('devuelve 500 INTERNAL_SERVER_ERROR para errores desconocidos en HTTP', () => {
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const host = {
      getType: () => 'http',
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(new Error('boom'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    });
  });
});
