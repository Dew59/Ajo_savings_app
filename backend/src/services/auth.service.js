import User from "../models/user.model.js";
import HTTP_STATUS from "../constants/http-status.js";
import { AppError } from "../utils/index.js";
import crypto from "crypto";
import { Email } from "../utils/index.js";

export const register = async (name, email, password) => {

    const existingUser =
        await User.findOne({ email });

    if (existingUser) {
        throw new AppError(
            "Email already exists",
            HTTP_STATUS.CONFLICT
        );
    }

    const createdUser =
        await User.create({
            name,
            email,
            password,
        });

    return await User.findById(
        createdUser._id
    );
};

export const login = async (email, password) => {

    const user =
        await User.findOne({
            email,
        }).select("+password");

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    const isPasswordCorrect =
        await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new AppError(
            "Invalid email or password",
            HTTP_STATUS.UNAUTHORIZED
        );
    }

    return user;
};

export const forgotPassword = async (email) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(
            "If an account exists for that email address, a password reset link has been sent.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    const resetToken =
        user.createPasswordResetToken();

    await user.save({
        validateBeforeSave: false,
    });

    const resetURL =
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {

        await new Email(
            user,
            resetURL
        ).sendPasswordReset();

    } catch (error) {

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({
            validateBeforeSave: false,
        });

        throw new AppError(
            "Unable to send password reset email. Please try again later.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
    }

};

export const resetPassword = async (token, password) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now(),
        },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
        throw new AppError(
            "Password reset token is invalid or has expired.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    user.password = password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return await User.findById(user._id);
};