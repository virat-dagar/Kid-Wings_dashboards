import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

// 1. Is the user signed in? Loads req.user from the cookie token.
export const requireAuth = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError(401, "Please sign in to continue");

  const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid or expired
  const user = await User.findById(payload.sub).populate("teacher");

  if (!user || !user.isActive)
    throw new AppError(401, "Account not found or disabled");

  req.user = user;
  next();
};

// 2. Does the signed-in user have one of the allowed roles?
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, "You do not have permission to do this");
    }
    next();
  };
