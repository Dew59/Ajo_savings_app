import Group from "../models/group.model.js";
import AppError from "../utils/app-error.js";

export const getAccessibleGroup = async (groupId, userId) => {
    const group = await Group.findById(groupId)
        .populate("createdBy", "name email")
        .populate("members.user", "name email")
        .populate("payoutOrder", "name email avatar");

    if (!group) {
        throw new AppError("Group not found.", 404);
    }

    const isMember = group.members.some(
        (member) =>
            member.user &&
            member.user._id.toString() === userId.toString() &&
            member.isActive
    );

    if (!isMember) {
        throw new AppError(
            "You are not authorized to access this group.",
            403
        );
    }

    return group;
};