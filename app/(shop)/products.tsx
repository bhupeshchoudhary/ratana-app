// app/(shop)/products.tsx
import CartBadge from '@/components/cart/CartBadge';
import EmptyState from '@/components/common/EmptyState';
import CategoryFilter from '@/components/product/CategoryFilter';
import ProductCard from '@/components/product/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import appwriteService from '@/services/appwrite.service';
import type { Category, ProductGroup } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProductsScreen() {
  const { location, shop, cart, getCartItemCount } = useApp();
  const [products, setProducts] = useState<ProductGroup[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const loadInitialData = async () => {
    if (!location) return;
    
    try {
      const [categoriesData, productsData] = await Promise.all([
        appwriteService.getCategories(),
        appwriteService.getProducts(location.$id),
      ]);
      
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!location) return;
    
    setRefreshing(true);
    try {
      const productsData = await appwriteService.getProducts(
        location.$id,
        selectedCategory || undefined
      );
      setProducts(productsData);
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategorySelect = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (location) {
      setLoading(true);
      try {
        const productsData = await appwriteService.getProducts(
          location.$id,
          categoryId || undefined
        );
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderProduct = ({ item }: { item: ProductGroup }) => (
    <ProductCard product={item} />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => router.push('/(shop)/profile')}
                style={styles.headerButton}
              >
                <Ionicons name="person-circle-outline" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/(shop)/cart')}
                style={styles.headerButton}
              >
                <CartBadge count={getCartItemCount()} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <View style={styles.container}>
        {shop?.status === 'pending' && (
          <View style={styles.pendingBanner}>
            <Ionicons name="time-outline" size={20} color="#856404" />
            <Text style={styles.pendingText}>
              Your shop is pending approval
            </Text>
          </View>
        )}

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
        />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={UI_CONFIG.primaryColor} />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.productList}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[UI_CONFIG.primaryColor]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="basket-outline"
                title="No products found"
                message={
                  searchQuery
                    ? "Try adjusting your search"
                    : selectedCategory
                    ? "No products in this category"
                    : "No products available at your location"
                }
              />
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 15,
  },
  pendingBanner: {
    backgroundColor: '#fff3cd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffeeba',
  },
  pendingText: {
    color: '#856404',
    fontSize: 14,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 10,
    paddingBottom: 20,
  },
});