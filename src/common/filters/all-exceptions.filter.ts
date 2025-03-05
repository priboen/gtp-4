import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();
      message =
        typeof responseMessage === 'string'
          ? responseMessage
          : (responseMessage as any).message || 'Internal Server Error';
    } else if (exception.name === 'SequelizeDatabaseError') {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.original.sqlMessage || 'Database error occurred';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
