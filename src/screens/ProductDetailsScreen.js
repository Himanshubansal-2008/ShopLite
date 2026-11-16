import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function ProductDetailsScreen({ route }) {
  const { colors, typography } = useAppTheme();
  const productId = route.params?.productId || '1';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.titleLarge, { color: colors.textPrimary }]}>
        Product Details
      </Text>
      <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: 8 }]}>
        Viewing Product #{productId}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
