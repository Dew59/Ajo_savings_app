import Group from "../models/group.model.js";
import HTTP_STATUS from "../constants/http-status.js";
import * as groupService from '../services/group.service.js'
import { getPagination, createMember } from "../utils/index.js";

import {
  asyncHandler,
  sendResponse,
} from "../utils/index.js";

export const createGroup = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    contributionAmount,
    contributionFrequency,
    maxMembers,
  } = req.validatedData.body;

  const group = await groupService.createGroup({
    name,
    description,
    contributionAmount,
    contributionFrequency,
    maxMembers,

    createdBy: req.user._id,

    members: [
      createMember(req.user._id),
    ],
  });

  const populatedGroup = await Group.findById(group._id)
  .populate("createdBy", "name email")
  .populate("members.user", "name email");

  return sendResponse({
    res,
    statusCode: HTTP_STATUS.CREATED,
    message: "Group created successfully.",
    data: {
      group: populatedGroup,
    },
  });
});

export const getMyGroups = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const {groups, pagination} = await groupService.getMyGroups(
    req.user._id,
    page,
    limit,
    skip
  );

  return sendResponse({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Groups retrieved successfully.",
    data: {
      groups,
    },
    pagination,
  });
});

export const getGroupById = asyncHandler(async (req, res) => {
  const { groupId } = req.validatedData.params;

  const group = await groupService.getGroupById(
    groupId,
    req.user._id
  );

  return sendResponse({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Group retrieved successfully.",
    data: {
      group,
    },
  });
});

export const joinGroup = asyncHandler(async (req, res) => {
  const { inviteCode } = req.validatedData.body;

  const group = await groupService.joinGroup(
    inviteCode,
    req.user._id
  );

  return sendResponse({
    res,
    statusCode: HTTP_STATUS.OK,
    message: "Successfully joined the group.",
    data: {
      group,
    },
  });
});

export const deleteGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.validatedData.params;

    await groupService.deleteGroup(
        groupId,
        req.user._id
    );

    return sendResponse({
        res,
        statusCode: HTTP_STATUS.OK,
        message: "Group deleted successfully.",
    });
});