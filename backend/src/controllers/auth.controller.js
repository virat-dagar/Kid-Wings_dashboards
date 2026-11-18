import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { publicUser } from "../utils/publicUser.js";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE,
});

export const login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email: email.toLowerCase() })
    .select("+passwordHash")
    .populate("teacher");

  const valid =
    user &&
    user.isActive &&
    (await bcrypt.compare(password, user.passwordHash));
  if (!valid) throw new AppError(401, "Invalid email or password");

  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, cookieOptions());
  res.json({ success: true, user: publicUser(user) });
};

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.json({ success: true, message: "Signed out" });
};

export const me = (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
};
