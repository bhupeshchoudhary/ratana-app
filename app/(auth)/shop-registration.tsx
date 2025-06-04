





// app/(auth)/shop-registration.tsx
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import appwriteService from '@/services/appwrite.service';
import type { Shop } from '@/types';
import { getErrorMessage, validators } from '@/utils/validators';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormData {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
}

interface FormErrors {
  shopName?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function ShopRegistrationScreen() {
  const { location, setShop } = useApp();
  const [formData, setFormData] = useState<FormData>({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  // Debug collections on mount
  useEffect(() => {
    appwriteService.debugCollections();
  }, []);

    const validateField = (field: keyof FormData, value: string) => {
    const error = getErrorMessage(field === 'shopName' ? 'shopName' : field === 'ownerName' ? 'name' : field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const checkExistingShop = async () => {
    if (!validators.phone(formData.phone)) {
      return;
    }

    setCheckingPhone(true);
    try {
      const existingShop = await appwriteService.getShopByPhone(formData.phone);
      if (existingShop) {
        Alert.alert(
          'Shop Already Registered',
          'A shop is already registered with this phone number. Logging you in...',
          [
            {
              text: 'OK',
              onPress: async () => {
                await setShop(existingShop);
                router.replace('/(shop)/products');
              },
            },
          ]
        );
      }
    } catch (error) {
      // Phone number not found, continue with registration
      console.log('Phone not found, can register new shop');
    } finally {
      setCheckingPhone(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach((key) => {
      const field = key as keyof FormData;
      const error = getErrorMessage(
        field === 'shopName' ? 'shopName' : field === 'ownerName' ? 'name' : field, 
        formData[field]
      );
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Location not selected');
      return;
    }

    setLoading(true);
    try {
      const shopData: Omit<Shop, '$id' | 'createdAt' | '$createdAt' | '$updatedAt'> = {
        name: formData.shopName.trim(),
        ownerName: formData.ownerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        locationId: location.$id,
        status: 'pending',
        isActive: false,
      };

      const newShop = await appwriteService.createShop(shopData);
      await setShop(newShop);
      
      Alert.alert(
        'Registration Successful',
        'Your shop has been registered successfully. It will be activated after admin approval.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(shop)/products'),
          },
        ]
      );
    } catch (error) {
      console.error('Shop registration error:', error);
      Alert.alert('Error', 'Failed to register shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Register Your Shop</Text>
            <Text style={styles.subtitle}>
              Enter your shop details to get started
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Name *</Text>
              <TextInput
                style={[styles.input, errors.shopName && styles.inputError]}
                placeholder="Enter your shop name"
                value={formData.shopName}
                onChangeText={(text) => handleFieldChange('shopName', text)}
                autoCapitalize="words"
              />
              {errors.shopName && (
                <Text style={styles.errorText}>{errors.shopName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Owner Name *</Text>
              <TextInput
                style={[styles.input, errors.ownerName && styles.inputError]}
                placeholder="Enter owner name"
                value={formData.ownerName}
                onChangeText={(text) => handleFieldChange('ownerName', text)}
                autoCapitalize="words"
              />
              {errors.ownerName && (
                <Text style={styles.errorText}>{errors.ownerName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChangeText={(text) => handleFieldChange('phone', text)}
                onBlur={checkExistingShop}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
              {checkingPhone && (
                <Text style={styles.infoText}>Checking phone number...</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter email address"
                value={formData.email}
                onChangeText={(text) => handleFieldChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Shop Address *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.address && styles.inputError,
                ]}
                placeholder="Enter complete shop address"
                value={formData.address}
                onChangeText={(text) => handleFieldChange('address', text)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>

            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Service Area:</Text>
              <Text style={styles.locationText}>{location?.name}</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading || checkingPhone}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Register Shop</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.noteText}>
              Note: Your shop will be activated after admin approval. You will be
              notified once approved.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
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
    fontSize: 14,
    marginTop: 5,
  },
  infoText: {
    color: UI_CONFIG.infoColor,
    fontSize: 14,
    marginTop: 5,
  },
  locationInfo: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: UI_CONFIG.primaryColor,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});