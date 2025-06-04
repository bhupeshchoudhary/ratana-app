// src/types/index.ts
import { Models } from 'appwrite';

export interface Location extends Models.Document {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface Shop extends Models.Document {
  shopId?: string;
  name: string;
  ownerName: string;
  phone: string;
  email?: string;
  address: string;
  locationId: string;
  status: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  createdAt?: string;
}

export interface Category extends Models.Document {
  name: string;
  description?: string;
  image?: string;
  imageId?: string; // Added for Appwrite storage file ID
  order: number;
  isActive: boolean;
}

export interface Product extends Models.Document {
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  locationId: string;
  priceGroupId?: string;
  price: number;
  unit: string;
  image: string; // Made required as per your database schema
  imageId?: string; // Added for Appwrite storage file ID
  variant?: string;
  sku?: string;
  stock: number;
  isActive: boolean;
}

export interface ProductGroup {
  id: string;
  priceGroupId?: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  categoryName: string;
  image?: string;
  imageId?: string; // Added for Appwrite storage file ID
  unit: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  productId: string;
  variant: string;
  sku?: string;
  stock: number;
}

export interface CartItem extends ProductGroup {
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Order extends Models.Document {
  orderNumber: string;
  shopId: string;
  shopName: string;
  shopPhone: string;
  shopAddress: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  locationId: string;
  totalAmount: number;
  itemCount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'cod' | 'online';
  createdAt: string;
}

export interface OrderItem extends Models.Document {
  orderId: string;
  productId: string;
  productName: string;
  variant: string;
  priceGroupId?: string;
  quantity: number;
  price: number;
  unit: string;
  subtotal: number;
}

export interface Admin extends Models.Document {
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

// Additional types for form data
export interface ProductFormData {
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  locationId: string;
  priceGroupId?: string;
  price: number;
  unit: string;
  image: string;
  imageId?: string;
  variant?: string;
  sku?: string;
  stock: number;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: string;
  imageId?: string;
  order: number;
  isActive: boolean;
}

// User type for authentication
export interface User extends Models.Document {
  email: string;
  name: string;
  labels?: string[];
  prefs?: Record<string, any>;
}