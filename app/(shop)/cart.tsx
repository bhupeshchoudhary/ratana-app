// app/(shop)/cart.tsx
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/common/EmptyState';
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import type { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CartScreen() {
  const { cart, getCartTotal } = useApp();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    router.push('/(shop)/checkout');
  };

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartItem item={item} />
  );

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          message="Add items to your cart to see them here"
          actionLabel="Start Shopping"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => `${item.id}-${item.selectedVariant?.productId || ''}`}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<CartSummary />}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{formatCurrency(getCartTotal())}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cartList: {
    padding: 15,
    paddingBottom: 150,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    color: UI_CONFIG.primaryColor,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});