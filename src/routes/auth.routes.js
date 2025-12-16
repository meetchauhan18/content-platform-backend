import express from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";

const router = express.Router();

const { register, login } = authController;

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
