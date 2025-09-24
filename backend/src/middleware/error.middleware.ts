// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

/**
 * Error-handling middleware for logging and responding to errors consistently.
 *
 * @param err - The error object
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The next middleware function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Standard error response structure
  res.status(500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });

  next();
};
