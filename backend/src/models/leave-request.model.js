import mongoose from "mongoose";

const { Schema, model } = mongoose;

const leaveRequestSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true,
        },

        member: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reason: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
        },

        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        approvedAt: Date,
    },
    {
        timestamps: true,
    }
);

leaveRequestSchema.index(
    {
        group: 1,
        member: 1,
        status: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            status: "pending",
        },
    }
);

const LeaveRequest = model("LeaveRequest", leaveRequestSchema);

export default LeaveRequest;