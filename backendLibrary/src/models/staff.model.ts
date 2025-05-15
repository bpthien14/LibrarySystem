import mongoose, { Schema, Document } from 'mongoose';

interface IAccount {
  username: string;
  role: 'admin' | 'librarian' | 'staff';
}

export interface IStaff extends Document {
  staffId: string;
  fullName: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
  dateOfBirth?: Date;
  address?: string;
  phone?: string;
  email: string;
  position?: string;
  startDate: Date;
  salary?: number;
  status: 'Đang làm việc' | 'Nghỉ phép' | 'Đã nghỉ việc';
  account: IAccount;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'librarian', 'staff'], required: true }
}, { _id: false });

const StaffSchema: Schema = new Schema({
  staffId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'] },
  dateOfBirth: { type: Date },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  position: { type: String },
  startDate: { type: Date, default: Date.now },
  salary: { type: Number },
  status: { type: String, enum: ['Đang làm việc', 'Nghỉ phép', 'Đã nghỉ việc'], default: 'Đang làm việc' },
  account: { type: AccountSchema, required: true }
}, { timestamps: true });

export default mongoose.model<IStaff>('Staff', StaffSchema);