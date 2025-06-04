// utils/helpers.ts
import { Alert, Linking, Platform } from 'react-native';

export const makePhoneCall = async (phoneNumber: string) => {
  const url = `tel:${phoneNumber}`;
  const canOpen = await Linking.canOpenURL(url);
  
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Error', 'Unable to make phone call');
  }
};

export const openWhatsApp = async (phoneNumber: string, message?: string) => {
  const whatsappUrl = Platform.select({
    ios: `whatsapp://send?phone=${phoneNumber}${message ? `&text=${encodeURIComponent(message)}` : ''}`,
    android: `whatsapp://send?phone=${phoneNumber}${message ? `&text=${encodeURIComponent(message)}` : ''}`,
  });

  try {
    const canOpen = await Linking.canOpenURL(whatsappUrl!);
    if (canOpen) {
      await Linking.openURL(whatsappUrl!);
    } else {
      Alert.alert('Error', 'WhatsApp is not installed');
    }
  } catch (error) {
    Alert.alert('Error', 'Unable to open WhatsApp');
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'Cancel',
        onPress: onCancel,
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: onConfirm,
      },
    ],
    { cancelable: false }
  );
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};