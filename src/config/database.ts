import mongoose, { MongooseError } from "mongoose";
import { config } from "./config.js";

export const connnectToDatabase = async () => {
   try {
     await mongoose.connect(config.MONGO_URI);
     console.log("MongoDB connected");      
   } catch(error) {
      console.error("MongoDB connection failure: ");
   }
}