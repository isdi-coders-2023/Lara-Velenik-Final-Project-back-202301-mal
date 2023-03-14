import express from 'express';
import apiRouter from './api/api-router.js';

const app = express();

app.use(express.json());
app.use('/api/v1', apiRouter);

app.get('/', (req, res) => {
  res.json('Server is working!!');
});

export default app;
