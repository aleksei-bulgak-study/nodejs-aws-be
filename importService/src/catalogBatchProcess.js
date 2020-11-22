import { postProduct } from './service/rds';
import snsService from './service/sns';

const handler = async (event) => {
  for (const record of event.Records) {
    const { body } = record;
    await postProduct(JSON.parse(body)).then((data) => {
      let owner = 'developer';
      if (JSON.parse(body).count > 2) {
        owner = 'manager';
      }
      snsService(body, owner);
    });
  }
  return {};
};

export default handler;
