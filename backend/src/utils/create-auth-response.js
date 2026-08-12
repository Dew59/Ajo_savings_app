import generateToken from "./jwt.js";
import cookieOptions from "./cookie-options.js";
import sendResponse from "./api-response.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";

const createAuthResponse = (
  user,
  statusCode,
  res,
  message
) => {
  // Generate JWT
  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  // Store JWT in an HTTP-only cookie
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);

  // Remove password before sending the user object
  user.password = undefined;

  return sendResponse({
    res,
    statusCode,
    message,
    data: {
      user,
    },
  });
};

export default createAuthResponse;