import HTTP_STATUS from "../constants/http-status.js";

import {
  AppError,
  asyncHandler,
} from "../utils/index.js";

const restrictTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          HTTP_STATUS.FORBIDDEN
        )
      );
    }

    next();
  });
};

export default restrictTo;