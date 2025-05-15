import mongoose, { Schema, Document } from 'mongoose';

interface IEmbeddedUserInfo {
  _id: mongoose.Types.ObjectId;
  memberId: string;
  fullName: string;
}

interface IEmbeddedBookDetails {
  _id: mongoose.Types.ObjectId;
  title: string;
  copyId: string;
}

interface IEmbeddedStaffInfo {
  _id: mongoose.Types.ObjectId;
  staffId: string;
  fullName: string;
}

export interface IFine extends Document {
  member: IEmbeddedUserInfo;
  borrowing: mongoose.Types.ObjectId; 
  book: IEmbeddedBookDetails;
  amount: number;
  reason: string;
  issueDate: Date;
  status: 'Chưa thanh toán' | 'Đã thanh toán';
  paymentDate?: Date;
  receivedBy?: IEmbeddedStaffInfo;
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddedUserInfoSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  memberId: { type: String, required: true }, 
  fullName: { type: String, required: true }
}, { _id: false });

const EmbeddedBookDetailsSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true },
  copyId: { type: String, required: true }
}, { _id: false });

const EmbeddedStaffInfoSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  staffId: { type: String, required: true },
  fullName: { type: String, required: true }
}, { _id: false });

const FineSchema: Schema = new Schema({
  member: { type: EmbeddedUserInfoSchema, required: true },
  borrowing: { type: Schema.Types.ObjectId, ref: 'Borrowing', required: true },
  book: { type: EmbeddedBookDetailsSchema, required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Chưa thanh toán', 'Đã thanh toán'], default: 'Chưa thanh toán' },
  paymentDate: { type: Date },
  receivedBy: { type: EmbeddedStaffInfoSchema }
}, { timestamps: true });

export default mongoose.model<IFine>('Fine', FineSchema);