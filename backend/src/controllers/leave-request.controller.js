import asyncHandler from "../utils/async-handler.js";
import * as leaveRequestService from "../services/leave-request.service.js";
import HTTP_STATUS from "../constants/http-status.js";
import sendResponse from "../utils/api-response.js";

export const createLeaveRequest =
    asyncHandler(async (req, res) => {

        const { groupId } =
            req.validatedData.params;

        const { reason } =
            req.validatedData.body;

        const leaveRequest =
            await leaveRequestService.createLeaveRequest(
                groupId,
                req.user._id,
                reason
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.CREATED,
            message:
                "Leave request submitted successfully.",
            data: {
                leaveRequest,
            },
        });
    });


export const getLeaveRequests =
    asyncHandler(async (req, res) => {

        const { groupId } =
            req.validatedData.params;

        const requests =
            await leaveRequestService.getLeaveRequests(
                groupId,
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message:
                "Leave requests retrieved successfully.",
            data: {
                requests,
            },
        });
    });

export const approveLeaveRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.validatedData.params;

    const leaveRequest =
        await leaveRequestService.approveLeaveRequest(
            requestId,
            req.user._id
        );

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.OK,
        message: "Leave request approved successfully.",
        data: {
            leaveRequest,
        },
    });
});

export const getMyLeaveRequest =
    asyncHandler(async (req, res) => {

        const { groupId } =
            req.validatedData.params;

        const leaveRequest =
            await leaveRequestService.getMyLeaveRequest(
                groupId,
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message:
                "Leave request retrieved successfully.",
            data: {
                leaveRequest,
            },
        });
    });