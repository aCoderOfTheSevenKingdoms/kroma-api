import mongoose from "mongoose";
import { config } from "./config.js";

export const connnectToDatabase = async () => {
   try {
     await mongoose.connect(config.MONGO_URI);
     console.log("MongoDB connected");      
   } catch(error: unknown) {
      if(error instanceof Error) {
         throw new Error(`Database connection failed: ${error.message}`);
      } else {
         throw new Error("An unexpected error occured while connecting to the database");
      }
   }
}