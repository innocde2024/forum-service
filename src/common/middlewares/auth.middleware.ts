import { Request, NextFunction, Response } from "express";
import UnAuthorException from "../exception/UnAuthorException";
import Jwt from "../utils/Jwt";
import { RequestCustom } from "../types/express";
export const authMiddleware = async (
  req: RequestCustom,
  _: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    throw new UnAuthorException({
      errorMessage: "You need to login before",
      errorCode: "Unauthorized",
    });
  }
  try {
    const payload = Jwt.verifyAccessToken(authorizationHeader as string);

    req.userInfo = payload;
    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnAuthorException({
        errorCode: "tokenExpired",
        errorMessage: "Token was expired",
      });
    }
    console.log(error);
    throw new UnAuthorException({
      errorCode: "InvalidToken",
      errorMessage: "Invalid token",
    });
  }
};
