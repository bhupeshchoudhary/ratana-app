// app/(auth)/location.tsx
import { APP_CONFIG, UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import appwriteService from '@/services/appwrite.service';
import locationService from '@/services/location.service';
import type { Location } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationScreen() {
  const { setLocation } = useApp();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);


  // app/(auth)/location.tsx - Update the continue function


  const fetchLocations = async () => {
    try {
      const locationList = await appwriteService.getLocations();
      setLocations(locationList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    try {
      const currentLocation = await locationService.getCurrentLocation();
      if (currentLocation) {
        const address = await locationService.reverseGeocode(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
        
        // For demo, select first location
        if (locations.length > 0) {
          setSelectedLocation(locations[0]);
          Alert.alert(
            'Location Detected',
            `Your area: ${address?.city || 'Unknown'}\nService area selected: ${locations[0].name}`
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to detect location. Please select manually.');
    } finally {
      setDetectingLocation(false);
    }
  };

 const handleContinue = async () => {
  if (!selectedLocation) {
    Alert.alert('Error', 'Please select a location to continue');
    return;
  }

  await setLocation(selectedLocation);
  
  // Navigate to login instead of shop registration
  router.replace('/(auth)/login');
};

  const renderLocation = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={[
        styles.locationItem,
        selectedLocation?.$id === item.$id && styles.selectedLocationItem
      ]}
      onPress={() => setSelectedLocation(item)}
      activeOpacity={0.7}
    >
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <Text style={styles.locationCity}>{item.city}, {item.state} - {item.pincode}</Text>
      </View>
      {selectedLocation?.$id === item.$id && (
        <Ionicons 
          name="checkmark-circle" 
          size={24} 
          color={UI_CONFIG.primaryColor} 
        />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={UI_CONFIG.primaryColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/ratana.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{APP_CONFIG.appName}</Text>
        <Text style={styles.subtitle}>Select Your Service Area</Text>
      </View>

      <TouchableOpacity
        style={styles.detectButton}
        onPress={detectCurrentLocation}
        disabled={detectingLocation}
      >
        {detectingLocation ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="location" size={20} color="#fff" />
            <Text style={styles.detectButtonText}>Detect My Location</Text>
          </>
        )}
      </TouchableOpacity>

      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.locationList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No service areas available</Text>
        }
      />

      <TouchableOpacity
        style={[
          styles.continueButton,
          !selectedLocation && styles.continueButtonDisabled
        ]}
        onPress={handleContinue}
        disabled={!selectedLocation}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.primaryColor,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONFIG.secondaryColor,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  locationList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  locationItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedLocationItem: {
    borderColor: UI_CONFIG.primaryColor,
    borderWidth: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  locationCity: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
  continueButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: UI_CONFIG.primaryColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});