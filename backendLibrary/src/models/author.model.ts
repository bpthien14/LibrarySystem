import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  biography?: string;
  nationality?: string;
  birthYear?: number;
  deathYear?: number | null;
  bookCount: number; 
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema: Schema = new Schema({
  name: { type: String, required: true },
  biography: { type: String },
  nationality: { type: String },
  birthYear: { type: Number },
  deathYear: { type: Number, default: null },
  bookCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IAuthor>('Author', AuthorSchema);
