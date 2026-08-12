import {
    asyncHandler,
    sendResponse,
} from "../utils/index.js";

import HTTP_STATUS from "../constants/http-status.js";

import * as userService from "../services/user.service.js";

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser = asyncHandler(
    async (req, res) => {
        const user =
            await userService.getCurrentUser(
                req.user._id
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "User profile retrieved successfully.",
            data: {
                user,
            },
        });
    }
);

/*
|--------------------------------------------------------------------------
| Update Current User
|--------------------------------------------------------------------------
*/

export const updateCurrentUser =
    asyncHandler(async (req, res) => {
        const user =
            await userService.updateCurrentUser(
                req.user._id,
                req.validatedData.body
            );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "Profile updated successfully.",
            data: {
                user,
            },
        });
    });

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword =
    asyncHandler(async (req, res) => {
        await userService.changePassword(
            req.user._id,
            req.validatedData.body
                .currentPassword,
            req.validatedData.body
                .newPassword
        );

        return sendResponse({
            res,
            statusCode: HTTP_STATUS.OK,
            message: "Password changed successfully.",
            data: {},
        });
    });