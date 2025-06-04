// components/product/CategoryFilter.tsx
import { UI_CONFIG } from '@/constants/Config';
import type { Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipSelected,
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Ionicons
            name="apps-outline"
            size={16}
            color={!selectedCategory ? '#fff' : '#666'}
          />
          <Text
            style={[
              styles.categoryText,
              !selectedCategory && styles.categoryTextSelected,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category.$id}
            style={[
              styles.categoryChip,
              selectedCategory === category.$id && styles.categoryChipSelected,
            ]}
            onPress={() => onSelectCategory(category.$id)}
          >
            {category.image && (
              <Ionicons
                name="pricetag-outline"
                size={16}
                color={selectedCategory === category.$id ? '#fff' : '#666'}
              />
            )}
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.$id && styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipSelected: {
    backgroundColor: UI_CONFIG.primaryColor,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
});