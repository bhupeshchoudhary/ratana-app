// components/product/ProductList.tsx
import { UI_CONFIG } from '@/constants/Config';
import type { ProductGroup } from '@/types';
import React from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import EmptyState from '../common/EmptyState';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: ProductGroup[];
  refreshing?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
}

export default function ProductList({
  products,
  refreshing = false,
  onRefresh,
  emptyMessage = 'No products available',
}: ProductListProps) {
  const renderProduct = ({ item }: { item: ProductGroup }) => (
    <ProductCard product={item} />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[UI_CONFIG.primaryColor]}
          />
        ) : undefined
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="basket-outline"
            title="No Products"
            message={emptyMessage}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 400,
  },
});