// local imports
import { joi as Joi } from "@/core/validations/joi.js";

// Request payload for Register
export const RegisterRequestSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Request payload for login
export const LoginRequestSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
