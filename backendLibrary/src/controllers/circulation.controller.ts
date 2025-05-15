import { Request, Response } from "express";
import * as circulationService from "../services/circulation.service";

export const getBorrowings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      memberId, 
      bookId,
      status,
      fromDate,
      toDate,
      sort = "borrowDate"
    } = req.query;

    const filters: Record<string, any> = {};

    if (memberId) filters['member.memberId'] = memberId;
    if (bookId) filters['bookCopy.bookId'] = bookId;
    if (status) filters.status = status;

    if (fromDate || toDate) {
      filters.borrowDate = {};
      if (fromDate) filters.borrowDate.$gte = new Date(fromDate.toString());
      if (toDate) filters.borrowDate.$lte = new Date(toDate.toString());
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: sort?.toString()
    };

    const result = await circulationService.getBorrowings(filters, options);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching borrowings:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu mượn" });
  }
};

export const getBorrowingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const borrowing = await circulationService.getBorrowingById(id);
    
    if (!borrowing) {
      res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
      return;
    }

    res.status(200).json(borrowing);
  } catch (error) {
    console.error("Error fetching borrowing:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin phiếu mượn" });
  }
};

export const createBorrowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const borrowingData = req.body;
    
    if (!borrowingData.memberId) {
      res.status(400).json({ message: "Thiếu thông tin độc giả" });
      return;
    }

    if (!borrowingData.bookId || !borrowingData.copyId) {
      res.status(400).json({ message: "Thiếu thông tin sách/bản sao" });
      return;
    }
    
    const staffId = req.userId;
    if (!staffId) {
      res.status(401).json({ message: "Không thể xác định nhân viên" });
      return;
    }

    const newBorrowing = await circulationService.createBorrowing(borrowingData, staffId);
    res.status(201).json(newBorrowing);
  } catch (error) {
    console.error("Error creating borrowing:", error);
    
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi tạo phiếu mượn" });
  }
};

export const returnBorrowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const returnData = req.body;
    
    const staffId = req.userId;
    if (!staffId) {
      res.status(401).json({ message: "Không thể xác định nhân viên" });
      return;
    }
    
    const updatedBorrowing = await circulationService.returnBorrowing(id, returnData, staffId);
    res.status(200).json(updatedBorrowing);
  } catch (error) {
    console.error("Error returning book:", error);
    
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi trả sách" });
  }
};

export const renewBorrowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const renewData = req.body;
    
    const updatedBorrowing = await circulationService.renewBorrowing(id, renewData);
    res.status(200).json(updatedBorrowing);
  } catch (error) {
    console.error("Error renewing borrowing:", error);
    
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi gia hạn mượn sách" });
  }
};

export const getReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      memberId, 
      bookId,
      status,
      notificationSent,
      sort = "reservationDate"
    } = req.query;

    const filters: Record<string, any> = {};

    if (memberId) filters['member.memberId'] = memberId;
    if (bookId) filters['book._id'] = bookId;
    if (status) filters.status = status;
    if (notificationSent !== undefined) filters.notificationSent = notificationSent === 'true';

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: sort?.toString()
    };

    const result = await circulationService.getReservations(filters, options);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đặt trước" });
  }
};

export const getReservationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await circulationService.getReservationById(id);
    
    if (!reservation) {
      res.status(404).json({ message: "Không tìm thấy đơn đặt trước" });
      return;
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin đặt trước" });
  }
};

export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const reservationData = req.body;
    
    if (!reservationData.memberId) {
      res.status(400).json({ message: "Thiếu thông tin độc giả" });
      return;
    }

    if (!reservationData.bookId) {
      res.status(400).json({ message: "Thiếu thông tin sách" });
      return;
    }

    const newReservation = await circulationService.createReservation(reservationData);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi đặt trước sách" });
  }
};

export const updateReservationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      res.status(400).json({ message: "Thiếu thông tin trạng thái" });
      return;
    }
    
    const validStatuses = ['Đang chờ', 'Đã nhận', 'Đã hủy', 'Hết hạn'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ 
        message: `Trạng thái không hợp lệ. Chọn một trong các giá trị: ${validStatuses.join(', ')}` 
      });
      return;
    }
    
    const updatedReservation = await circulationService.updateReservationStatus(id, status, notes);
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation status:", error);
    
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đặt trước" });
  }
};

export const sendReservationNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedReservation = await circulationService.sendReservationNotification(id);
    res.status(200).json({
      success: true,
      message: "Đã gửi thông báo thành công",
      reservation: updatedReservation
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    
    res.status(500).json({ message: "Lỗi khi gửi thông báo" });
  }
};