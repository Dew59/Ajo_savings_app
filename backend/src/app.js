import express from "express";
import globalErrorHandler from "./middlewares/global-error-handler.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import API_ROUTES from "./constants/api-routes.js";
import cors from "cors";
import groupRoutes from "./routes/group.routes.js";
import contributionCycleRoutes from "./routes/contribution-cycle.route.js";
import contributionRoutes from "./routes/contribution.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import { AppError } from "./utils/index.js";
import HTTP_STATUS from "./constants/http-status.js";
import healthRoutes from "./routes/health.route.js";
import userRoutes from "./routes/user.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(API_ROUTES.AUTH, authRoutes);
app.use(API_ROUTES.GROUPS, groupRoutes);
app.use(API_ROUTES.GROUPS, contributionCycleRoutes);
app.use(API_ROUTES.CYCLES, contributionRoutes);
app.use(API_ROUTES.USERS, userRoutes)
app.use("/api/v1/", dashboardRoutes);
app.use(API_ROUTES.HEALTH, healthRoutes);

// app.get("api/v1/auth/me", protect, (req, res) => {
//   return sendResponse({
//     res,
//     statusCode: HTTP_STATUS.OK,
//     message: "Authenticated user retrieved successfully.",
//     data: {
//       user: req.user,
//     },
//   });
// });

app.use((req, res, next) => {
  next(
    new AppError(
      `The endpoint ${req.originalUrl} does not exist in the server`,
      HTTP_STATUS.NOT_FOUND
    )
  );
});

// Register this LAST, after all routes
app.use(globalErrorHandler);

export default app;

