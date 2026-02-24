import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { AppError } from "../utils/appError";
import { signAccessToken } from "../utils/jwt";

export const AuthService = () => {
  async function registerUser(name: string, email: string, password: string) {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new AppError("Email already exists", 409);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "USER",
    });

    const token = signAccessToken((user as any)._id.toString(), (user as any).role);

    return {
      accessToken: token,
      user: {
        id: (user as any)._id,
        name: (user as any).name,
        email: (user as any).email,
        role: (user as any).role
      },
    };
  }

  async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new AppError("Invalid credentials", 401);

    const ok = await bcrypt.compare(password, (user as any).passwordHash);
    if (!ok) throw new AppError("Invalid credentials", 401);

    const token = signAccessToken((user as any)._id.toString(), (user as any).role);

    return {
      accessToken: token,
      user: { id: (user as any)._id, name: (user as any).name, email: (user as any).email, role: (user as any).role },
    };
  }

  async function getMe(userId: string) {
    const user = await User.findById(userId).select("_id name email role createdAt");
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
  return {
    registerUser,
    loginUser,
    getMe
  }
}
