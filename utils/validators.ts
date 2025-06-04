// utils/validators.ts
export const validators = {
  phone: (phone: string): boolean => {
    // Indian phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(cleaned);
  },

  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  shopName: (name: string): boolean => {
    return name.trim().length >= 3 && name.trim().length <= 100;
  },

  address: (address: string): boolean => {
    return address.trim().length >= 10 && address.trim().length <= 200;
  },

  pincode: (pincode: string): boolean => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  },
};

export const getErrorMessage = (field: string, value: string): string => {
  switch (field) {
    case 'phone':
      if (!value) return 'Phone number is required';
      if (!validators.phone(value)) return 'Please enter a valid 10-digit phone number';
      break;
    case 'email':
      if (value && !validators.email(value)) return 'Please enter a valid email address';
      break;
    case 'name':
      if (!value) return 'Name is required';
      if (!validators.name(value)) return 'Name must be between 2-50 characters';
      break;
    case 'shopName':
      if (!value) return 'Shop name is required';
      if (!validators.shopName(value)) return 'Shop name must be between 3-100 characters';
      break;
    case 'address':
      if (!value) return 'Address is required';
      if (!validators.address(value)) return 'Address must be between 10-200 characters';
      break;
    case 'pincode':
      if (!value) return 'Pincode is required';
      if (!validators.pincode(value)) return 'Please enter a valid 6-digit pincode';
      break;
  }
  return '';
};