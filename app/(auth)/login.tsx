// app/(auth)/login.tsx
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import appwriteService from '@/services/appwrite.service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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

export default function LoginScreen() {
  const { location, setShop } = useApp();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validatePhone(phone)) {
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please select your location first');
      router.replace('/(auth)/location');
      return;
    }

    setLoading(true);
    try {
      const shop = await appwriteService.getShopByPhone(phone);
      
      if (shop) {
        // Check if shop belongs to selected location
        if (shop.locationId !== location.$id) {
          Alert.alert(
            'Location Mismatch',
            'This shop is registered in a different location. Please select the correct location.',
            [
              {
                text: 'Change Location',
                onPress: () => router.replace('/(auth)/location'),
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          return;
        }

        await setShop(shop);
        
        if (shop.status === 'approved' && shop.isActive) {
          router.replace('/(shop)/products');
        } else if (shop.status === 'pending') {
          Alert.alert(
            'Pending Approval',
            'Your shop registration is pending admin approval. Please check back later.',
            [{ text: 'OK' }]
          );
        } else if (shop.status === 'rejected') {
          Alert.alert(
            'Registration Rejected',
            'Your shop registration was rejected. Please contact support for more information.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Shop Inactive',
            'Your shop is currently inactive. Please contact support.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Shop Not Found',
          'No shop found with this phone number. Would you like to register?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Register',
              onPress: () => router.push('/(auth)/shop-registration'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Image 
              source={require('@/assets/images/ratana.jpg')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to manage your shop</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.locationCard}>
              <Ionicons name="location" size={20} color={UI_CONFIG.primaryColor} />
              <Text style={styles.locationText}>
                {location?.name || 'No location selected'}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/location')}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, styles.phoneInput, error && styles.inputError]}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (error) validatePhone(text);
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoFocus
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push('/(auth)/shop-registration')}
            >
              <Text style={styles.registerButtonText}>Register New Shop</Text>
            </TouchableOpacity>

            <Text style={styles.helpText}>
              Having trouble? Contact support at{'\n'}
              <Text style={styles.supportText}>support@ratana.app</Text>
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
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  changeText: {
    color: UI_CONFIG.primaryColor,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    paddingVertical: 12,
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
  phoneInput: {
    flex: 1,
  },
  inputError: {
    borderColor: UI_CONFIG.dangerColor,
  },
  errorText: {
    color: UI_CONFIG.dangerColor,
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    backgroundColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#666',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  registerButtonText: {
    color: UI_CONFIG.primaryColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  supportText: {
    color: UI_CONFIG.primaryColor,
    fontWeight: '600',
  },
});