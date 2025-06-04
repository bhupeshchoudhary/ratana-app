// app/index.tsx
import { UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { loading, location, shop } = useApp();

  useEffect(() => {
    if (!loading) {
      // Determine where to navigate based on stored data
      if (!location) {
        router.replace('/(auth)/location');
      } else if (!shop) {
        router.replace('/(auth)/shop-registration');
      } else {
        router.replace('/(shop)/products');
      }
    }
  }, [loading, location, shop]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={UI_CONFIG.primaryColor} />
    </View>
  );
}