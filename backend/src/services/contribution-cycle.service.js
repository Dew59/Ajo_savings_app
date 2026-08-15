import Group from "../models/group.model.js";
import ContributionCycle from "../models/contribution-cycle.model.js";
import AppError from "../utils/app-error.js";
import HTTP_STATUS from "../constants/http-status.js";
import { findActiveMember, getInactiveMemberCount, getActiveMemberCount } from "../helper/group-member.helper.js"
import createPagination from "../utils/create-pagination.js";
import getPagination from "../utils/pagination.js";
import Contribution from "../models/contribution.model.js";
import { createTransaction } from "./transaction.service.js"
import mongoose from "mongoose";

const calculateEndDate = (startDate, frequency) => {
    const endDate = new Date(startDate);

    switch (frequency) {
        case "daily":
            endDate.setDate(endDate.getDate() + 1);
            break;

        case "weekly":
            endDate.setDate(endDate.getDate() + 7);
            break;

        case "monthly":
            endDate.setMonth(endDate.getMonth() + 1);
            break;

        default:
            throw new Error("Invalid contribution frequency.");
    }

    return endDate;
};

const populateContributionCycle = (query) => {
    return query
        .populate("group", "name members contributionAmount status")
        .populate("createdBy", "name email")
        .populate("payoutRecipient", "name email");
};

const populateContributionCycleDetails = (query) => {
    return query
        .populate("group", "name inviteCode status members memberCount totalMembers contributionAmount contributionFrequency")
        .populate("payoutRecipient", "name email avatar_url")
        .populate("createdBy", "name email avatar_url")
        .populate("payoutConfirmedBy", "name email avatar_url")
        .select("-__v");
}


export const createCycle = async (groupId, userId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new AppError("Group not found.", HTTP_STATUS.NOT_FOUND);
    }

    if (!group.createdBy.equals(userId)) {
        throw new AppError(
            "Only the group admin can start a contribution cycle.",
            HTTP_STATUS.FORBIDDEN
        );
    }

    if (group.status !== "active") {
        throw new AppError(
            "This group is not ready to start contribution cycles.",
            HTTP_STATUS.BAD_REQUEST
        );
    }


    const activeCycle = await ContributionCycle.findOne({
        group: group._id,
        status: {
            $in: ["open", "ready_for_payout"],
        },
    });

    if (activeCycle) {
        throw new AppError(
            "This group already has an active contribution cycle.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const lastCycle = await ContributionCycle.findOne({
        group: group._id,
    }).sort({
        cycleNumber: -1,
    });

    const cycleNumber = lastCycle ? lastCycle.cycleNumber + 1 : 1;

    const startDate = new Date();

    const endDate = calculateEndDate(
        startDate,
        group.contributionFrequency
    );

    const payoutRecipient = group.payoutOrder[group.currentPayoutIndex];

    if (!payoutRecipient) {
        throw new AppError(
            "No payout recipient is configured for this cycle.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const cycle = await ContributionCycle.create({
        group: group._id,

        cycleNumber,

        memberCount: getActiveMemberCount(group),

        contributionAmount: group.contributionAmount,

        contributionFrequency:
            group.contributionFrequency,

        startDate,

        endDate,

        payoutRecipient,

        createdBy: userId,
    });

    return await populateContributionCycle(
        ContributionCycle.findById(cycle._id)
    );
};

export const confirmPayout = async (cycleId, userId) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

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

        if (!group.createdBy.equals(userId)) {
            throw new AppError(
                "Only the group admin can confirm payouts.",
                HTTP_STATUS.FORBIDDEN
            );
        }

        if (cycle.status !== "ready_for_payout") {
            throw new AppError(
                "This cycle is not ready for payout.",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const recipient =
            findActiveMember(
                group,
                cycle.payoutRecipient
            );

        if (!recipient) {
            throw new AppError(
                "Payout recipient is no longer an active member of the group.",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        cycle.status = "closed";

        cycle.payoutConfirmedAt =
            new Date();

        cycle.payoutConfirmedBy =
            userId;

        cycle.payoutAmount =
            cycle.totalContributed;

        recipient.hasReceivedPayout = true;

        group.currentPayoutIndex += 1;

        if (
            group.currentPayoutIndex >=
            group.payoutOrder.length
        ) {
            group.status = "completed";
        }

        await cycle.save({
            session,
        });

        await group.save({
            session,
        });

        await createTransaction({
            user: cycle.payoutRecipient,
            group: group._id,
            cycle: cycle._id,
            type: "payout",
            amount: cycle.totalContributed,
            description:
                `Payout for Cycle ${cycle.cycleNumber}`,
            session,
        });

        await session.commitTransaction();

        return await populateContributionCycle(
            ContributionCycle.findById(
                cycle._id
            )
        );

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        await session.endSession();

    }
};

export const getGroupCycles = async (groupId, userId, page, limit, skip, status) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    const member = findActiveMember(
        group,
        userId
    );

    if (!member) {
        throw new AppError(
            "You are not a member of this group.",
            HTTP_STATUS.FORBIDDEN
        );
    }

    const filter = {
        group: groupId,
    };

    if (status) {
        filter.status = status;
    }

    const [cycles, total] = await Promise.all([

        ContributionCycle.find(filter).select("-__v")
            .populate(
                "payoutRecipient",
                "name email avatar_url"
            )
            .populate(
                "createdBy",
                "name email"
            )
            .populate(
                "group",
                "name contributionAmount memberCount contributionAmount contributionFrequency status"
            )
            .populate(
                "payoutConfirmedBy",
                "name email avatar_url"
            )
            .sort({
                cycleNumber: -1,
            })
            .skip(skip)
            .limit(limit),

        ContributionCycle.countDocuments(filter),

    ]);

    return {
        cycles,
        pagination: createPagination(
            total,
            page,
            limit,
        ),
    };
};

export const getCycleById = async (cycleId, userId) => {

    const cycle =
        await populateContributionCycleDetails(
            ContributionCycle.findById(cycleId)
        );

    if (!cycle) {
        throw new AppError(
            "Contribution cycle not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    const group =
        await Group.findById(cycle.group._id);

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    const member = findActiveMember(
        group,
        userId
    );

    if (!member) {
        throw new AppError(
            "You are not a member of this group.",
            HTTP_STATUS.FORBIDDEN
        );
    }

    const contributions =
        await Contribution.find({
            cycle: cycle._id,
        })
            .populate(
                "member",
                "name email avatar_url"
            )
            .select("-group -cycle -__v")
            .sort({
                paymentDate: -1,
            });

    const myContribution =
        await Contribution.findOne({
            cycle: cycle._id,
            member: userId,
        })
            .select("-group -cycle -__v");

    return {
        cycle: {
            ...cycle.toObject(),
            contributions,
            myContribution,
        },
    };
};