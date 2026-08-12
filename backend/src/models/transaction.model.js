import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },

        cycle: {
            type: Schema.Types.ObjectId,
            ref: "ContributionCycle",
        },

        contribution: {
            type: Schema.Types.ObjectId,
            ref: "Contribution",
        },

        type: {
            type: String,
            enum: [
                "contribution",
                "payout",
            ],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({
    user: 1,
    createdAt: -1,
});

const Transaction = model(
    "Transaction",
    transactionSchema
);

export default Transaction;