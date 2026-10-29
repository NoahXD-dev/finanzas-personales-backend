import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { BusinessException } from '../exceptions/business.exception.js';

type ErrorPayload = {
  message: string;
  code: string;
  httpStatus: number;
};

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: unknown, host: ArgumentsHost): GraphQLError | void {
    const payload = this.toErrorPayload(exception);

    if (host.getType<string>() === 'graphql') {
      return new GraphQLError(payload.message, {
        extensions: { code: payload.code },
      });
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{ status: (code: number) => { json: (body: unknown) => void } }>();
    response.status(payload.httpStatus).json({
      message: payload.message,
      code: payload.code,
    });
  }

  private toErrorPayload(exception: unknown): ErrorPayload {
    if (exception instanceof BusinessException) {
      return {
        message: exception.message,
        code: exception.code,
        httpStatus: exception.httpStatus,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message = this.extractHttpExceptionMessage(response, exception);

      return {
        message,
        code: HttpStatus[status] ?? 'HTTP_EXCEPTION',
        httpStatus: status,
      };
    }

    return {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private extractHttpExceptionMessage(
    response: string | object,
    exception: HttpException,
  ): string {
    if (typeof response === 'string') {
      return response;
    }
    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const message = (response as { message: string | string[] }).message;
      return Array.isArray(message) ? message.join(', ') : message;
    }
    return exception.message;
  }
}
