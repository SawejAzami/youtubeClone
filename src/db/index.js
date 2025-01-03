
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

dotenv.config();

const connectionDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("MONGODB connected")
    console.log(
      `\n MongoDB Connection!! ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection fail", error);
    process.exit(1);
  }
};
export default connectionDB;

