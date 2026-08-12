import User from "../models/user.model.js";
import HTTP_STATUS from "../constants/http-status.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";

import {
  AppError,
  asyncHandler,
  verifyToken,
} from "../utils/index.js";

const protect = asyncHandler(async (req, res, next) => {
  // Get JWT from cookie
  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to continue.",
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  // Verify JWT
  const decoded = verifyToken(token);

  // Find current user
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user associated with this token no longer exists.",
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  req.user = currentUser;

  next();
});

export default protect;