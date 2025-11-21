import { HttpStatus } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ArgumentsHost } from '@nestjs/common';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
  });

  it('should handle P2002 unique constraint error', () => {
    const exception = new PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '6.13.0',
        meta: { target: ['email'] },
      },
    );

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

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message: expect.stringContaining('Unique constraint failed'),
      error: 'P2002',
      details: { target: ['email'] },
    });
  });

  it('should handle P2025 record not found error', () => {
    const exception = new PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '6.13.0',
      meta: {},
    });

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

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Record to delete does not exist',
      error: 'P2025',
      details: {},
    });
  });
});
