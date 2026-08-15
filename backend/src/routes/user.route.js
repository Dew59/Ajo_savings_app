import { Router } from "express";
import protect from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import {
    getCurrentUser,
    updateCurrentUser,
    changePassword,
} from "../controllers/user.controller.js";
import { updateUserSchema } from "../validators/update-user.validator.js";
import { changePasswordSchema } from "../validators/change-password.validator.js";


const router = Router();

router.get(
    "/me",
    protect,
    getCurrentUser
);

router.patch(
    "/me",
    protect,
    validate(updateUserSchema),
    updateCurrentUser
);

router.patch(
    "/me/password",
    protect,
    validate(changePasswordSchema),
    changePassword
);

export default router;