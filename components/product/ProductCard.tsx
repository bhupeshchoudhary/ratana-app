// components/product/ProductCard.tsx
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import type { ProductGroup, ProductVariant } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProductCardProps {
  product: ProductGroup;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );

  const handleAddToCart = async () => {
    await addToCart({
      ...product,
      quantity: 1,
      selectedVariant,
    });
    Alert.alert('Success', 'Item added to cart');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          
          {product.description && (
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <Text style={styles.unit}>/{product.unit}</Text>
          </View>
          
          {product.variants.length > 1 && (
            <View style={styles.variantContainer}>
              <Text style={styles.variantLabel}>Variants:</Text>
              <View style={styles.variantList}>
                {product.variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.productId}
                    style={[
                      styles.variantChip,
                      selectedVariant?.productId === variant.productId && styles.variantChipSelected,
                    ]}
                    onPress={() => setSelectedVariant(variant)}
                  >
                    <Text
                      style={[
                        styles.variantText,
                        selectedVariant?.productId === variant.productId && styles.variantTextSelected,
                      ]}
                    >
                      {variant.variant}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.primaryColor,
  },
  unit: {
    fontSize: 14,
    color: '#666',
  },
  variantContainer: {
    marginBottom: 8,
  },
  variantLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  variantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  variantChipSelected: {
    backgroundColor: UI_CONFIG.primaryColor,
  },
  variantText: {
    fontSize: 11,
    color: '#666',
  },
  variantTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: UI_CONFIG.primaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});