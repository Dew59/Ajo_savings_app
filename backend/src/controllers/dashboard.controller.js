import HTTP_STATUS from "../constants/http-status.js";
import * as dashboardService from "../services/dashboard.service.js";
import {
    asyncHandler,
    sendResponse,
} from "../utils/index.js";

export const getDashboard =
    asyncHandler(async (req, res) => {

        const dashboard =
            await dashboardService.getDashboard(
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message:
                "Dashboard retrieved successfully.",
            data: dashboard,
        });
    });