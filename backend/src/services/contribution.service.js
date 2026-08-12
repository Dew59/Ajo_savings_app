import Contribution from "../models/contribution.model.js";
import ContributionCycle from "../models/contribution-cycle.model.js";
import Group from "../models/group.model.js";
import AppError from "../utils/app-error.js";
import HTTP_STATUS from "../constants/http-status.js";
import { findActiveMember } from "../helper/group-member.helper.js";
import { createTransaction } from "./transaction.service.js"
import mongoose from "mongoose";

const populateContribution = (query) => {
    return query
        .populate("member", "name email")
        .populate("group", "name members contributionAmount status")
        .populate("cycle");
}

const populateContributionCycle = (query) => {
    return query
        .populate("group", "name members contributionAmount status")
        .populate("createdBy", "name email")
        .populate("payoutRecipient", "name email");
};

export const createContribution = async (
    cycleId,
    userId,
    amount
) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        /*
        |------------------------------------------------------------------
        | Find Cycle
        |------------------------------------------------------------------
        */

        const cycle =
            await ContributionCycle.findById(
                cycleId
            ).session(session);

        if (!cycle) {
            throw new AppError(
                "Contribution cycle not found.",
                HTTP_STATUS.NOT_FOUND
            );
        }

        /*
        |------------------------------------------------------------------
        | Check Cycle Status
        |------------------------------------------------------------------
        */

        if (cycle.status !== "open") {
            throw new AppError(
                "This contribution cycle is no longer accepting contributions.",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        /*
        |------------------------------------------------------------------
        | Find Group
        |------------------------------------------------------------------
        */

        const group =
            await Group.findById(
                cycle.group
            ).session(session);

        if (!group) {
            throw new AppError(
                "Group not found.",
                HTTP_STATUS.NOT_FOUND
            );
        }

        /*
        |------------------------------------------------------------------
        | Check Active Membership
        |------------------------------------------------------------------
        */

        const member =
            findActiveMember(
                group,
                userId
            );

        if (!member) {
            throw new AppError(
                "Only active members can contribute.",
                HTTP_STATUS.FORBIDDEN
            );
        }

        /*
        |------------------------------------------------------------------
        | Validate Contribution Amount
        |------------------------------------------------------------------
        */

        if (
            amount !==
            group.contributionAmount
        ) {
            throw new AppError(
                `Contribution amount must be ₦${group.contributionAmount}.`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        /*
        |------------------------------------------------------------------
        | Prevent Duplicate Contribution
        |------------------------------------------------------------------
        */

        const existingContribution =
            await Contribution.findOne({
                cycle: cycle._id,
                member: userId,
            }).session(session);

        if (existingContribution) {
            throw new AppError(
                "You have already contributed in this cycle.",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        /*
        |------------------------------------------------------------------
        | Create Contribution
        |------------------------------------------------------------------
        */

        const [contribution] =
            await Contribution.create(
                [
                    {
                        group: group._id,
                        cycle: cycle._id,
                        member: userId,
                        amount:
                            group.contributionAmount,
                    },
                ],
                {
                    session,
                }
            );

        /*
        |------------------------------------------------------------------
        | Create Contribution Transaction
        |------------------------------------------------------------------
        */

        await createTransaction({
            user: userId,
            group: group._id,
            cycle: cycle._id,
            contribution:
                contribution._id,
            type: "contribution",
            amount:
                group.contributionAmount,
            description:
                `Contribution for Cycle ${cycle.cycleNumber}`,
            session,
        });

        /*
        |------------------------------------------------------------------
        | Update Cycle Totals
        |------------------------------------------------------------------
        */

        cycle.totalContributed +=
            group.contributionAmount;

        cycle.contributorCount += 1;

        /*
        |------------------------------------------------------------------
        | Check Whether All Members Have Contributed
        |------------------------------------------------------------------
        */

        if (
            cycle.contributorCount >=
            cycle.memberCount
        ) {
            cycle.status =
                "ready_for_payout";
        }

        /*
        |------------------------------------------------------------------
        | Save Cycle
        |------------------------------------------------------------------
        */

        await cycle.save({
            session,
        });

        /*
        |------------------------------------------------------------------
        | Commit Transaction
        |------------------------------------------------------------------
        */

        await session.commitTransaction();

        /*
        |------------------------------------------------------------------
        | Return Populated Contribution
        |------------------------------------------------------------------
        */

        return await populateContribution(
            Contribution.findById(
                contribution._id
            )
        );

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();

    }
};


export const getCurrentCycle = async (userId) => {

    const groups = await Group.find({
        "members.user": userId,
        "members.isActive": true,
        status: "active",
    });

    if (!groups.length) {
        return null;
    }

    for (const group of groups) {

        const cycle =
            await ContributionCycle.findOne({
                group: group._id,
                status: {
                    $in: [
                        "open",
                        "ready_for_payout",
                    ],
                },
            })
                .sort({
                    cycleNumber: -1,
                });

        if (cycle) {

            return await populateContributionCycle(
                ContributionCycle.findById(
                    cycle._id
                )
            );

        }
    }

    return null;
};