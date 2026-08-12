import { Router } from "express";
import protect from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import { createCycle } from "../controllers/contribution-cycle.controller.js";
import { createContributionCycleSchema } from "../validators/create-contribution-cycle.validator.js";
import * as contributionCycleController from "../controllers/contribution-cycle.controller.js";


const router = Router();

router.post(
    "/:groupId/cycles",
    protect,
    validate(createContributionCycleSchema),
    createCycle
);

router.get(
    "/:groupId/cycles",
    protect,
    contributionCycleController.getGroupCycles
);

export default router;