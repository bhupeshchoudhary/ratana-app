// constants/Config.ts
export const APP_CONFIG = {
  appName: 'Ratana',
  appTagline: 'Retailer Order App',
  version: '1.0.0',
  
  // Appwrite Configuration
  appwrite: {
    endpoint: 'https://fra.cloud.appwrite.io/v1',
    projectId: '68400026002613be243c',
    databaseId: '68400f8d000c22990f5e', // Your database ID from screenshot
  },
  
  // Collection IDs from your screenshot
  collections: {
    locations: '6840100c003b18eaf19b', // CREATE THIS COLLECTION
    shops: '684011a9002504cfda2a',
    categories: '68401700002c2936439a',
    products: '6840180f00219a309b6b',
    priceGroups: '6840199b0030168bf83b',
    orders: '68401a7b00271d097684',
    orderItems: '68401bfb0037842cb748',
  },
};

export const STORAGE_KEYS = {
  USER_LOCATION: '@ratana:userLocation',
  SHOP_DATA: '@ratana:shopData',
  CART: '@ratana:cart',
  USER_PREFS: '@ratana:userPrefs',
};

export const UI_CONFIG = {
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  successColor: '#10b981',
  dangerColor: '#ef4444',
  warningColor: '#f59e0b',
  infoColor: '#3b82f6',
  lightColor: '#f3f4f6',
  darkColor: '#1f2937',
};