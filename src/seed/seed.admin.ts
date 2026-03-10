import "dotenv/config"; // ← Yeh SABSE UPAR hona chahiye
import mongoose from "mongoose";
import { connectDB } from "../database/ConnectionDB";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: "ahsaankhan.dev@gmail.com" });

    if (existing) {
      console.log("⚠️  Admin already created — no action needed.");
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("ahsaankhan5000", 12);

    await User.create({
      name:     "Ahsaan Khan",
      email:    "ahsaankhan.dev@gmail.com",
      passwordHash: hashedPassword,
      role:     "ADMIN",
    });

    console.log("🚀 Admin created successfully!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedAdmin();