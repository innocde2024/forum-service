import jwt from "jsonwebtoken";
import { UserInfo } from "../types/express";
import config from "../config/config";
class Jwt {
  verifyAccessToken(accessToken: string) {
    try {
      const payload = jwt.verify(accessToken, config.JWTSecretKey, {
        algorithms: ["HS512"],
      });
      return payload as UserInfo;
    } catch (error) {
      console.log(error);
    }
    throw new Error("Invalid token");
  }
}
export default new Jwt();
