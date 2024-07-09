import { Request, NextFunction, Response } from "express";
import ForbiddenException from "../exception/ForbiddenException";
import { RequestCustom } from "../types/express";
export const adminMiddleware = async (
  req: RequestCustom,
  _: Response,
  next: NextFunction
) => {
  if (req.userInfo.role === "ADMIN") {
    return next();
  }
  throw new ForbiddenException({
    errorCode: "Forbidden",
    errorMessage: "Permission Error",
  });
};
