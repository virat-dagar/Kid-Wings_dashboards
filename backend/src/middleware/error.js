import multer from "multer";
import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "ZodError") {
    status = 400;
    message = err.issues.map((i) => i.message).join(", ");
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    status = 401;
    message = "Your session has expired. Please sign in again.";
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large (max 5 MB)"
        : err.message;
  } else if (err.code === 11000) {
    status = 409;
    message = "A record with this value already exists";
  }

  if (status === 500) console.error(err);

  res.status(status).json({ success: false, message });
};
