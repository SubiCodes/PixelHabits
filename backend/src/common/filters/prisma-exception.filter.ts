// src/common/filters/prisma-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError | PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof PrismaClientKnownRequestError) {
      return this.handleKnownRequestError(exception, response);
    }

    if (exception instanceof PrismaClientValidationError) {
      return this.handleValidationError(exception, response);
    }
  }

  private handleKnownRequestError(
    exception: PrismaClientKnownRequestError,
    response: Response,
  ) {
    console.error('Prisma error:', exception.code, exception.message);

    switch (exception.code) {
      case 'P2002':
        // Unique constraint violation
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: 409,
          error: 'DUPLICATE_ENTRY',
          message: 'A record with this information already exists',
          suggestion: 'Try using different values',
          field: exception.meta?.target,
        });

      case 'P2025':
        // Record not found
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          error: 'RECORD_NOT_FOUND',
          message: 'The requested record was not found',
          suggestion: 'The record may have been deleted',
        });

      case 'P2003':
        // Foreign key constraint failed
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          error: 'INVALID_REFERENCE',
          message: 'Referenced record does not exist',
          suggestion: 'Check that all IDs are valid',
          field: exception.meta?.field_name,
        });

      case 'P2014':
        // Required relation violation
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          error: 'INVALID_RELATION',
          message: 'Invalid relationship between records',
          suggestion: 'Ensure all required relations are provided',
        });

      case 'P2021':
        // Table does not exist
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: 500,
          error: 'DATABASE_SCHEMA_ERROR',
          message: 'Database configuration error',
          suggestion: 'Contact support',
        });

      case 'P2024':
        // Connection timeout
        return response.status(HttpStatus.REQUEST_TIMEOUT).json({
          statusCode: 408,
          error: 'DATABASE_TIMEOUT',
          message: 'Database connection timed out',
          suggestion: 'Please try again',
        });

      default:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: 500,
          error: 'DATABASE_ERROR',
          message: 'An unexpected database error occurred',
          suggestion: 'Please try again later',
          code: exception.code,
        });
    }
  }

  private handleValidationError(
    exception: PrismaClientValidationError,
    response: Response,
  ) {
    console.error('Prisma validation error:', exception.message);

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: 400,
      error: 'INVALID_DATA',
      message: 'Invalid data provided',
      suggestion: 'Check your request data and try again',
    });
  }
}