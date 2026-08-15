import Group from "../models/group.model.js";
import Contribution from "../models/contribution.model.js";
import ContributionCycle from "../models/contribution-cycle.model.js";

export const getDashboard = async (userId) => {

    const [
        totalGroups,
        activeGroups,
        pendingGroups,
        completedGroups,
        totalContributionResult,
        pendingPayouts,
        currentCycles,
        recentContributions,
    ] = await Promise.all([
        Group.countDocuments({
            members: {
                $elemMatch: {
                    user: userId,
                    isActive: true,
                },
            },
        }),

        Group.countDocuments({
            status: "active",
            members: {
                $elemMatch: {
                    user: userId,
                    isActive: true,
                },
            },
        }),

        Group.countDocuments({
            status: "pending",
            members: {
                $elemMatch: {
                    user: userId,
                    isActive: true,
                },
            },
        }),

        Group.countDocuments({
            status: "completed",
            members: {
                $elemMatch: {
                    user: userId,
                    isActive: true,
                },
            },
        }),

        Contribution.aggregate([
            {
                $match: {
                    member: userId,
                    status: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]),



        ContributionCycle.countDocuments({
            createdBy: userId,
            status: "ready_for_payout",
        }),

        ContributionCycle.find({
            status: {
                $in: [
                    "open",
                    "ready_for_payout",
                ],
            },
        }).select("-__v")
            .populate({
                path: "group",
                select: "name members",
                populate: {
                    path: "members.user",
                    select: "name email",
                },
            })
            .populate(
                "payoutRecipient",
                "name email"
            ),



        Contribution.find({
            member: userId,
        }).select("-__v")
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .populate(
                "group",
                "name members"
            )
            .populate(
                "member",
                "name email avatar"
            )
            .populate(
                "cycle",
                "cycleNumber"
            ),
    ]);

    const totalContributions = totalContributionResult[0]?.total || 0;

    const filteredCurrentCycles = currentCycles.filter((cycle) =>
        Boolean(
            cycle.group &&
                cycle.group.members &&
                cycle.group.members.some((member) => {
                    const userObj = member.user;
                    const isSameUser =
                        userObj && typeof userObj.equals === 'function'
                            ? userObj.equals(userId)
                            : String(userObj) === String(userId);

                    return isSameUser && member.isActive;
                })
        )
    );

    const groups = await Group.find({
        members: {
            $elemMatch: {
                user: userId,
                isActive: true,
            },
        }
    })
        .select(
            "name status contributionAmount members"
        )
        .lean();

    return {
        summary: {
            totalGroups,
            activeGroups,
            pendingGroups,
            completedGroups,
            totalContributions,
            pendingPayouts,
            groups,
        },

        currentCycles: filteredCurrentCycles,

        recentContributions,
    };
};