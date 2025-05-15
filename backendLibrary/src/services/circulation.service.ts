import Borrowing from "../models/borrowing.model";
import Reservation from "../models/reservation.model";
import Book from "../models/book.model";
import Member from "../models/member.model";
import Staff from "../models/staff.model";
import Fine from "../models/fine.model";
import {
  BorrowingCreateDTO,
  BorrowingReturnDTO,
  BorrowingRenewDTO,
  ReservationCreateDTO
} from "../types/circulation.types";
import { generateBorrowingId } from "../utils/idGenerator";

interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}


export const getBorrowings = async (
  filters: Record<string, any>,
  options: PaginationOptions
) => {
  try {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const sortOption: any = {};
    if (sort) {
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      sortOption[sortField] = sortOrder;
    } else {
      sortOption.borrowDate = -1; 
    }

    const borrowings = await Borrowing.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Borrowing.countDocuments(filters);

    return {
      borrowings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

export const getBorrowingById = async (id: string) => {
  try {
    const borrowing = await Borrowing.findById(id);
    return borrowing;
  } catch (error) {
    throw error;
  }
};

export const createBorrowing = async (
  borrowingData: BorrowingCreateDTO,
  staffId: string
) => {
  try {
    const member = await Member.findById(borrowingData.memberId);
    if (!member) {
      throw new Error("Không tìm thấy độc giả");
    }

    if (member.status !== 'Hoạt động') {
      throw new Error(`Độc giả hiện có trạng thái ${member.status}, không thể mượn sách`);
    }

    if (new Date(member.expiryDate) < new Date()) {
      throw new Error("Thẻ thư viện đã hết hạn");
    }

    if (member.fines.unpaidAmount > 0) {
      throw new Error(`Độc giả có ${member.fines.unpaidAmount} VND tiền phạt chưa thanh toán`);
    }

    if (member.currentBorrowings.length >= 5) {
      throw new Error("Độc giả đã mượn tối đa 5 cuốn sách");
    }

    const book = await Book.findById(borrowingData.bookId);
    if (!book) {
      throw new Error("Không tìm thấy sách");
    }

    const copy = book.copies.find(copy => copy.copyId === borrowingData.copyId);
    if (!copy) {
      throw new Error("Không tìm thấy bản sao sách");
    }

    if (copy.status !== 'Có sẵn') {
      throw new Error(`Bản sao sách hiện có trạng thái ${copy.status}, không thể mượn`);
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error("Không tìm thấy nhân viên");
    }

    const lastBorrowing = await Borrowing.findOne().sort({ borrowingId: -1 });
    const borrowingId = generateBorrowingId(lastBorrowing?.borrowingId);

    const borrowDate = borrowingData.borrowDate 
      ? new Date(borrowingData.borrowDate) 
      : new Date();
    
    let dueDate;
    if (borrowingData.dueDate) {
      dueDate = new Date(borrowingData.dueDate);
    } else {
      dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
    }

    const newBorrowing = await Borrowing.create({
      borrowingId,
      member: {
        _id: member._id,
        memberId: member.memberId,
        fullName: member.fullName
      },
      bookCopy: {
        bookId: book._id,
        copyId: copy.copyId,
        title: book.title
      },
      issuedBy: {
        _id: staff._id,
        staffId: staff.staffId,
        fullName: staff.fullName
      },
      borrowDate,
      dueDate,
      status: 'Đang mượn',
      renewalCount: 0,
      notes: borrowingData.notes || '',
      fine: {
        amount: 0,
        status: 'Không có'
      }
    });

    await Book.updateOne(
      { _id: book._id, "copies.copyId": copy.copyId },
      { $set: { "copies.$.status": 'Đang mượn' } }
    );

    await Member.findByIdAndUpdate(member._id, {
      $push: {
        currentBorrowings: {
          borrowingId: newBorrowing._id,
          bookCopyId: copy.copyId,
          bookTitle: book.title,
          dueDate
        }
      },
      $inc: { 'borrowingHistory.totalBorrowed': 1 },
      $set: { 'borrowingHistory.lastBorrowing': borrowDate }
    });

    await Reservation.updateMany(
      { 
        'member._id': member._id,
        'book._id': book._id,
        status: 'Đang chờ'
      },
      { $set: { status: 'Đã nhận' } }
    );

    return newBorrowing;
  } catch (error) {
    throw error;
  }
};

export const returnBorrowing = async (
  id: string,
  returnData: BorrowingReturnDTO,
  staffId: string
) => {
  try {
    const borrowing = await Borrowing.findById(id);
    if (!borrowing) {
      throw new Error("Không tìm thấy phiếu mượn");
    }

    if (borrowing.status === 'Đã trả') {
      throw new Error("Sách đã được trả");
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error("Không tìm thấy nhân viên");
    }

    const returnDate = returnData.returnDate 
      ? new Date(returnData.returnDate) 
      : new Date();
    
    let fineAmount = 0;
    let fineReason = '';
    let fineStatus = 'Không có';
    
    const dueDate = new Date(borrowing.dueDate);
    if (returnDate > dueDate) {
      const daysLate = Math.ceil(
        (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      fineAmount = daysLate * 5000;
      fineReason = `Trả sách trễ ${daysLate} ngày`;
      fineStatus = 'Chưa thanh toán';
      
      await Member.findByIdAndUpdate(borrowing.member._id, {
        $inc: { 'borrowingHistory.totalOverdue': 1 }
      });
    }

    if (returnData.fine && returnData.fine.amount > 0) {
      fineAmount += returnData.fine.amount;
      fineReason += fineReason 
        ? `. ${returnData.fine.reason || 'Hư hỏng sách'}`
        : returnData.fine.reason || 'Hư hỏng sách';
      fineStatus = 'Chưa thanh toán';
    }

    const updatedBorrowing = await Borrowing.findByIdAndUpdate(id, {
      $set: {
        returnDate,
        returnedTo: {
          _id: staff._id,
          staffId: staff.staffId,
          fullName: staff.fullName
        },
        status: 'Đã trả',
        notes: returnData.notes 
          ? `${borrowing.notes || ''} [Ghi chú khi trả: ${returnData.notes}]` 
          : borrowing.notes,
        fine: {
          amount: fineAmount,
          reason: fineReason || undefined,
          status: fineStatus
        }
      }
    }, { new: true });

    if (fineAmount > 0) {
      await Fine.create({
        member: {
          _id: borrowing.member._id,
          memberId: borrowing.member.memberId,
          fullName: borrowing.member.fullName
        },
        borrowing: borrowing._id,
        book: {
          _id: borrowing.bookCopy.bookId,
          title: borrowing.bookCopy.title,
          copyId: borrowing.bookCopy.copyId
        },
        amount: fineAmount,
        reason: fineReason,
        issueDate: returnDate,
        status: 'Chưa thanh toán'
      });

      await Member.findByIdAndUpdate(borrowing.member._id, {
        $inc: {
          'fines.totalAmount': fineAmount,
          'fines.unpaidAmount': fineAmount
        }
      });
    }

    let newCopyStatus = 'Có sẵn';
    if (returnData.condition && ['Hư hỏng', 'Mất'].includes(returnData.condition)) {
      newCopyStatus = returnData.condition === 'Mất' ? 'Mất' : 'Bảo trì';
    }

    await Book.updateOne(
      { 
        _id: borrowing.bookCopy.bookId, 
        "copies.copyId": borrowing.bookCopy.copyId 
      },
      { 
        $set: { 
          "copies.$.status": newCopyStatus,
          "copies.$.condition": returnData.condition || "Tốt"
        } 
      }
    );

    await Member.findByIdAndUpdate(borrowing.member._id, {
      $pull: {
        currentBorrowings: {
          borrowingId: borrowing._id
        }
      }
    });

    return updatedBorrowing;
  } catch (error) {
    throw error;
  }
};

export const renewBorrowing = async (
  id: string,
  renewData: BorrowingRenewDTO
) => {
  try {
    const borrowing = await Borrowing.findById(id);
    if (!borrowing) {
      throw new Error("Không tìm thấy phiếu mượn");
    }

    if (borrowing.status === 'Đã trả') {
      throw new Error("Sách đã được trả, không thể gia hạn");
    }

    if (borrowing.renewalCount >= 2) {
      throw new Error("Đã vượt quá số lần gia hạn tối đa (2 lần)");
    }

    const hasReservation = await Reservation.exists({
      'book._id': borrowing.bookCopy.bookId,
      status: 'Đang chờ'
    });

    if (hasReservation) {
      throw new Error("Sách đã có người đặt trước, không thể gia hạn");
    }

    let newDueDate;
    
    if (renewData.newDueDate) {
      newDueDate = new Date(renewData.newDueDate);
    } else {
      newDueDate = new Date(borrowing.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 14);
    }

    const updatedBorrowing = await Borrowing.findByIdAndUpdate(id, {
      $set: {
        dueDate: newDueDate,
        notes: renewData.notes 
          ? `${borrowing.notes || ''} [Ghi chú gia hạn: ${renewData.notes}]` 
          : borrowing.notes
      },
      $inc: { renewalCount: 1 }
    }, { new: true });

    await Member.updateOne(
      { 
        _id: borrowing.member._id,
        "currentBorrowings.borrowingId": borrowing._id
      },
      { $set: { "currentBorrowings.$.dueDate": newDueDate } }
    );

    return updatedBorrowing;
  } catch (error) {
    throw error;
  }
};


export const getReservations = async (
  filters: Record<string, any>,
  options: PaginationOptions
) => {
  try {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const sortOption: any = {};
    if (sort) {
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      sortOption[sortField] = sortOrder;
    } else {
      sortOption.reservationDate = -1; 
    }

    const reservations = await Reservation.find(filters)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(filters);

    return {
      reservations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

export const getReservationById = async (id: string) => {
  try {
    const reservation = await Reservation.findById(id);
    return reservation;
  } catch (error) {
    throw error;
  }
};

export const createReservation = async (
  reservationData: ReservationCreateDTO
) => {
  try {
    const member = await Member.findById(reservationData.memberId);
    if (!member) {
      throw new Error("Không tìm thấy độc giả");
    }

    if (member.status !== 'Hoạt động') {
      throw new Error(`Độc giả hiện có trạng thái ${member.status}, không thể đặt trước sách`);
    }

    if (new Date(member.expiryDate) < new Date()) {
      throw new Error("Thẻ thư viện đã hết hạn");
    }

    const book = await Book.findById(reservationData.bookId);
    if (!book) {
      throw new Error("Không tìm thấy sách");
    }

    if (!book.copies || book.copies.length === 0) {
      throw new Error("Sách không có bản sao nào");
    }

    const existingReservation = await Reservation.findOne({
      'member._id': member._id,
      'book._id': book._id,
      status: { $in: ['Đang chờ', 'Đã nhận'] }
    });

    if (existingReservation) {
      throw new Error("Độc giả đã đặt trước sách này");
    }

    const isBorrowing = member.currentBorrowings.some(
      item => item.bookTitle === book.title
    );

    if (isBorrowing) {
      throw new Error("Độc giả đang mượn sách này, không cần đặt trước");
    }

    const availableCopies = book.copies.filter(copy => copy.status === 'Có sẵn');
    
    if (availableCopies.length > 0) {
      throw new Error("Sách đang có sẵn, không cần đặt trước");
    }

    const reservationDate = new Date();
    const expiryDate = new Date(reservationDate);
    expiryDate.setDate(expiryDate.getDate() + 7); 
    
    const newReservation = await Reservation.create({
      member: {
        _id: member._id,
        memberId: member.memberId,
        fullName: member.fullName
      },
      book: {
        _id: book._id,
        title: book.title
      },
      reservationDate,
      expiryDate,
      status: 'Đang chờ',
      notificationSent: false,
      notes: reservationData.notes || ''
    });

    return newReservation;
  } catch (error) {
    throw error;
  }
};

export const updateReservationStatus = async (
  id: string,
  status: 'Đang chờ' | 'Đã nhận' | 'Đã hủy' | 'Hết hạn',
  notes?: string
) => {
  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      throw new Error("Không tìm thấy đơn đặt trước");
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(id, {
      $set: {
        status,
        notes: notes 
          ? `${reservation.notes || ''} [Ghi chú cập nhật: ${notes}]` 
          : reservation.notes
      }
    }, { new: true });

    return updatedReservation;
  } catch (error) {
    throw error;
  }
};

export const sendReservationNotification = async (id: string) => {
  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      throw new Error("Không tìm thấy đơn đặt trước");
    }

    if (reservation.status !== 'Đang chờ') {
      throw new Error(`Đơn đặt trước có trạng thái ${reservation.status}, không thể gửi thông báo`);
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(id, {
      $set: {
        notificationSent: true,
        notificationDate: new Date()
      }
    }, { new: true });

    return updatedReservation;
  } catch (error) {
    throw error;
  }
};