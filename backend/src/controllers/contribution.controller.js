import asyncHandler from "../utils/async-handler.js";
import sendResponse from "../utils/api-response.js";
import HTTP_STATUS from "../constants/http-status.js";
import * as contributionService from "../services/contribution.service.js";

export const createContribution = asyncHandler(async (req, res) => {
    const { cycleId } = req.validatedData.params;
    const { amount } = req.validatedData.body;

    const contribution = await contributionService.createContribution(
        cycleId,
        req.user._id,
        amount
    );

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.CREATED,
        message: "Contribution recorded successfully.",
        data: {
            contribution,
        },
    });
});


export const getCurrentCycle = asyncHandler(
    async (req, res) => {

        const cycle =
            await contributionService.getCurrentCycle(
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "Current cycle retrieved successfully.",
            data: {
                cycle,
            },
        });
    }
);