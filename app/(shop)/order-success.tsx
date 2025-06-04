// app/(shop)/order-success.tsx
import { UI_CONFIG } from '@/constants/Config';
import { formatOrderNumber } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{ orderNumber: string; orderId: string }>();

  useEffect(() => {
    // Prevent going back to the checkout screen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Navigate to products screen instead of going back
      router.replace('/(shop)/products');
      return true; // Prevent default back behavior
    });

    // Cleanup
    return () => backHandler.remove();
  }, []);

  const handleContinueShopping = () => {
    router.replace('/(shop)/products');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color={UI_CONFIG.successColor} />
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        
        <Text style={styles.subtitle}>
          Thank you for your order. We'll deliver it soon.
        </Text>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Order Number</Text>
          <Text style={styles.orderNumber}>
            {formatOrderNumber(params.orderNumber || '')}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="bicycle-outline" size={24} color={UI_CONFIG.primaryColor} />
          <Text style={styles.infoText}>
            Your order will be delivered within 2-3 hours
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="cash-outline" size={24} color={UI_CONFIG.primaryColor} />
          <Text style={styles.infoText}>
            Payment to be made on delivery (Cash)
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  orderInfo: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    minWidth: '80%',
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.primaryColor,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});