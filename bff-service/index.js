import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

const responseCache = new NodeCache();

dotenv.config();

const getUrlByServiceName = (serviceName) => {
  const serviceUrl = process.env[serviceName];
  if (!serviceUrl) {
    throw new Error('Cannot process request');
  }
  return serviceUrl;
};

const getRequestBody = (req) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return req.body;
  }
  return;
};

const isCacheNeeded = (req) => req.originalUrl.startsWith('/products') && req.method === 'GET';

const cacheMiddleware = (req, res, next) => {
  if (isCacheNeeded(req)) {
    const value = responseCache.get(req.originalUrl);
    if (value) {
      console.log('from cache')
      res.set(value.headers).status(value.status).send(value.data);
      return;
    }
  }
  next();
};

const cacheResponseMiddleware = (req, res, next) => {
  if (res.internalResponse && isCacheNeeded(req)) {
    const { status, headers, data } = res.internalResponse;
    responseCache.set(req.originalUrl, { status, headers, data }, 120);
  }
  next();
};

const port = process.env.PORT || '3000';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cacheMiddleware);

app.all('/:service*', (req, res, next) => {
  try {
    const serviceName = req.params.service;
    const serviceUrl = getUrlByServiceName(serviceName);
    const fullUrl = req.originalUrl;
    const resultUrl = serviceUrl + fullUrl.replace(`\/${serviceName}`, '');

    axios({
      method: req.method,
      url: resultUrl,
      data: getRequestBody(req.body),
      headers: { ...req.headers, host: '' },
    })
      .then((response) => {
        res.internalResponse = response;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});
app.use(cacheResponseMiddleware);
app.use((req, res, next) => {
  if(res.internalResponse) {
    const response = res.internalResponse;
    res.set(response.headers).status(response.status).send(response.data);
    return;
  }
  next(new Error('unknown path. return 502 status code'));
});

app.use((err, req, res, next) => {
  if (err.response) {
    res.set(err.response.headers).status(err.response.status).send(err.response.data);
  } else {
    console.log(err);
    res.status(502).json({ message: 'Cannot process request' });
  }
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
