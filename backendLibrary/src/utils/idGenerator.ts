export const generateMemberId = (lastMemberId?: string): string => {
  try {
    if (!lastMemberId) {
      return 'DG0001';
    }

    const prefix = 'DG';
    const lastNumber = parseInt(lastMemberId.replace(prefix, ''), 10);
    
    const newNumber = lastNumber + 1;
    const paddedNumber = newNumber.toString().padStart(4, '0');
    
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating member ID:', error);
    return 'DG0001';
  }
};


export const generateStaffId = (lastStaffId?: string): string => {
  try {
    if (!lastStaffId) {
      return 'NV0001';
    }

    const prefix = 'NV';
    const lastNumber = parseInt(lastStaffId.replace(prefix, ''), 10);
    
    const newNumber = lastNumber + 1;
    const paddedNumber = newNumber.toString().padStart(4, '0');
    
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating staff ID:', error);
    return 'NV0001';
  }
};


export const generateBorrowingId = (lastBorrowingId?: string): string => {
  try {
    if (!lastBorrowingId) {
      return 'MT000001';
    }

    const prefix = 'MT';
    const lastNumber = parseInt(lastBorrowingId.replace(prefix, ''), 10);
    
    const newNumber = lastNumber + 1;
    const paddedNumber = newNumber.toString().padStart(6, '0');
    
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating borrowing ID:', error);
    return 'MT000001';
  }
};