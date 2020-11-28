import { snsService, postProduct } from '../service';

const handler = async (event) => {
  for (const record of event.Records) {
    const { body } = record;
    await postProduct(JSON.parse(body)).then((product) => {
      let owner = 'developer';
      if (JSON.parse(body).count > 2) {
        owner = 'manager';
      }
      snsService(body, owner);
    }).catch(err => { 
      console.log(err); 
      throw err;
    });
  }
  return {};
};

export default handler;
