import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema
} from "../validators/auth.validator.js";
import * as authController from "../controllers/auth.controller.js";
import protect from "../middlewares/protect.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post("/logout", logout);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.get("/me", protect, getCurrentUser);

export default router;