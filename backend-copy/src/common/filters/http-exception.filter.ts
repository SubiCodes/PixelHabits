import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // If response is already structured, use it
    if (typeof exceptionResponse === 'object' && 'error' in exceptionResponse) {
      return response.status(status).json(exceptionResponse);
    }

    // Otherwise, create structured response
    const errorResponse = {
      statusCode: status,
      error: this.getErrorCode(status),
      message: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || 'An error occurred',
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 400: // HttpStatus.BAD_REQUEST
        return 'BAD_REQUEST';
      case 401: // HttpStatus.UNAUTHORIZED
        return 'UNAUTHORIZED';
      case 403: // HttpStatus.FORBIDDEN
        return 'FORBIDDEN';
      case 404: // HttpStatus.NOT_FOUND
        return 'NOT_FOUND';
      case 408: // HttpStatus.REQUEST_TIMEOUT
        return 'REQUEST_TIMEOUT';
      case 500: // HttpStatus.INTERNAL_SERVER_ERROR
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'UNKNOWN_ERROR';
    }
  }
}
