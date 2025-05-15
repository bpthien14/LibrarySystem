import mongoose, { Schema, Document } from 'mongoose';

interface ILoginHistory {
  timestamp: Date;
  ipAddress?: string;
}

export interface IUser extends Document {
  username: string;
  password?: string; 
  role: 'admin' | 'librarian' | 'staff' | 'member'; 
  staffId?: mongoose.Types.ObjectId | null; 
  memberId?: mongoose.Types.ObjectId | null; 
  status: 'Hoạt động' | 'Khóa';
  lastLogin?: Date;
  loginHistory: ILoginHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const LoginHistorySchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String }
}, { _id: false });

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, 
  role: { type: String, enum: ['admin', 'librarian', 'staff', 'member'], required: true },
  staffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member', default: null },
  status: { type: String, enum: ['Hoạt động', 'Khóa'], default: 'Hoạt động' },
  lastLogin: { type: Date },
  loginHistory: { type: [LoginHistorySchema], default: [] }
}, { timestamps: true });


export default mongoose.model<IUser>('User', UserSchema);