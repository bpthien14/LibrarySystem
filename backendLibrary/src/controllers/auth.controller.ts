import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import User from "../models/user.model";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {

        const { username, password } = req.body;
        
        if (!username || !password) {
            res.status(400).json({ 
                message: "Vui lòng cung cấp tên đăng nhập và mật khẩu" 
            });
            return;
        }
        
        const result = await authService.login({
            username,
            password,
            ipAddress: req.ip
        });
        
        res.status(200).json(result);
        return;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("không tồn tại") || 
                error.message.includes("không chính xác")) {
                res.status(401).json({ message: error.message });
                return ;
            }
            if (error.message.includes("JWT_SECRET")) {
                res.status(500).json({ message: "Lỗi cấu hình máy chủ" });
                return ;
            }
        }
        
        console.error("Error during login:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
        return;
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ 
            success: true,
            message: "Đăng xuất thành công" 
        });
        return;
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
        return;
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            res.status(401).json({ message: "Không có thông tin xác thực" });
            return;
        }
        
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
            return;
        }

        if (user.role === 'member' && user.memberId) {
            const memberInfo = await User.findById(userId)
                .populate('memberId')
                .select('memberId');
                
            res.status(200).json({
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    status: user.status,
                    lastLogin: user.lastLogin,
                    memberInfo: memberInfo?.memberId || null
                }
            });

            return;
        } else if ((user.role === 'admin' || user.role === 'librarian' || user.role === 'staff') && user.staffId) {
            const staffInfo = await User.findById(userId)
                .populate('staffId')
                .select('staffId');
                
            res.status(200).json({
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    status: user.status,
                    lastLogin: user.lastLogin,
                    staffInfo: staffInfo?.staffId || null
                }
            });

            return;
        }
        
        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                role: user.role,
                status: user.status,
                lastLogin: user.lastLogin
            }
        });

        return;
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
        return;
    }
};