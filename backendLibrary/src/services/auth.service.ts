import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { LoginInput, LoginResult } from "../types/auth.types";

dotenv.config();

export const login = async (loginData: LoginInput): Promise<LoginResult> => {
  const { username, password, ipAddress } = loginData;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  if (!user.password) {
    throw new Error("Lỗi xác thực mật khẩu");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error("Mật khẩu không chính xác");
  }

  await User.findByIdAndUpdate(user._id, {
    lastLogin: new Date(),
    $push: {
      loginHistory: {
        timestamp: new Date(),
        ipAddress: ipAddress || "unknown",
      },
    },
  });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET không được cấu hình");
  }

  const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "4h",
  });

  return {
    token,
    user: {
      _id: String(user._id),
      username: user.username,
      role: user.role,
      status: user.status,
    },
  };
};
