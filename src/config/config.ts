import dotenv from "dotenv";

dotenv.config();

type Config = {
  readonly MONGO_URI: string;
}

if(!process.env.MONGO_URI) {
    throw new Error("MongoDB URI is not defined in environment variables");
}

export const config: Config =  {
    MONGO_URI: process.env.MONGO_URI
}