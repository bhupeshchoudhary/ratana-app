// utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatPhone = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatOrderNumber = (orderNumber: string): string => {
  // Format as ORD-XXXXXX-XXXX
  if (orderNumber.length >= 10) {
    return `${orderNumber.slice(0, 3)}-${orderNumber.slice(3, 9)}-${orderNumber.slice(9)}`;
  }
  return orderNumber;
};

export const formatAddress = (address: string, maxLength: number = 50): string => {
  if (address.length <= maxLength) {
    return address;
  }
  return `${address.slice(0, maxLength)}...`;
};