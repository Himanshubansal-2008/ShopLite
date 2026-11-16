import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { CATEGORIES } from '../data/products';

export default function CategoryList({
  categories = CATEGORIES,
  selectedCategory = 'all',
  onSelectCategory,
}) {
  const { colors, borderRadius } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory && onSelectCategory(category.id)}
            style={[
              styles.pill,
              {
                backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                borderColor: isSelected ? colors.primary : colors.border,
                borderRadius: borderRadius.full,
              },
            ]}
            activeOpacity={0.7}
          >
            {category.icon && (
              <Ionicons
                name={category.icon}
                size={16}
                color={isSelected ? '#FFFFFF' : colors.textSecondary}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: isSelected ? '#FFFFFF' : colors.textPrimary,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
  },
});
