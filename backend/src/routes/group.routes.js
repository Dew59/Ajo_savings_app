import { Router } from "express";
import { createGroup, getMyGroups, getGroupById, joinGroup } from "../controllers/group.controller.js";
import protect from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import { createGroupSchema } from "../validators/group.validator.js";
import { getGroupsSchema } from "../validators/group-query.validator.js";
import { groupIdSchema } from "../validators/group-id.validator.js";
import { joinGroupSchema } from "../validators/join-group.validator.js";
import { deleteGroupSchema } from "../validators/delete-group.validator.js";
import { deleteGroup } from "../controllers/group.controller.js";
import { createLeaveRequestSchema, getLeaveRequestsSchema, approveLeaveRequestSchema } from "../validators/leave-request.validator.js";
import { createLeaveRequest, getLeaveRequests, approveLeaveRequest, getMyLeaveRequest } from "../controllers/leave-request.controller.js";

const router = Router();

router.post(
  "/create-group",
  protect,
  validate(createGroupSchema),
  createGroup
);

router.get(
  "/",
  protect,
  validate(getGroupsSchema),
  getMyGroups
);

router.get(
  "/:groupId",
  protect,
  validate(groupIdSchema),
  getGroupById
);

router.post(
  "/join",
  protect,
  validate(joinGroupSchema),
  joinGroup
);

router.delete(
  "/:groupId/delete",
  protect,
  validate(deleteGroupSchema),
  deleteGroup
);

router.post(
  "/:groupId/leave-request",
  protect,
  validate(createLeaveRequestSchema),
  createLeaveRequest
);

router.get(
  "/:groupId/leave-requests",
  protect,
  validate(getLeaveRequestsSchema),
  getLeaveRequests
);

router.get(
  "/:groupId/leave-request",
  protect,
  validate(groupIdSchema),
  getMyLeaveRequest
);

router.patch(
  "/leave-requests/:requestId/approve",
  protect,
  validate(approveLeaveRequestSchema),
  approveLeaveRequest
);

export default router;