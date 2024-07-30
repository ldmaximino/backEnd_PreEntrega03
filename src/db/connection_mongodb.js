//Third party imports
import mongoose from "mongoose";
import { URI_MONGODB, URI_MONGODB_LOCAL } from '../config/config.js';

export const initMongoDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      URI_MONGODB || URI_MONGODB_LOCAL
    );
    console.log("Connected to MongoDB 🔥🔥");
  } catch (error) {
    console.log(`${error}😡`);
  }
};
