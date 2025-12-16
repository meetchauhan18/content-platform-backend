import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  });
