// services/location.service.ts
import * as ExpoLocation from 'expo-location';
import { Alert } from 'react-native';

class LocationService {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to detect your service area.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<ExpoLocation.LocationObject | null> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) return null;

      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
      });
      
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Failed to get your current location');
      return null;
    }
  }

  async reverseGeocode(
    latitude: number, 
    longitude: number
  ): Promise<ExpoLocation.LocationGeocodedAddress | null> {
    try {
      const addresses = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      return addresses[0] || null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * 
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
}

export default new LocationService();