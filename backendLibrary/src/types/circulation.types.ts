import { Document, Types } from "mongoose";

export interface IBorrowing extends Document {
  borrowingId: string;
  member: {
    _id: Types.ObjectId;
    memberId: string;
    fullName: string;
  };
  bookCopy: {
    bookId: Types.ObjectId;
    copyId: string;
    title: string;
  };
  issuedBy: {
    _id: Types.ObjectId;
    staffId: string;
    fullName: string;
  };
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  returnedTo?: {
    _id: Types.ObjectId;
    staffId: string;
    fullName: string;
  };
  status: 'Đang mượn' | 'Đã trả' | 'Quá hạn';
  renewalCount: number;
  notes?: string;
  fine: {
    amount: number;
    reason?: string;
    status: 'Không có' | 'Chưa thanh toán' | 'Đã thanh toán';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BorrowingCreateDTO {
  memberId: string;
  bookId: string;
  copyId: string;
  borrowDate?: Date | string;
  dueDate?: Date | string;
  notes?: string;
}

export interface BorrowingReturnDTO {
  returnDate?: Date | string;
  condition?: string; 
  fine?: {
    amount: number;
    reason?: string;
  };
  notes?: string;
}

export interface BorrowingRenewDTO {
  newDueDate?: Date | string; 
  notes?: string;
}

export interface IReservation extends Document {
  member: {
    _id: Types.ObjectId;
    memberId: string;
    fullName: string;
  };
  book: {
    _id: Types.ObjectId;
    title: string;
  };
  reservationDate: Date;
  expiryDate: Date;
  status: 'Đang chờ' | 'Đã nhận' | 'Đã hủy' | 'Hết hạn';
  notificationSent: boolean;
  notificationDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReservationCreateDTO {
  memberId: string;
  bookId: string;
  notes?: string;
}

export interface BorrowingSearchResult {
  borrowings: IBorrowing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ReservationSearchResult {
  reservations: IReservation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BorrowingFilter {
    'member.memberId'?: string;
    'bookCopy.bookId'?: string;
    status?: 'Đang mượn' | 'Đã trả' | 'Quá hạn';
    borrowDate?: {
      $gte?: Date;
      $lte?: Date;
    };
  }