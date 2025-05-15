export interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  totalBorrowings: number;
  activeReservations: number;
  overdueItems: number;
  availableBooks: number;
  popularBooks: {
    _id: string;
    title: string;
    author: string;
    borrowCount: number;
    coverImage?: string;
  }[];
}

export interface RecentActivity {
  _id: string;
  type: 'borrow' | 'return' | 'reservation' | 'new_member' | 'new_book';
  timestamp: Date;
  details: {
    title?: string;
    memberId?: string;
    memberName?: string;
    bookId?: string;
    bookTitle?: string;
    staffName?: string;
  };
}

export interface MonthlyCheckout {
  month: string;
  year: number;
  checkouts: number;
  returns: number;
}

export interface PopularGenre {
  _id: string;
  name: string;
  count: number;
  percentage: number;
}