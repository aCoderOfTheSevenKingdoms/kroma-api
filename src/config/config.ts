import dotenv from "dotenv";
import { requireEnvVars } from "../utils/env.util.js";

dotenv.config();

type Config = {
  readonly MONGO_URI: string;
  readonly JWT_SECRET: string;
  readonly NODE_ENV: string;
  readonly GOOGLE_USER: string;
  readonly GOOGLE_REFRESH_TOKEN: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly GOOGLE_OAUTH_CLIENT_ID: string;
  readonly GOOGLE_OAUTH_CLIENT_SECRET: string;
  readonly GOOGLE_OAUTH_CALLBACK_URL: string;
  readonly API_BASE_URL: string;
  readonly CLIENT_BASE_URL: string;
}

const env = requireEnvVars(["MONGO_URI", "JWT_SECRET", "GOOGLE_USER", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET", "GOOGLE_OAUTH_CALLBACK_URL", "API_BASE_URL", "CLIENT_BASE_URL"]);

export const config: Config =  {
    MONGO_URI: env.MONGO_URI,
    JWT_SECRET: env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV ?? "development",
    GOOGLE_USER: env.GOOGLE_USER,
    GOOGLE_REFRESH_TOKEN: env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_CLIENT_ID: env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_CALLBACK_URL: env.GOOGLE_OAUTH_CALLBACK_URL,
    API_BASE_URL: env.API_BASE_URL,
    CLIENT_BASE_URL: env.CLIENT_BASE_URL
}
