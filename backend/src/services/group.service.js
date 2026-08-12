import Group from "../models/group.model.js";
import AppError from "../utils/app-error.js";
import { createPagination } from "../utils/index.js";
import { getAccessibleGroup } from "./group-access.service.js";
import { createMember } from "../utils/index.js";
import HTTP_STATUS from "../constants/http-status.js";
import mongoose from "mongoose";
import ContributionCycle from "../models/contribution-cycle.model.js";
import Contribution from "../models/contribution.model.js";
import { findMember, getActiveMemberCount } from "../helper/group-member.helper.js";

const populateGroup = (query) => {
    return query
        .populate("createdBy", "name email")
        .populate("members.user", "name email")
        .populate("payoutOrder", "name email");
};

export const createGroup = async (groupData) => {
    const group = await Group.create(groupData);

    return await populateGroup(
        Group.findById(group._id)
    );
};

export const getMyGroups = async (
    userId,
    page,
    limit,
    skip
) => {
    const filter = {
        "members.user": userId,
    };

    const [groups, total] = await Promise.all([
        populateGroup(
            Group.find(filter)
        )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        Group.countDocuments(filter),
    ]);

    const pagination = createPagination({
        total,
        page,
        limit,
    });

    return {
        groups,
        pagination,
    };
};

export const getGroupById = async (groupId, userId) => {
    return await getAccessibleGroup(groupId, userId);
};

export const joinGroup = async (inviteCode, userId) => {
    const group = await Group.findOne({ inviteCode });

    if (!group) {
        throw new AppError("Invalid invite code.", HTTP_STATUS.NOT_FOUND);
    }

    const existingMember = findMember(group, userId);

    if (existingMember?.isActive) {
        throw new AppError(
            "You are already a member of this group.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    if (existingMember && !existingMember.isActive) {

        if (
            getActiveMemberCount(group) >=
            group.maxMembers
        ) {
            throw new AppError(
                "This group has reached its maximum number of members.",
                HTTP_STATUS.BAD_REQUEST
            );
        }
        existingMember.isActive = true;
        existingMember.rejoinedAt = new Date();
        existingMember.leftAt = undefined;
        existingMember.hasReceivedPayout = false;

        const alreadyInPayoutOrder =
            group.payoutOrder.some((id) =>
                id.equals(userId)
            );

        if (!alreadyInPayoutOrder) {
            group.payoutOrder.push(userId);
        }

        if (
            getActiveMemberCount(group) ===
            group.maxMembers
        ) {
            group.status = "active";
        }

        await group.save();

        return await populateGroup(
            Group.findById(group._id)
        );
    }

    if (getActiveMemberCount(group) >= group.maxMembers) {
        throw new AppError(
            "This group has reached its maximum number of members.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    group.members.push(createMember(userId));

    if (getActiveMemberCount(group) === group.maxMembers) {
        group.status = "active";

        if (group.payoutOrder.length === 0) {
            group.payoutOrder = group.members.map(
                (member) => member.user
            );
        }
    }

    await group.save();

    return await populateGroup(
        Group.findById(group._id)
    );
};

export const deleteGroup = async (groupId, userId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (!group.createdBy.equals(userId)) {
        throw new AppError(
            "Only the group creator can delete this group.",
            HTTP_STATUS.FORBIDDEN
        );
    }

    if (group.status === "completed") {
        throw new AppError(
            "Completed groups cannot be deleted.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const activeCycle =
        await ContributionCycle.findOne({
            group: group._id,
            status: {
                $in: [
                    "open",
                    "ready_for_payout",
                ],
            },
        });

    if (activeCycle) {
        throw new AppError(
            "This group has an active contribution cycle and cannot be deleted.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        await Contribution.deleteMany(
            {
                group: group._id,
            },
            {
                session,
            }
        );

        await ContributionCycle.deleteMany(
            {
                group: group._id,
            },
            {
                session,
            }
        );

        await Group.deleteOne(
            { _id: group._id },
            { session }
        );

        await session.commitTransaction();

    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        await session.endSession();
    }
};
