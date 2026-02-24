import mongoose from "mongoose";
import { env } from "process";

export async function connectDB(): Promise<void> {
  const uri = env.DB_URI;

  if (!uri) {
    throw new Error("DB_URI missing. Check .env in project root.");
  }

  await mongoose.connect(uri);
}
