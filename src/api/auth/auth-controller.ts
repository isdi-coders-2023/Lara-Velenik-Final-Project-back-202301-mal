import { RequestHandler } from 'express';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../../types/auth-types.js';
import { CustomHTTPError } from '../../utils/custom-http-error.js';
import { User, UserModel } from '../users/user-schema.js';
import { encryptPassword, generateJWTToken } from './auth-utils.js';

export const loginUserController: RequestHandler<
  unknown,
  LoginResponse | { message: string },
  LoginRequest
> = async (req, res, next) => {
  const { email, password } = req.body;
  const filterUser = {
    email,
    password: encryptPassword(password),
  };
  const existingUser = await UserModel.findOne(filterUser).exec();
  if (existingUser === null) {
    return next(new CustomHTTPError(404, 'The user does not exist'));
  }

  const tokenJWT = generateJWTToken(email);
  res.status(201).json({
    accessToken: tokenJWT,
  });
};

export const registerUserController: RequestHandler<
  unknown,
  unknown,
  RegisterRequest
> = async (req, res, next) => {
  const { name, surname, email, password } = req.body;

  const existingDbUser = await UserModel.findOne({ email }).exec();
  if (existingDbUser !== null) {
    return next(
      new CustomHTTPError(409, 'An account already exists with this email'),
    );
  }

  const user: User = {
    name,
    surname,
    email,
    password: encryptPassword(password),
  };

  await UserModel.create(user);
  res.status(201).json('Your user has been registered successfully');
};
