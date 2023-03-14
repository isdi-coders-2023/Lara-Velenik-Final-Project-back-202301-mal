import { RequestHandler } from 'express';
import { AuthRequest, LoginResponse } from '../../types/types.js';
import { UserModel } from '../users/user-schema.js';
import { encryptPassword, generateJWTToken } from './auth-utils.js';

export const loginUserController: RequestHandler<
  unknown,
  LoginResponse | { message: string },
  AuthRequest
> = async (req, res) => {
  const { email, password } = req.body;
  const filterUser = {
    email,
    password: encryptPassword(password),
  };
  const existingUser = await UserModel.findOne(filterUser).exec();
  if (existingUser === null) {
    return res.status(404).json({ message: 'The user does not exist' });
  }

  const tokenJWT = generateJWTToken(email);
  res.status(201).json({
    accessToken: tokenJWT,
  });
};
