import * as transactionService from "../services/transaction.service.js";
import sendResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import HTTP_STATUS from "../constants/http-status.js";

export const getTransactions = asyncHandler(
    async (req, res) => {
        const transactions =
            await transactionService.getTransactions(
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message:
                "Transactions retrieved successfully.",
            data: {
                transactions,
            },
        });
    }
);

