import { Request, Response } from "express";
import * as bookService from "../services/book.service";
import { FilterQuery } from "mongoose";

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      title, 
      category, 
      author, 
      language, 
      status,
      publishedYear,
      sort = "title"
    } = req.query;

    const filters: Record<string, any> = {};

    if (title) filters.title = { $regex: title, $options: 'i' };
    if (category) filters['category.name'] = { $regex: category, $options: 'i' };
    if (author) filters['authors.name'] = { $regex: author, $options: 'i' };
    if (language) filters.language = language;
    if (publishedYear) filters.publishedYear = publishedYear;
    
    if (status) {
      filters['copies.status'] = status;
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: sort?.toString() || "title"
    };

    const result = await bookService.getBooks(filters, options);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sách" });
    return;
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);
    
    if (!book) {
      res.status(404).json({ message: "Không tìm thấy sách" });
      return;
    }

    res.status(200).json(book);
    return;
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin sách" });
    return;
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookData = req.body;
    
    if (!bookData.title) {
      res.status(400).json({ message: "Tiêu đề sách là bắt buộc" });
      return;
    }

    const newBook = await bookService.createBook(bookData);
    res.status(201).json(newBook);
    return;
  } catch (error) {
    console.error("Error creating book:", error);
    
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      res.status(400).json({ message: "Mã ISBN đã tồn tại" });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi thêm sách mới" });
    return;
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bookData = req.body;
    
    const updatedBook = await bookService.updateBook(id, bookData);
    
    if (!updatedBook) {
      res.status(404).json({ message: "Không tìm thấy sách" });
      return;
    }
    
    res.status(200).json(updatedBook);
    return;
  } catch (error) {
    console.error("Error updating book:", error);
    
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      res.status(400).json({ message: "Mã ISBN đã tồn tại" });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin sách" });
    return
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const canDelete = await bookService.canDeleteBook(id);
    
    if (!canDelete.ok) {
      res.status(400).json({ message: canDelete.message });
      return;
    }
    
    const result = await bookService.deleteBook(id);
    
    if (!result) {
      res.status(404).json({ message: "Không tìm thấy sách" });
      return;
    }
    
    res.status(200).json({ message: "Xóa sách thành công" });
    return;
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Lỗi khi xóa sách" });
    return;
  }
};

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" });
      return
    }
    
    const searchResults = await bookService.searchBooks(
      q.toString(), 
      Number(limit)
    );
    
    res.status(200).json(searchResults);
    return;
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Lỗi khi tìm kiếm sách" });
    return;
  }
};