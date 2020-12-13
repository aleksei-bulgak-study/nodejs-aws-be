import { Injectable } from '@nestjs/common';
import axios, { AxiosError, Method } from 'axios';
import InternalRequestError from './exception/InternalRequestError';

export interface Data {
  status: number;
  headers: any;
  data: any;
}

@Injectable()
export class AppService {
  process(
    url: string,
    method: Method,
    headers: NodeJS.Dict<string | string[]>,
    body: any,
  ): Promise<Data> {
    return axios({
      method,
      url: url,
      headers: { ...headers, host: '' },
      data: method === 'GET' ? null : body,
    })
      .then((data) => ({
        status: data.status,
        headers: data.headers,
        data: data.data,
      }))
      .catch((err: AxiosError) => {
        console.log('Internal request failed with exception', err);
        throw new InternalRequestError(
          'Internal request failed with exception',
          {
            status: err.response.status,
            headers: err.response.headers,
            data: err.response.data,
          },
        );
      });
  }
}
