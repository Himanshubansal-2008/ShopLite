import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function ProductCard({
  product,
  onPress,
  style,
  onAddToCart,
}) {
  const { colors, borderRadius } = useAppTheme();
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const stock = typeof product.stock === 'number' ? product.stock : 0;
  const isOutOfStock = stock <= 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: colors.borderLight }]}>
        {imageError ? (
          <View style={styles.fallbackContainer}>
            <Ionicons name="cube-outline" size={42} color={colors.textMuted} />
            <Text style={[styles.fallbackText, { color: colors.textMuted }]}>
              {product.categoryName || 'Product'}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}

        {/* Category & Stock Badges */}
        <View style={[styles.badge, { backgroundColor: 'rgba(0, 0, 0, 0.65)' }]}>
          <Text style={styles.badgeText}>{product.categoryName}</Text>
        </View>

        {isOutOfStock && (
          <View style={[styles.stockAlertBadge, { backgroundColor: colors.danger }]}>
            <Text style={styles.stockAlertText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
            {product.rating.toFixed(1)}
          </Text>
          <Text style={[styles.reviewsText, { color: colors.textMuted }]}>
            ({product.reviewsCount})
          </Text>
        </View>

        {/* Title */}
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>

        {/* Price & Action row */}
        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
                ${product.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {onAddToCart && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                if (!isOutOfStock) {
                  onAddToCart(product);
                }
              }}
              disabled={isOutOfStock}
              style={[
                styles.addButton,
                { backgroundColor: isOutOfStock ? colors.border : colors.primary },
              ]}
              activeOpacity={isOutOfStock ? 1 : 0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              accessibilityLabel={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            >
              <Ionicons
                name={isOutOfStock ? 'ban' : 'add'}
                size={16}
                color={isOutOfStock ? colors.textMuted : '#FFFFFF'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockAlertBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockAlertText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  infoContainer: {
    padding: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewsText: {
    fontSize: 11,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    height: 36,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
