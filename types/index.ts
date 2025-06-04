// // types/index.ts
// export interface Location {
//   $id: string;
//   name: string;
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isActive: boolean;
//   $createdAt?: string;
//   $updatedAt?: string;
// }

// export interface Shop {
//   $id: string;
//   name: string;
//   ownerName: string;
//   phone: string;
//   email?: string;
//   address: string;
//   locationId: string;
//   shopId?: string; // Admin assigned ID
//   status: 'pending' | 'approved' | 'rejected';
//   isActive: boolean;
//   createdAt: string;
//   $createdAt?: string;
//   $updatedAt?: string;
// }

// export interface Category {
//   $id: string;
//   name: string;
//   description?: string;
//   image?: string;
//   order: number;
//   isActive: boolean;
//   $createdAt?: string;
//   $updatedAt?: string;
// }

// export interface Product {
//   $id: string;
//   name: string;
//   description?: string;
//   categoryId: string;
//   categoryName: string;
//   price: number;
//   unit: string;
//   image?: string;
//   sku?: string;
//   variant?: string;
//   priceGroupId?: string;
//   locationId: string;
//   stock?: number;
//   isActive: boolean;
//   $createdAt?: string;
//   $updatedAt?: string;
// }

// export interface ProductGroup {
//   id: string;
//   priceGroupId?: string;
//   name: string;
//   description?: string;
//   price: number;
//   categoryId: string;
//   categoryName: string;
//   image?: string;
//   unit: string;
//   variants: ProductVariant[];
// }

// export interface ProductVariant {
//   productId: string;
//   variant: string;
//   sku?: string;
//   stock?: number;
// }

// export interface CartItem extends ProductGroup {
//   quantity: number;
//   selectedVariant?: ProductVariant;
// }

// export interface Order {
//   $id: string;
//   orderNumber: string;
//   shopId: string;
//   shopName: string;
//   shopPhone: string;
//   shopAddress?: string;
//   customerName: string;
//   customerPhone: string;
//   customerAddress: string;
//   locationId: string;
//   totalAmount: number;
//   itemCount: number;
//   status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
//   paymentMethod: 'cod';
//   createdAt: string;
//   $createdAt?: string;
//   $updatedAt?: string;
// }

// export interface OrderItem {
//   $id: string;
//   orderId: string;
//   productId: string;
//   productName: string;
//   variant?: string;
//   priceGroupId?: string;
//   quantity: number;
//   price: number;
//   unit: string;
//   subtotal: number;
//   $createdAt?: string;
//   $updatedAt?: string;
// }

// export interface CustomerInfo {
//   name: string;
//   phone: string;
//   address: string;
// }






// types/index.ts
export interface Location {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

export interface Shop {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  shopId?: string; // Add this in case it's required
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

export interface Category {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface Product {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  locationId: string;
  priceGroupId?: string;
  price: number;
  unit: string;
  image?: string;
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

export interface Order {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
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

export interface OrderItem {
  $id: string;
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