import { Document, Types } from "mongoose";

export interface ICopy {
  copyId: string;
  acquisitionDate: Date;
  status: 'Có sẵn' | 'Đang mượn' | 'Bảo trì' | 'Mất';
  shelfLocation: string;
  condition: string;
  notes?: string;
}

export interface IEmbeddedCategory {
  _id: Types.ObjectId;
  name: string;
}

export interface IEmbeddedAuthor {
  _id: Types.ObjectId;
  name: string;
}

export interface IEmbeddedPublisher {
  _id: Types.ObjectId;
  name: string;
}

export interface IBook extends Document {
  title: string;
  isbn?: string;
  publishedYear?: number;
  language?: string;
  pages?: number;
  price?: number;
  description?: string;
  category: IEmbeddedCategory;
  authors: IEmbeddedAuthor[];
  publisher: IEmbeddedPublisher;
  copies: ICopy[];
  averageRating?: number;
  totalRatings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookDTO {
  title: string;
  isbn?: string;
  publishedYear?: number;
  language?: string;
  pages?: number;
  price?: number;
  description?: string;
  category: IEmbeddedCategory;
  authors: IEmbeddedAuthor[];
  publisher: IEmbeddedPublisher;
  copies?: ICopy[];
}

export interface BookSearchResult {
  books: IBook[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}