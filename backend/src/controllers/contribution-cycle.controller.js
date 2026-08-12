import asyncHandler from "../utils/async-handler.js";
import HTTP_STATUS from "../constants/http-status.js"; // or your current location
import sendResponse from "../utils/api-response.js";
import * as contributionCycleService from "../services/contribution-cycle.service.js";
import getPagination from "../utils/pagination.js";

export const createCycle = asyncHandler(async (req, res) => {
    const { groupId } = req.validatedData.params;

    const cycle = await contributionCycleService.createCycle(
        groupId,
        req.user._id
    );

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.CREATED,
        message: "Contribution cycle started successfully.",
        data: {
            cycle,
        },
    });
});

export const confirmPayout = asyncHandler(async (req, res) => {
    const { cycleId } = req.validatedData.params;

    const cycle = await contributionCycleService.confirmPayout(
        cycleId,
        req.user._id
    );

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.OK,
        message: "Payout confirmed successfully.",
        data: {
            cycle,
        },
    });
});

export const getGroupCycles = asyncHandler(
    async (req, res) => {

        const { page, limit, skip, status } =
            getPagination(req.query);

        const { cycles, pagination } =
            await contributionCycleService.getGroupCycles(
                req.params.groupId,
                req.user._id,
                page,
                limit,
                skip,
                status
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message:
                "Contribution cycles retrieved successfully.",
            data: {
                cycles,
            },
            pagination,
        });
    }
);

export const getCycleById =
    asyncHandler(async (req, res) => {

        const data =
            await contributionCycleService.getCycleById(
                req.params.cycleId,
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message:
                "Contribution cycle retrieved successfully.",
            data,
        });
    });