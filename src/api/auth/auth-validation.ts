import { Joi } from 'express-validation';

export const authValidation = {
  body: Joi.object({
    name: Joi.string(),
    surname: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{6,30}/)
      .required(),
  }),
};
