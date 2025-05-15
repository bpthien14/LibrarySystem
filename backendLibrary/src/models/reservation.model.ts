import mongoose, { Schema, Document } from 'mongoose';

interface IEmbeddedUser {
  _id: mongoose.Types.ObjectId;
  memberId: string;
  fullName: string;
}

interface IEmbeddedBookInfo {
  _id: mongoose.Types.ObjectId;
  title: string;
}

export interface IReservation extends Document {
  member: IEmbeddedUser;
  book: IEmbeddedBookInfo;
  reservationDate: Date;
  expiryDate: Date;
  status: 'Đang chờ' | 'Đã nhận' | 'Đã hủy' | 'Hết hạn';
  notificationSent?: boolean;
  notificationDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddedUserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  memberId: { type: String, required: true },
  fullName: { type: String, required: true }
}, { _id: false });

const EmbeddedBookInfoSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true }
}, { _id: false });

const ReservationSchema: Schema = new Schema({
  member: { type: EmbeddedUserSchema, required: true },
  book: { type: EmbeddedBookInfoSchema, required: true },
  reservationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Đang chờ', 'Đã nhận', 'Đã hủy', 'Hết hạn'], default: 'Đang chờ' },
  notificationSent: { type: Boolean, default: false },
  notificationDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model<IReservation>('Reservation', ReservationSchema);