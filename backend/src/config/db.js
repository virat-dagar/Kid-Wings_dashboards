import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || "eduwings",
  });
  console.log("MongoDB connected");
};
