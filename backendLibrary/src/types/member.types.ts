import { Document, Types } from "mongoose";

interface ICurrentBorrowing {
  borrowingId: Types.ObjectId;
  bookCopyId: string;
  bookTitle: string;
  dueDate: Date;
}

interface IBorrowingHistory {
  totalBorrowed: number;
  totalOverdue: number;
  lastBorrowing?: Date;
}

interface IFines {
  totalAmount: number;
  unpaidAmount: number;
}

export interface IMember extends Document {
  memberId: string;
  fullName: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  dateOfBirth?: Date;
  address?: string;
  phone?: string;
  email: string;
  registrationDate: Date;
  expiryDate: Date;
  status: 'Hoạt động' | 'Tạm khóa' | 'Hết hạn';
  currentBorrowings: ICurrentBorrowing[];
  borrowingHistory: IBorrowingHistory;
  fines: IFines;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberDTO {
  memberId?: string;
  fullName: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  dateOfBirth?: Date | string;
  address?: string;
  phone?: string;
  email: string;
  expiryDate?: Date | string;
  status?: 'Hoạt động' | 'Tạm khóa' | 'Hết hạn';
}

export interface MemberSearchResult {
  members: IMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Kết quả kiểm tra xóa thành viên
export interface DeleteMemberResult {
  ok: boolean;
  message?: string;
}