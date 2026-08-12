import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contributionCycleSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true,
        },

        cycleNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        payoutRecipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        totalContributed: {
            type: Number,
            default: 0,
        },

        contributorCount: {
            type: Number,
            default: 0,
        },

        payoutConfirmedAt: {
            type: Date,
        },

        payoutConfirmedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        payoutAmount: {
            type: Number,
            default: 0,
        },

        memberCount: {
            type: Number,
            required: true,
        },

        contributionAmount: {
            type: Number,
            required: true,
        },

        contributionFrequency: {
            type: String,
            enum: ["daily", "weekly", "monthly"],
            required: true,
        },

        status: {
            type: String,
            enum: ["open", "ready_for_payout", "closed"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

contributionCycleSchema.index(
    {
        group: 1,
        cycleNumber: 1,
    },
    {
        unique: true,
    }
);

const ContributionCycle = model(
    "ContributionCycle",
    contributionCycleSchema
);

export default ContributionCycle;