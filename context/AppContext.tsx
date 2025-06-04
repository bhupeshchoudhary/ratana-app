// context/AppContext.tsx
import storageService from '@/services/storage.service';
import type { CartItem, Location, Shop } from '@/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AppContextType {
  // State
  location: Location | null;
  shop: Shop | null;
  cart: CartItem[];
  loading: boolean;
  
  // Methods
  setLocation: (location: Location) => Promise<void>;
  setShop: (shop: Shop) => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateCartQuantity: (productId: string, priceGroupId: string | undefined, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, priceGroupId: string | undefined) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [shop, setShopState] = useState<Shop | null>(null);
  const [cart, setCartState] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedLocation, storedShop, storedCart] = await Promise.all([
        storageService.getLocation(),
        storageService.getShop(),
        storageService.getCart(),
      ]);

      if (storedLocation) setLocationState(storedLocation);
      if (storedShop) setShopState(storedShop);
      setCartState(storedCart);
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setLocation = async (locationData: Location) => {
    const saved = await storageService.saveLocation(locationData);
    if (saved) {
      setLocationState(locationData);
    }
  };

  const setShop = async (shopData: Shop) => {
    const saved = await storageService.saveShop(shopData);
    if (saved) {
      setShopState(shopData);
    }
  };

  const addToCart = async (item: CartItem) => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(
      cartItem => 
        cartItem.id === item.id && 
        cartItem.selectedVariant?.productId === item.selectedVariant?.productId
    );

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ ...item, quantity: item.quantity || 1 });
    }

    const saved = await storageService.saveCart(updatedCart);
    if (saved) {
      setCartState(updatedCart);
    }
  };

  const updateCartQuantity = async (
    productId: string, 
    priceGroupId: string | undefined, 
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId, priceGroupId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId && item.priceGroupId === priceGroupId
        ? { ...item, quantity }
        : item
    );

    const saved = await storageService.saveCart(updatedCart);
    if (saved) {
      setCartState(updatedCart);
    }
  };

  const removeFromCart = async (
    productId: string, 
    priceGroupId: string | undefined
  ) => {
    const updatedCart = cart.filter(
      item => !(item.id === productId && item.priceGroupId === priceGroupId)
    );

    const saved = await storageService.saveCart(updatedCart);
    if (saved) {
      setCartState(updatedCart);
    }
  };

  const clearCart = async () => {
    const cleared = await storageService.clearCart();
    if (cleared) {
      setCartState([]);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const logout = async () => {
    await storageService.clearAll();
    setLocationState(null);
    setShopState(null);
    setCartState([]);
  };

  const value: AppContextType = {
    location,
    shop,
    cart,
    loading,
    setLocation,
    setShop,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}