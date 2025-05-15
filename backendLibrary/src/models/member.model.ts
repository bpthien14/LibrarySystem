import mongoose, { Schema, Document } from 'mongoose';

interface ICurrentBorrowing {
  borrowingId: mongoose.Types.ObjectId;
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

const CurrentBorrowingSchema = new Schema({
  borrowingId: { type: Schema.Types.ObjectId, ref: 'Borrowing', required: true },
  bookCopyId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  dueDate: { type: Date, required: true }
}, { _id: false });

const BorrowingHistorySchema = new Schema({
  totalBorrowed: { type: Number, default: 0 },
  totalOverdue: { type: Number, default: 0 },
  lastBorrowing: { type: Date }
}, { _id: false });

const FinesSchema = new Schema({
  totalAmount: { type: Number, default: 0 },
  unpaidAmount: { type: Number, default: 0 }
}, { _id: false });

const MemberSchema: Schema = new Schema({
  memberId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
  dateOfBirth: { type: Date },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  registrationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Hoạt động', 'Tạm khóa', 'Hết hạn'], default: 'Hoạt động' },
  currentBorrowings: { type: [CurrentBorrowingSchema], default: [] },
  borrowingHistory: { type: BorrowingHistorySchema, default: { totalBorrowed: 0, totalOverdue: 0 } },
  fines: { type: FinesSchema, default: { totalAmount: 0, unpaidAmount: 0 } }
}, { timestamps: true });

export default mongoose.model<IMember>('Member', MemberSchema);