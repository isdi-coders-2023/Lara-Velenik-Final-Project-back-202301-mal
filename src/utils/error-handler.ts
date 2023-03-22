import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import { Error } from 'mongoose';
import { CustomHTTPError } from './custom-http-error.js';
import log from '../logger.js';
import dotenv from 'dotenv';
dotenv.config();

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  if (err instanceof CustomHTTPError) {
    return res.status(err.httpCode).json(err.toBodyJSON());
  }

  log.error(err);
  return res.status(500).json(err);
};
