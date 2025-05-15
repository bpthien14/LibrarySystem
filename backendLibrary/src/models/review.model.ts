import mongoose, { Schema, Document } from 'mongoose';

interface IEmbeddedBookInfoReview {
  _id: mongoose.Types.ObjectId;
  title: string;
}

interface IEmbeddedMemberInfoReview {
  _id: mongoose.Types.ObjectId;
  memberId: string;  
  fullName: string;
}

export interface IReview extends Document {
  book: IEmbeddedBookInfoReview;
  member: IEmbeddedMemberInfoReview;
  rating: number;
  content?: string;
  reviewDate: Date;
  likes: number;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddedBookInfoReviewSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true }
}, { _id: false });

const EmbeddedMemberInfoReviewSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  memberId: { type: String, required: true }, 
  fullName: { type: String, required: true }
}, { _id: false });

const ReviewSchema: Schema = new Schema({
  book: { type: EmbeddedBookInfoReviewSchema, required: true },
  member: { type: EmbeddedMemberInfoReviewSchema, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String },
  reviewDate: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ['Chờ duyệt', 'Đã duyệt', 'Từ chối'], default: 'Chờ duyệt' }
}, { timestamps: true });

export default mongoose.model<IReview>('Review', ReviewSchema);