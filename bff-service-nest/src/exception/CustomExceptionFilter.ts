import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import InternalRequestError from './InternalRequestError';

@Catch(InternalRequestError)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: InternalRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.data.status;

    response
      .status(status)
      .set(exception.data.headers)
      .send(exception.data.data);
  }
}
