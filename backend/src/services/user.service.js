import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import HTTP_STATUS from "../constants/http-status.js";

import { AppError } from "../utils/index.js";

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

export const getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(
            "User not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    return user;
};

/*
|--------------------------------------------------------------------------
| Update Current User
|--------------------------------------------------------------------------
*/

export const updateCurrentUser = async (
    userId,
    updateData
) => {
    const allowedFields = [
        "name",
        "email",
        "avatar",
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (
            updateData[field] !== undefined
        ) {
            updates[field] =
                updateData[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new AppError(
            "No valid fields were provided for update.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Email
    |--------------------------------------------------------------------------
    */

    if (updates.email) {
        const existingUser =
            await User.findOne({
                email: updates.email,
                _id: {
                    $ne: userId,
                },
            });

        if (existingUser) {
            throw new AppError(
                "Email address is already in use.",
                HTTP_STATUS.CONFLICT
            );
        }
    }

    const user =
        await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

    if (!user) {
        throw new AppError(
            "User not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    return user;
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    /*
    |--------------------------------------------------------------------------
    | Password has select: false in the model.
    | Therefore we explicitly request it.
    |--------------------------------------------------------------------------
    */

    const user =
        await User.findById(userId)
            .select("+password");

    if (!user) {
        throw new AppError(
            "User not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Current Password
    |--------------------------------------------------------------------------
    */

    const isPasswordCorrect =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!isPasswordCorrect) {
        throw new AppError(
            "Current password is incorrect.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Same Password
    |--------------------------------------------------------------------------
    */

    const isSamePassword =
        await bcrypt.compare(
            newPassword,
            user.password
        );

    if (isSamePassword) {
        throw new AppError(
            "New password must be different from your current password.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Password
    |--------------------------------------------------------------------------
    |
    | We assign the raw password here.
    | Your User model pre-save hook will hash it.
    |
    */

    user.password = newPassword;

    await user.save();

    return true;
};