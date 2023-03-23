import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiRouter from './api/api-router.js';
import authRouter from './api/auth/auth-router.js';
import { errorHandler } from './utils/error-handler.js';
import dotenv from 'dotenv';
import { authMiddleware } from './api/auth/auth-middleware.js';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json('Server is working!!');
});

app.use(cors());

app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/v1', authMiddleware, apiRouter);

app.use(bodyParser.json());

app.use(errorHandler);

export default app;
