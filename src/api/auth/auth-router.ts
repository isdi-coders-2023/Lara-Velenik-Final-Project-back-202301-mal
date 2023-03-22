import express from 'express';
import { validate } from 'express-validation';

import {
  loginUserController,
  registerUserController,
} from './auth-controller.js';
import { authValidation } from './auth-validation.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.use(validate(authValidation));

router.route('/login').post(loginUserController);
router.route('/register').post(registerUserController);

export default router;
