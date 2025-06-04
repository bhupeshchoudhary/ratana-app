// components/cart/CartSummary.tsx
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface CartSummaryProps {
  showItems?: boolean;
}

export default function CartSummary({ showItems = false }: CartSummaryProps) {
  const { cart, getCartTotal, getCartItemCount } = useApp();

  const subtotal = getCartTotal();
  const deliveryCharges = 0; // Free delivery
  const total = subtotal + deliveryCharges;

  if (showItems) {
    return (
      <View style={styles.container}>
        {cart.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name} {item.selectedVariant && `(${item.selectedVariant.variant})`}
            </Text>
            <Text style={styles.itemPrice}>
              {item.quantity} × {formatCurrency(item.price)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Delivery Charges</Text>
          <Text style={styles.freeText}>FREE</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <Text style={styles.label}>Items ({getCartItemCount()})</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.label}>Delivery Charges</Text>
        <Text style={styles.freeText}>FREE</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  freeText: {
    fontSize: 14,
    color: UI_CONFIG.successColor,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.primaryColor,
  },
});