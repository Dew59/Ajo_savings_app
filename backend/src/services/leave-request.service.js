import Group from "../models/group.model.js";
import AppError from "../utils/app-error.js";
import HTTP_STATUS from "../constants/http-status.js";
import LeaveRequest from "../models/leave-request.model.js";
import pagination from "../utils/pagination.js";
import mongoose from "mongoose";
import ContributionCycle from "../models/contribution-cycle.model.js";
import { findActiveMember, getActiveMemberCount } from "../helper/group-member.helper.js"

export const createLeaveRequest = async (groupId, userId, reason) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (group.createdBy.equals(userId)) {
        throw new AppError(
            "The group creator cannot leave the group.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const member = findActiveMember(group, userId);

    if (!member) {
        throw new AppError(
            "Only active members can request to leave.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const existingRequest =
        await LeaveRequest.findOne({
            group: group._id,
            member: userId,
            status: "pending",
        });

    if (existingRequest) {
        throw new AppError(
            "You already have a pending leave request.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const request =
        await LeaveRequest.create({
            group: group._id,
            member: userId,
            reason,
        });

    return await LeaveRequest.findById(request._id)
        .populate("group", "name members status")
        .populate("member", "name email");
};

export const getLeaveRequests = async (groupId, userId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (!group.createdBy.equals(userId)) {
        throw new AppError(
            "Only the group creator can view leave requests.",
            HTTP_STATUS.FORBIDDEN
        );
    }

    const requests =
        await LeaveRequest.find({
            group: group._id,
            status: "pending",
        })
            .populate("member", "name email")
            .sort({
                createdAt: 1,
            });

    return {
        requests,
        pagination,
    };
};

export const approveLeaveRequest = async (requestId, userId) => {
    const leaveRequest = await LeaveRequest.findById(requestId);

    if (!leaveRequest) {
        throw new AppError(
            "Leave request not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (
        leaveRequest.status !==
        "pending"
    ) {
        throw new AppError(
            "This leave request has already been processed.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const group = await Group.findById(
        leaveRequest.group
    );

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    if (!group.createdBy.equals(userId)) {
        throw new AppError(
            "Only the group creator can approve leave requests.",
            HTTP_STATUS.FORBIDDEN
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
            "Leave requests cannot be approved while a contribution cycle is active.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const member = findActiveMember(
            group,
            leaveRequest.member
        );

        if (!member) {
            throw new AppError(
                "Member not found in the group.",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        if (!member.isActive) {
            throw new AppError(
                "This member is already inactive.",
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const removedIndex =
            group.payoutOrder.findIndex(
                (id) =>
                    id.equals(
                        leaveRequest.member
                    )
            );

        // Soft delete
        member.isActive = false;

        member.leftAt = new Date();

        // Remove from payout order
        group.payoutOrder =
            group.payoutOrder.filter(
                (id) =>
                    !id.equals(
                        leaveRequest.member
                    )
            );

        // Adjust payout index
        if (
            removedIndex !== -1 &&
            removedIndex <
            group.currentPayoutIndex
        ) {
            group.currentPayoutIndex--;
        }

        // Prevent negative index
        if (group.currentPayoutIndex < 0) {
            group.currentPayoutIndex = 0;
        }

        // Count active members
        const activeMemberCount =
            getActiveMemberCount(group);

        // Group can no longer operate
        if (activeMemberCount < 2) {
            group.status = "recruiting";
        }

        leaveRequest.status =
            "approved";

        leaveRequest.approvedBy =
            userId;

        leaveRequest.approvedAt =
            new Date();

        await group.save({ session });

        await leaveRequest.save({
            session,
        });

        await session.commitTransaction();

        return await LeaveRequest.findById(leaveRequest._id)
            .populate("group", "name members status")
            .populate("member", "name email")
            .populate("approvedBy", "name email");

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};


export const getMyLeaveRequest = async (groupId, userId) => {
    const group = await Group.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found.",
            HTTP_STATUS.NOT_FOUND
        );
    }

    const member = findActiveMember(group, userId);

    if (!member) {
        throw new AppError(
            "You are not a member of this group.",
            HTTP_STATUS.FORBIDDEN
        );
    }

    const leaveRequest = await LeaveRequest.findOne({
        group: group._id,
        member: userId,
        status: "pending",
    })
        .populate("group", "name status")
        .populate("member", "name email");

    return leaveRequest;
};