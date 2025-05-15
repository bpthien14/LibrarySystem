import mongoose, { Schema, Document } from 'mongoose';

interface IEmbeddedMember {
  _id: mongoose.Types.ObjectId;
  memberId: string;
  fullName: string;
}

interface IEmbeddedBookCopy {
  bookId: mongoose.Types.ObjectId;
  copyId: string;
  title: string;
}

interface IEmbeddedStaff {
  _id: mongoose.Types.ObjectId;
  staffId: string;
  fullName: string;
}

interface IFineDetails {
  amount: number;
  reason?: string | null;
  status: 'Không có' | 'Chưa thanh toán' | 'Đã thanh toán';
}

export interface IBorrowing extends Document {
  borrowingId: string;
  member: IEmbeddedMember;
  bookCopy: IEmbeddedBookCopy;
  issuedBy: IEmbeddedStaff;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date | null;
  returnedTo?: IEmbeddedStaff | null;
  status: 'Đang mượn' | 'Đã trả' | 'Quá hạn';
  renewalCount: number;
  notes?: string;
  fine: IFineDetails;
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddedMemberSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
  memberId: { type: String, required: true },
  fullName: { type: String, required: true }
}, { _id: false });

const EmbeddedBookCopySchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  copyId: { type: String, required: true },
  title: { type: String, required: true }
}, { _id: false });

const EmbeddedStaffSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  staffId: { type: String, required: true },
  fullName: { type: String, required: true }
}, { _id: false });

const FineDetailsSchema = new Schema({
  amount: { type: Number, default: 0 },
  reason: { type: String, default: null },
  status: { type: String, enum: ['Không có', 'Chưa thanh toán', 'Đã thanh toán'], default: 'Không có' }
}, { _id: false });

const BorrowingSchema: Schema = new Schema({
  borrowingId: { type: String, required: true, unique: true },
  member: { type: EmbeddedMemberSchema, required: true },
  bookCopy: { type: EmbeddedBookCopySchema, required: true },
  issuedBy: { type: EmbeddedStaffSchema, required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  returnedTo: { type: EmbeddedStaffSchema, default: null },
  status: { type: String, enum: ['Đang mượn', 'Đã trả', 'Quá hạn'], default: 'Đang mượn' },
  renewalCount: { type: Number, default: 0 },
  notes: { type: String },
  fine: { type: FineDetailsSchema, default: { amount: 0, status: 'Không có' } }
}, { timestamps: true });

export default mongoose.model<IBorrowing>('Borrowing', BorrowingSchema);