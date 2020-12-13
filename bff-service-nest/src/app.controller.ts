import { Controller, All, Req, Res, UseFilters } from '@nestjs/common';
import { Method } from 'axios';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { CustomExceptionFilter } from './exception/CustomExceptionFilter';
import { UnknownRouteFilter } from './exception/UnknownRouteFilter';

@Controller('*')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  @UseFilters(new UnknownRouteFilter(), new CustomExceptionFilter())
  async handleAllRequests(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const serviceUrl = this.getInternalUrl(request.originalUrl);
    console.log(serviceUrl);
    const result = await this.appService.process(
      serviceUrl,
      this.getMethod(request.method),
      request.headers,
      request.body,
    );
    response.set(result.headers).status(result.status).send(result.data);
  }

  private getMethod(method: string): Method {
    if (
      method === 'GET' ||
      method === 'POST' ||
      method === 'OPTIONS' ||
      method === 'PUT' ||
      method === 'DELETE'
    ) {
      return method;
    }

    return 'GET';
  }

  private getInternalUrl(url: string): string {
    const serviceName = url.match(/^\/([a-zA-Z0-9\-\_]*)[\/\?]*/)[1];
    const serviceUrl = process.env[serviceName];

    if (serviceUrl) {
      return url.replace(`/${serviceName}`, serviceUrl);
    }
    throw new Error('Unknown service exception');
  }
}
