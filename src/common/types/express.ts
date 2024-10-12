import express from "express";

export interface UserInfo {
  id: string;
  email: string;
  role: string;
}

export type RequestCustom = express.Request & { userInfo: UserInfo };
