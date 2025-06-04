// services/appwrite.service.ts
import { APP_CONFIG } from '@/constants/Config';
import type {
    CartItem,
    Category,
    Location,
    Order,
    Product,
    ProductGroup,
    Shop
} from '@/types';
import { Client, Databases, ID, Query } from 'appwrite';

class AppwriteService {
  private client: Client;
  private databases: Databases;
  private databaseId: string;

  constructor() {
    this.client = new Client()
      .setEndpoint(APP_CONFIG.appwrite.endpoint)
      .setProject(APP_CONFIG.appwrite.projectId);
    
    this.databases = new Databases(this.client);
    this.databaseId = APP_CONFIG.appwrite.databaseId;
  }

  // Location Methods
  async getLocations(): Promise<Location[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        APP_CONFIG.collections.locations,
        [
          Query.equal('isActive', true),
          Query.orderAsc('name')
        ]
      );
      return response.documents as Location[];
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  // Shop Methods
  async createShop(shopData: Omit<Shop, '$id' | 'createdAt' | '$createdAt' | '$updatedAt'>): Promise<Shop> {
    try {
      const shopId = ID.unique();
      const document = await this.databases.createDocument(
        this.databaseId,
        APP_CONFIG.collections.shops,
        shopId,
        {
          ...shopData,
          shopId: shopId, // Include shopId if it's a required attribute
          createdAt: new Date().toISOString(),
        }
      );
      return document as Shop;
    } catch (error) {
      console.error('Error creating shop:', error);
      console.error('Database ID:', this.databaseId);
      console.error('Collection ID:', APP_CONFIG.collections.shops);
      console.error('Shop Data:', shopData);
      throw error;
    }
  }

  async getShopByPhone(phone: string): Promise<Shop | null> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        APP_CONFIG.collections.shops,
        [Query.equal('phone', phone)]
      );
      return response.documents[0] as Shop || null;
    } catch (error) {
      console.error('Error fetching shop:', error);
      console.error('Database ID:', this.databaseId);
      console.error('Collection ID:', APP_CONFIG.collections.shops);
      throw error;
    }
  }

  // Category Methods
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        APP_CONFIG.collections.categories,
        [
          Query.equal('isActive', true),
          Query.orderAsc('order'),
          Query.orderAsc('name')
        ]
      );
      return response.documents as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Product Methods
  async getProducts(locationId: string, categoryId?: string): Promise<ProductGroup[]> {
    try {
      const queries = [
        Query.equal('locationId', locationId),
        Query.equal('isActive', true),
        Query.orderAsc('name')
      ];

      if (categoryId) {
        queries.push(Query.equal('categoryId', categoryId));
      }

      const response = await this.databases.listDocuments(
        this.databaseId,
        APP_CONFIG.collections.products,
        queries
      );

      return this.groupProductsByPriceGroup(response.documents as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  private groupProductsByPriceGroup(products: Product[]): ProductGroup[] {
    const grouped = new Map<string, ProductGroup>();
    
    products.forEach(product => {
      const groupId = product.priceGroupId || product.$id;
      
      if (!grouped.has(groupId)) {
        grouped.set(groupId, {
          id: groupId,
          priceGroupId: product.priceGroupId,
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          image: product.image,
          unit: product.unit,
          variants: []
        });
      }
      
      grouped.get(groupId)!.variants.push({
        productId: product.$id,
        variant: product.variant || 'Standard',
        sku: product.sku,
        stock: product.stock
      });
    });

    return Array.from(grouped.values());
  }

  // Order Methods
  async createOrder(orderData: {
    shop: Shop;
    customer: {
      name: string;
      phone: string;
      address: string;
    };
    locationId: string;
    items: CartItem[];
    totalAmount: number;
  }): Promise<Order> {
    try {
      const order = await this.databases.createDocument(
        this.databaseId,
        APP_CONFIG.collections.orders,
        ID.unique(),
        {
          shopId: orderData.shop.$id,
          shopName: orderData.shop.name,
          shopPhone: orderData.shop.phone,
          shopAddress: orderData.shop.address,
          customerName: orderData.customer.name,
          customerPhone: orderData.customer.phone,
          customerAddress: orderData.customer.address,
          locationId: orderData.locationId,
          totalAmount: orderData.totalAmount,
          itemCount: orderData.items.length,
          status: 'pending',
          paymentMethod: 'cod',
          orderNumber: this.generateOrderNumber(),
          createdAt: new Date().toISOString(),
        }
      );

      // Create order items
      const itemPromises = orderData.items.map(item =>
        this.databases.createDocument(
          this.databaseId,
          APP_CONFIG.collections.order_items, // Note: using underscore
          ID.unique(),
          {
            orderId: order.$id,
            productId: item.selectedVariant?.productId || item.id,
            productName: item.name,
            variant: item.selectedVariant?.variant || 'Standard',
            priceGroupId: item.priceGroupId || null,
            quantity: item.quantity,
            price: item.price,
            unit: item.unit,
            subtotal: item.quantity * item.price,
          }
        )
      );

      await Promise.all(itemPromises);
      return order as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${random}`;
  }

  // Debug method - remove after testing
  async debugCollections() {
    console.log('=== DEBUG: Collection IDs ===');
    console.log('Database ID:', this.databaseId);
    Object.entries(APP_CONFIG.collections).forEach(([name, id]) => {
      console.log(`${name}: ${id}`);
    });
    console.log('=========================');
  }
}

export default new AppwriteService();