import dotenv from "dotenv";
import connectDB from "./db/index.js";

// Load .env from project root
dotenv.config({
  path: './.env'
});

connectDB();
