// app/(shop)/_layout.tsx
import { UI_CONFIG } from '@/constants/Config';
import { Stack } from 'expo-router';

export default function ShopLayout() {
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
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Stack.Screen
        name="products"
        options={{
          title: 'Products',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="cart"
        options={{
          title: 'Your Cart',
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          title: 'Checkout',
        }}
      />
      <Stack.Screen
        name="order-success"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  );
}