import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB with server", data.connection.host);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
