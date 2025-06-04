// app/(auth)/_layout.tsx
import { UI_CONFIG } from '@/constants/Config';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: UI_CONFIG.primaryColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Stack.Screen
        name="location"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="shop-registration"
        options={{
          title: 'Register Your Shop',
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}