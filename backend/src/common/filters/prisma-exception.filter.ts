import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The provided value for the column is too long for the column's type`;
        break;
      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        errorMessage = `The record searched for in the where condition does not exist`;
        break;
      case 'P2002':
        status = HttpStatus.CONFLICT;
        errorMessage = `Unique constraint failed on the ${String(exception.meta?.target)}`;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Foreign key constraint failed on the field: ${String(exception.meta?.field_name)}`;
        break;
      case 'P2004':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `A constraint failed on the database`;
        break;
      case 'P2005':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The value stored in the database is invalid for the field's type`;
        break;
      case 'P2006':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The provided value is not valid`;
        break;
      case 'P2007':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Data validation error`;
        break;
      case 'P2008':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Failed to parse the query`;
        break;
      case 'P2009':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Failed to validate the query`;
        break;
      case 'P2010':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Raw query failed`;
        break;
      case 'P2011':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Null constraint violation on the ${String(exception.meta?.target)}`;
        break;
      case 'P2012':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Missing a required value`;
        break;
      case 'P2013':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Missing the required argument for field`;
        break;
      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The change you are trying to make would violate the required relation`;
        break;
      case 'P2015':
        status = HttpStatus.NOT_FOUND;
        errorMessage = `A related record could not be found`;
        break;
      case 'P2016':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Query interpretation error`;
        break;
      case 'P2017':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The records for relation are not connected`;
        break;
      case 'P2018':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The required connected records were not found`;
        break;
      case 'P2019':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Input error`;
        break;
      case 'P2020':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Value out of range for the type`;
        break;
      case 'P2021':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `The table does not exist in the current database`;
        break;
      case 'P2022':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `The column does not exist in the current database`;
        break;
      case 'P2023':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `Inconsistent column data`;
        break;
      case 'P2024':
        status = HttpStatus.REQUEST_TIMEOUT;
        errorMessage = `Timed out fetching a new connection from the connection pool`;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        errorMessage = `Record to delete does not exist`;
        break;
      case 'P2026':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `The current database provider doesn't support a feature that the query used`;
        break;
      case 'P2027':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Multiple errors occurred on the database during query execution`;
        break;
      case 'P2028':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Transaction API error`;
        break;
      case 'P2030':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Cannot find a fulltext index to use for the search`;
        break;
      case 'P2033':
        status = HttpStatus.BAD_REQUEST;
        errorMessage = `A number used in the query does not fit into a 64 bit signed integer`;
        break;
      case 'P2034':
        status = HttpStatus.CONFLICT;
        errorMessage = `Transaction failed due to a write conflict or a deadlock`;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = `Database error: ${exception.code}`;
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      error: exception.code,
      details: exception.meta,
    });
  }
}
