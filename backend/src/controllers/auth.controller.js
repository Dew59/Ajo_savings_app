import User from "../models/user.model.js";
import HTTP_STATUS from "../constants/http-status.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";
import {
    AppError,
    asyncHandler,
    createAuthResponse,
    sendResponse,
    cookieOptions
} from "../utils/index.js";
import * as authService from "../services/auth.service.js";


export const register =
    asyncHandler(async (req, res) => {

        const {
            body: {
                name,
                email,
                password,
            },
        } = req.validatedData;

        const user =
            await authService.register(
                name,
                email,
                password
            );

        return createAuthResponse(
            user,
            HTTP_STATUS.CREATED,
            res,
            "Registration successful"
        );

    });


export const login =
asyncHandler(async (req, res) => {

    const {
        body: {
            email,
            password,
        },
    } = req.validatedData;

    const user =
        await authService.login(
            email,
            password
        );

    return createAuthResponse(
        user,
        HTTP_STATUS.OK,
        res,
        "Login successful"
    );

});


export const logout = asyncHandler(async (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, cookieOptions);

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.OK,
        message: "Logout successful",
    });
});

export const forgotPassword =
asyncHandler(async (req, res) => {

    const { email } = req.body;

    await authService.forgotPassword(email);

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.OK,
        message:
            "Password reset email sent successfully.",
    });

});

export const resetPassword =
asyncHandler(async (req, res) => {

    const { token } = req.params;

    const { password } = req.body;

    const user =
        await authService.resetPassword(
            token,
            password
        );

    return createAuthResponse(
        user,
        HTTP_STATUS.OK,
        res,
        "Password reset successful."
    );

});

export const getCurrentUser = async (req, res) => {

    res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });

};