import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getUrlByServiceName = (serviceName) => {
  const serviceUrl = process.env[serviceName];
  if (!serviceUrl) {
    throw new Error('Cannot process request');
  }
  return serviceUrl;
};

const getRequestBody = (req) => {
  if(['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return req.body;
  }
  return;
};

const port = process.env.PORT || '3000';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/:service*', (req, res, next) => {
  try {
    const serviceName = req.params.service;
    const serviceUrl = getUrlByServiceName(serviceName);
    const fullUrl = req.originalUrl;
    const resultUrl = serviceUrl + fullUrl.replace(`\/${serviceName}`, '');

    console.log(resultUrl);

    axios({
      method: req.method,
      url: resultUrl,
      data: getRequestBody(req.body),
      headers: { ...req.headers, host: 'kutdlurimk.execute-api.eu-west-1.amazonaws.com' },
    })
      .then((response) => {
        console.log('response');
        res.status(response.status).set(response.headers).send(response.data);
      })
      .catch((err) => {
        console.log(err);
        res.status(err.response.status).set(err.response.headers).send(err.response.data);
      });
  } catch (err) {
    next();
  }
});

app.use((req, res) => {
  res.status(502).json({ message: 'Cannot process request' });
});

const server = app.listen(port, () =>
  console.log('Application started and listerning port ', port)
);

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception was thrown due to', err);
  process.exit(1);
});

process.on('unhandledRejection', () => {
  console.log('Unhandler rejection error was thrown due to');
});

export { server };
export default app;
