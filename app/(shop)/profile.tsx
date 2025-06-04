// app/(shop)/profile.tsx
import { APP_CONFIG, UI_CONFIG } from '@/constants/Config';
import { useApp } from '@/context/AppContext';
import { formatPhone } from '@/utils/formatters';
import { showConfirmAlert } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProfileScreen() {
  const { shop, location, logout } = useApp();

  const handleLogout = () => {
    showConfirmAlert(
      'Logout',
      'Are you sure you want to logout?',
      async () => {
        await logout();
        router.replace('/(auth)/location');
      }
    );
  };

  const ProfileItem = ({ 
    icon, 
    label, 
    value 
  }: { 
    icon: string; 
    label: string; 
    value: string;
  }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon as any} size={20} color={UI_CONFIG.primaryColor} />
        <Text style={styles.profileLabel}>{label}</Text>
      </View>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'approved':
          return UI_CONFIG.successColor;
        case 'pending':
          return UI_CONFIG.warningColor;
        case 'rejected':
          return UI_CONFIG.dangerColor;
        default:
          return '#666';
      }
    };

    return (
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.shopIcon}>
          <Text style={styles.shopInitial}>
            {shop?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.shopName}>{shop?.name}</Text>
        {shop && <StatusBadge status={shop.status} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Information</Text>
        <ProfileItem 
          icon="person-outline" 
          label="Owner" 
          value={shop?.ownerName || '-'} 
        />
        <ProfileItem 
          icon="call-outline" 
          label="Phone" 
          value={shop?.phone ? formatPhone(shop.phone) : '-'} 
        />
        {shop?.email && (
          <ProfileItem 
            icon="mail-outline" 
            label="Email" 
            value={shop.email} 
          />
        )}
        <ProfileItem 
          icon="location-outline" 
          label="Address" 
          value={shop?.address || '-'} 
        />
        {shop?.shopId && (
          <ProfileItem 
            icon="pricetag-outline" 
            label="Shop ID" 
            value={shop.shopId} 
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Location</Text>
        <ProfileItem 
          icon="map-outline" 
          label="Area" 
          value={location?.name || '-'} 
        />
        <ProfileItem 
          icon="business-outline" 
          label="City" 
          value={`${location?.city}, ${location?.state}` || '-'} 
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <ProfileItem 
          icon="information-circle-outline" 
          label="Version" 
          value={APP_CONFIG.version} 
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  shopIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UI_CONFIG.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  shopInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
    profileLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  profileValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONFIG.dangerColor,
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 16,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});