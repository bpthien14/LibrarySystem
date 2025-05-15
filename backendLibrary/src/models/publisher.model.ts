import mongoose, { Schema, Document } from 'mongoose';

export interface IPublisher extends Document {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PublisherSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String }
}, { timestamps: true });

export default mongoose.model<IPublisher>('Publisher', PublisherSchema);