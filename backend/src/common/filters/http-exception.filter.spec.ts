import { HttpStatus, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  const createMockArgumentsHost = () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({
      status: mockStatus,
    });
    const mockHttpArgumentsHost = {
      getResponse: mockGetResponse,
      getRequest: jest.fn(),
    };
    const mockArgumentsHost = {
      switchToHttp: () => mockHttpArgumentsHost,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ArgumentsHost;

    return { mockArgumentsHost, mockStatus, mockJson };
  };

  it('should handle HttpException with string message', () => {
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'BAD_REQUEST',
      message: 'Bad Request',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { message: 'Validation failed', details: ['email is required'] },
      HttpStatus.BAD_REQUEST,
    );
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'BAD_REQUEST',
      message: 'Validation failed',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle HttpException with structured error response', () => {
    const exception = new HttpException(
      {
        error: 'CUSTOM_ERROR',
        message: 'Custom error message',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'CUSTOM_ERROR',
      message: 'Custom error message',
      statusCode: HttpStatus.BAD_REQUEST,
    });
  });

  it('should handle 401 UNAUTHORIZED error', () => {
    const exception = new HttpException(
      'Unauthorized',
      HttpStatus.UNAUTHORIZED,
    );
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'UNAUTHORIZED',
      message: 'Unauthorized',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle 403 FORBIDDEN error', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      error: 'FORBIDDEN',
      message: 'Forbidden',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle 404 NOT_FOUND error', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'NOT_FOUND',
      message: 'Not Found',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle 408 REQUEST_TIMEOUT error', () => {
    const exception = new HttpException(
      'Request Timeout',
      HttpStatus.REQUEST_TIMEOUT,
    );
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.REQUEST_TIMEOUT);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.REQUEST_TIMEOUT,
      error: 'REQUEST_TIMEOUT',
      message: 'Request Timeout',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle 500 INTERNAL_SERVER_ERROR', () => {
    const exception = new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Internal Server Error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should handle unknown status codes with UNKNOWN_ERROR', () => {
    const exception = new HttpException('Custom Error', 418); // I'm a teapot
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(418);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 418,
      error: 'UNKNOWN_ERROR',
      message: 'Custom Error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should use default message when no message is provided', () => {
    const exception = new HttpException({}, HttpStatus.BAD_REQUEST);
    const { mockArgumentsHost, mockStatus, mockJson } =
      createMockArgumentsHost();

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'BAD_REQUEST',
      message: 'An error occurred',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      timestamp: expect.any(String),
    });
  });

  it('should include timestamp in ISO format', () => {
    const exception = new HttpException('Test', HttpStatus.BAD_REQUEST);
    const { mockArgumentsHost, mockJson } = createMockArgumentsHost();

    const beforeTimestamp = new Date().toISOString();
    filter.catch(exception, mockArgumentsHost);
    const afterTimestamp = new Date().toISOString();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const callArgs = mockJson.mock.calls[0][0] as {
      timestamp: string;
    };
    expect(callArgs.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    expect(callArgs.timestamp >= beforeTimestamp).toBe(true);
    expect(callArgs.timestamp <= afterTimestamp).toBe(true);
  });
});
