import express from 'express';

const port = process.env.PORT || '3000';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all('/:service*', (req, res, next) => {
  console.log(req);
  const fullUrl = req.originalUrl;
  const serviceName = req.params.service;
  fullUrl.replace(`/\/${serviceName}/`, '');
  if (serviceName === 'cart') {
    res.json({
      fullUrl: req.originalUrl,
      service: req.params.service,
      other: fullUrl.replace(`\/${serviceName}`, ''),
      body: req.body,
      method: req.method
    });
    return;
  }
  next();
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
