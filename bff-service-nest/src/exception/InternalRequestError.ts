import { Data } from '../app.service';

export default class InternalRequestError extends Error {
  data: Data;

  constructor(message: string, data: Data) {
    super(message);
    this.data = data;
  }
}
