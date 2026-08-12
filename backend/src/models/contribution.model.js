import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contributionSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
            index: true,
        },

        cycle: {
            type: Schema.Types.ObjectId,
            ref: "ContributionCycle",
            required: true,
            index: true,
        },

        member: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        paymentDate: {
            type: Date,
            default: Date.now,
        },

        status: {
            type: String,
            enum: ["paid"],
            default: "paid",
        },
    },
    {
        timestamps: true,
    }
);

contributionSchema.index(
    {
        cycle: 1,
        member: 1,
    },
    {
        unique: true,
    }
);

const Contribution = model(
    "Contribution",
    contributionSchema
);

export default Contribution;