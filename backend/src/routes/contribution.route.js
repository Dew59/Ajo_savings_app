import { Router } from "express";

import protect from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";


import { createContributionSchema } from "../validators/create-contribution.validator.js";
import * as contributionCycleController from "../controllers/contribution-cycle.controller.js";
import { confirmPayoutSchema } from "../validators/confirm-payout.validator.js";
import { confirmPayout } from "../controllers/contribution-cycle.controller.js";
import * as contributionController from "../controllers/contribution.controller.js"

const router = Router();

router.get(
    "/current",
    protect,
    contributionController.getCurrentCycle
);

router.post(
    "/:cycleId/contributions",
    protect,
    validate(createContributionSchema),
    contributionController.createContribution
);

router.get(
    "/:cycleId",
    protect,
    contributionCycleController.getCycleById
);

router.patch(
    "/:cycleId/confirm-payout",
    protect,
    validate(confirmPayoutSchema),
    confirmPayout
);

export default router;