import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../types/book.types';

const CategoryEmbeddedSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true }
}, { _id: false });

const AuthorEmbeddedSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true }
}, { _id: false });

const PublisherEmbeddedSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true }
}, { _id: false });

const CopySchema = new Schema({
  copyId: { type: String, required: true },
  acquisitionDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Có sẵn', 'Đang mượn', 'Bảo trì', 'Mất'],
    default: 'Có sẵn'
  },
  shelfLocation: { type: String, required: true },
  condition: { type: String, required: true },
  notes: { type: String }
}, { _id: false });

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  isbn: { type: String, unique: true, sparse: true },
  publishedYear: { type: Number },
  language: { type: String, default: 'Tiếng Việt' },
  pages: { type: Number },
  price: { type: Number },
  description: { type: String },
  category: { type: CategoryEmbeddedSchema, required: true },
  authors: { type: [AuthorEmbeddedSchema], default: [] },
  publisher: { type: PublisherEmbeddedSchema, required: true },
  copies: { type: [CopySchema], default: [] },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);