import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "group",
                "contribution",
                "cycle",
                "payout",
                "leave_request",
                "system",
            ],
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({
    user: 1,
    createdAt: -1,
});

export default model(
    "Notification",
    notificationSchema
);