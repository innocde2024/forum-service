import dotenv from "dotenv";
import { ENV } from "@/common/interfaces/env";
dotenv.config();
class ConfigService {
  getEnv(key: keyof ENV): string {
    if (!process.env[key]) {
      throw new Error(key + " environment variable does not set");
    }
    return process.env[key]!;
  }

  get contextPath(): string {
    return this.getEnv("CONTEXT_PATH");
  }

  get portServer(): number {
    return Number.parseInt(this.getEnv("PORT"));
  }

  get hostServer(): string {
    return this.getEnv("HOST");
  }
  get JWTSecretKey(): string {
    return this.getEnv("JWT_SECRET");
  }
  get JWTDbUri(): string {
    return this.getEnv("DB_URI");
  }
  get RABBIT_URI(): string {
    return this.getEnv("RABBIT_URI");
  }
  get CLIENT_URI(): string {
    return this.getEnv("CLIENT_URI");
  }
}
const config = new ConfigService();
export default config;
