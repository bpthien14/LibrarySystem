import Member from "../models/member.model";
import User from "../models/user.model";
import Borrowing from "../models/borrowing.model";
import { MemberDTO, DeleteMemberResult } from "../types/member.types";
import { generateMemberId } from "../utils/idGenerator";

interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

export const getMembers = async (
  filters: Record<string, any>, 
  options: PaginationOptions
) => {
  try {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const sortOption: any = {};
    if (sort) {
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      sortOption[sortField] = sortOrder;
    } else {
      sortOption.memberId = 1; 
    }

    const members = await Member.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Member.countDocuments(filters);

    return {
      members,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

export const getMemberById = async (id: string) => {
  try {
    const member = await Member.findById(id);
    return member;
  } catch (error) {
    throw error;
  }
};

export const createMember = async (memberData: MemberDTO) => {
  try {
    if (!memberData.memberId) {
      const lastMember = await Member.findOne().sort({ memberId: -1 });
      memberData.memberId = generateMemberId(lastMember?.memberId);
    }

    const registrationDate = new Date();
    let expiryDate;
    
    if (memberData.expiryDate) {
      expiryDate = new Date(memberData.expiryDate);
    } else {
      expiryDate = new Date(registrationDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    const newMemberData = {
      ...memberData,
      registrationDate,
      expiryDate,
      status: memberData.status || 'Hoạt động',
      currentBorrowings: [],
      borrowingHistory: {
        totalBorrowed: 0,
        totalOverdue: 0
      },
      fines: {
        totalAmount: 0,
        unpaidAmount: 0
      }
    };

    const newMember = await Member.create(newMemberData);
    return newMember;
  } catch (error) {
    throw error;
  }
};

export const updateMember = async (id: string, memberData: MemberDTO) => {
  try {
    if (memberData.expiryDate && typeof memberData.expiryDate === 'string') {
      memberData.expiryDate = new Date(memberData.expiryDate);
    }

    if (memberData.dateOfBirth && typeof memberData.dateOfBirth === 'string') {
      memberData.dateOfBirth = new Date(memberData.dateOfBirth);
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { $set: memberData },
      { new: true }
    );

    if (updatedMember && memberData.email) {
      await User.updateMany(
        { memberId: id },
        { $set: { email: memberData.email } }
      );
    }
    
    return updatedMember;
  } catch (error) {
    throw error;
  }
};

export const canDeleteMember = async (id: string): Promise<DeleteMemberResult> => {
  try {
    const member = await Member.findById(id);
    if (!member) {
      return { ok: false, message: "Không tìm thấy độc giả" };
    }
    
    if (member.currentBorrowings && member.currentBorrowings.length > 0) {
      return { 
        ok: false, 
        message: "Không thể xóa độc giả vì đang mượn sách" 
      };
    }
    
    if (member.fines && member.fines.unpaidAmount > 0) {
      return { 
        ok: false, 
        message: "Không thể xóa độc giả vì có tiền phạt chưa thanh toán" 
      };
    }
    
    const hasBorrowingHistory = await Borrowing.exists({ 'member._id': id });
    if (hasBorrowingHistory) {
      return { 
        ok: false, 
        message: "Không thể xóa độc giả vì có lịch sử mượn sách. Hãy đánh dấu là 'Hết hạn' thay vì xóa" 
      };
    }
    
    return { ok: true };
  } catch (error) {
    throw error;
  }
};

export const deleteMember = async (id: string) => {
  try {
    await User.deleteMany({ memberId: id });
    
    const result = await Member.findByIdAndDelete(id);
    return result;
  } catch (error) {
    throw error;
  }
};