import config from "@/common/config/config";
import ServerInternalException from "@/common/exception/ServerInternalExeption";
import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect(config.JWTDbUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new ServerInternalException({
      errorCode: "connect_database_error",
      errorMessage: error.message,
    });
  }
};
