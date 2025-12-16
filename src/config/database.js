import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected: ", conn.connection.host);
    console.log("Database", conn.connection.name);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.log("MongoDB disconnection error: ", error);
  }
};

export { connectDB, closeDB };
