import express from 'express';
import { validate } from 'express-validation';
import { loginUserController } from './auth-controller.js';
import { authValidation } from './auth-validation.js';

const router = express.Router();

router.use(validate(authValidation));

router.route('/login').post(loginUserController);

export default router;
