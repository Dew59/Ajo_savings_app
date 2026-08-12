import mongoose from "mongoose";
import crypto from "crypto";

const { Schema, model } = mongoose;

const memberSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },

        leftAt: {
            type: Date,
        },

        rejoinedAt: {
            type: Date,
        },

        hasReceivedPayout: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        _id: false,
    }
);

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Group name is required."],
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },

        contributionAmount: {
            type: Number,
            required: [true, "Contribution amount is required."],
            min: [1, "Contribution amount must be greater than zero."],
        },

        contributionFrequency: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            required: true,
        },

        maxMembers: {
            type: Number,
            required: true,
            min: 2,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: {
            type: [memberSchema],
            default: [],
        },

        payoutOrder: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        currentPayoutIndex: {
            type: Number,
            default: 0,
        },

        inviteCode: {
            type: String,
            unique: true,
            required: true,
            uppercase: true,
        },

        status: {
            type: String,
            enum: ["recruiting", "active", "completed"],
            default: "recruiting",
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

groupSchema.virtual("memberCount").get(function () {

    return (this.members || []).filter(
        (member) => member.isActive
    ).length;

});

groupSchema.virtual("totalMembers").get(function () {
    return (this.members || []).length ;
});

groupSchema.index({
    createdBy: 1,
});

groupSchema.pre("validate", function () {
    if (!this.inviteCode) {
        this.inviteCode = crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase();
    }
});

const Group = model("Group", groupSchema);

export default Group;