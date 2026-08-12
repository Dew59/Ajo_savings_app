import HTTP_STATUS from "../constants/http-status.js";
import { sendResponse } from "../utils/index.js";

export const healthCheck = (req, res) => {
    return sendResponse({
        res,
        statusCode: HTTP_STATUS.OK,
        message: "Server is running successfully.",
        data: {
            uptime: process.uptime(),
            timestamp: new Date(),
        },
    });
};