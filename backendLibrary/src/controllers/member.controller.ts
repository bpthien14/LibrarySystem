import { Request, Response } from "express";
import * as memberService from "../services/member.service";

export const getAllMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      name, 
      email, 
      status,
      sort = "memberId" 
    } = req.query;

    const filters: Record<string, any> = {};

    if (name) filters.fullName = { $regex: name, $options: 'i' };
    if (email) filters.email = { $regex: email, $options: 'i' };
    if (status) filters.status = status;

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: sort?.toString() || "memberId"
    };

    const result = await memberService.getMembers(filters, options);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách độc giả" });
  }
};

export const getMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const member = await memberService.getMemberById(id);
    
    if (!member) {
      res.status(404).json({ message: "Không tìm thấy độc giả" });
      return;
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin độc giả" });
  }
};

export const createMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberData = req.body;
    
    if (!memberData.fullName) {
      res.status(400).json({ message: "Họ tên độc giả là bắt buộc" });
      return;
    }

    if (!memberData.email) {
      res.status(400).json({ message: "Email độc giả là bắt buộc" });
      return;
    }

    const newMember = await memberService.createMember(memberData);
    res.status(201).json(newMember);
  } catch (error) {
    console.error("Error creating member:", error);
    
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      if (error.message.includes('email')) {
        res.status(400).json({ message: "Email đã tồn tại" });
        return;
      }
      if (error.message.includes('memberId')) {
        res.status(400).json({ message: "Mã độc giả đã tồn tại" });
        return;
      }
      res.status(400).json({ message: "Dữ liệu bị trùng lặp" });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi thêm độc giả mới" });
  }
};

export const updateMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const memberData = req.body;
    
    const updatedMember = await memberService.updateMember(id, memberData);
    
    if (!updatedMember) {
      res.status(404).json({ message: "Không tìm thấy độc giả" });
      return;
    }
    
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      if (error.message.includes('email')) {
        res.status(400).json({ message: "Email đã tồn tại" });
        return;
      }
      res.status(400).json({ message: "Dữ liệu bị trùng lặp" });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin độc giả" });
  }
};

export const deleteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const canDelete = await memberService.canDeleteMember(id);
    
    if (!canDelete.ok) {
      res.status(400).json({ message: canDelete.message });
      return;
    }
    
    const result = await memberService.deleteMember(id);
    
    if (!result) {
      res.status(404).json({ message: "Không tìm thấy độc giả" });
      return;
    }
    
    res.status(200).json({ message: "Xóa độc giả thành công" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Lỗi khi xóa độc giả" });
  }
};