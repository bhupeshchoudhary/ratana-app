// services/storage.service.ts
import { STORAGE_KEYS } from '@/constants/Config';
import type { CartItem, Location, Shop } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Location Storage
  async saveLocation(location: Location): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_LOCATION, 
        JSON.stringify(location)
      );
      return true;
    } catch (error) {
      console.error('Error saving location:', error);
      return false;
    }
  }

  async getLocation(): Promise<Location | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  // Shop Storage
  async saveShop(shop: Shop): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SHOP_DATA, 
        JSON.stringify(shop)
      );
      return true;
    } catch (error) {
      console.error('Error saving shop:', error);
      return false;
    }
  }

  async getShop(): Promise<Shop | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOP_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting shop:', error);
      return null;
    }
  }

  // Cart Storage
  async saveCart(cart: CartItem[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CART, 
        JSON.stringify(cart)
      );
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      return false;
    }
  }

  async getCart(): Promise<CartItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  // Clear Storage
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_LOCATION,
        STORAGE_KEYS.SHOP_DATA,
        STORAGE_KEYS.CART,
        STORAGE_KEYS.USER_PREFS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  async clearCart(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CART);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }
}

export default new StorageService();