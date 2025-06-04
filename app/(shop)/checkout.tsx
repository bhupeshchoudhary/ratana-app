// app/(shop)/checkout.tsx
import CartSummary from '@/components/cart/CartSummary';
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import appwriteService from '@/services/appwrite.service';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/validators';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CustomerForm {
  name: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutScreen() {
  const { location, shop, cart, getCartTotal, clearCart } = useApp();
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateField = (field: keyof CustomerForm, value: string) => {
    const error = getErrorMessage(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleFieldChange = (field: keyof CustomerForm, value: string) => {
    setCustomerForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(customerForm).forEach((key) => {
      const field = key as keyof CustomerForm;
      const error = getErrorMessage(field, customerForm[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields correctly');
      return;
    }

    if (!location || !shop) {
      Alert.alert('Error', 'Missing location or shop information');
      return;
    }

    setLoading(true);
    try {
      const order = await appwriteService.createOrder({
        shop,
        customer: {
          name: customerForm.name.trim(),
          phone: customerForm.phone.trim(),
          address: customerForm.address.trim(),
        },
        locationId: location.$id,
        items: cart,
        totalAmount: getCartTotal(),
      });

      await clearCart();
      
      router.replace({
        pathname: '/(shop)/order-success',
        params: {
          orderNumber: order.orderNumber,
          orderId: order.$id,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your name"
              value={customerForm.name}
              onChangeText={(text) => handleFieldChange('name', text)}
              autoCapitalize="words"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Enter 10-digit phone number"
              value={customerForm.phone}
              onChangeText={(text) => handleFieldChange('phone', text)}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Address *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.address && styles.inputError,
              ]}
              placeholder="Enter complete delivery address"
              value={customerForm.address}
              onChangeText={(text) => handleFieldChange('address', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <CartSummary showItems />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <Text style={styles.paymentNote}>
              Pay when you receive your order
            </Text>
          </View>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{formatCurrency(getCartTotal())}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
        borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  inputError: {
    borderColor: UI_CONFIG.dangerColor,
  },
  errorText: {
    color: UI_CONFIG.dangerColor,
    fontSize: 12,
    marginTop: 5,
  },
  paymentMethod: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: UI_CONFIG.primaryColor,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  paymentNote: {
    fontSize: 14,
    color: '#666',
  },
  totalSection: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.primaryColor,
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
  placeOrderButton: {
    backgroundColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});