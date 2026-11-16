import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, typography, borderRadius, addToCart, cartCount } = useAppTheme();

  const productId = route.params?.productId;
  const initialProduct = route.params?.product;

  const product =
    initialProduct ||
    PRODUCTS.find((p) => p.id === productId) ||
    PRODUCTS[0];

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleIncrement = () => {
    if (quantity < (product.stock || 99)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
    }, 2000);
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
      >
        {/* Product Image Stage */}
        <View style={[styles.imageWrapper, { backgroundColor: colors.borderLight }]}>
          {imageError ? (
            <View style={styles.fallbackWrapper}>
              <Ionicons name="cube-outline" size={80} color={colors.textMuted} />
              <Text style={[styles.fallbackText, { color: colors.textMuted }]}>
                {product.categoryName}
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

          {/* Floating Category Pill */}
          <View style={[styles.categoryBadge, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
              {product.categoryName}
            </Text>
          </View>

          {/* Stock status */}
          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor:
                  product.stock > 10 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
            <Text style={styles.stockBadgeText}>
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
            },
          ]}
        >
          {/* Rating & Reviews */}
          <View style={styles.ratingSection}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(product.rating) ? 'star' : 'star-half'}
                  size={16}
                  color="#F59E0B"
                />
              ))}
              <Text style={[styles.ratingNumber, { color: colors.textPrimary }]}>
                {product.rating.toFixed(1)}
              </Text>
            </View>
            <Text style={[styles.reviewsCount, { color: colors.textSecondary }]}>
              {product.reviewsCount} verified reviews
            </Text>
          </View>

          {/* Product Title */}
          <Text style={[typography.titleLarge, { color: colors.textPrimary, marginTop: 10 }]}>
            {product.name}
          </Text>

          {/* Pricing Block */}
          <View style={styles.priceRow}>
            <Text style={[styles.mainPrice, { color: colors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            {product.originalPrice && (
              <>
                <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
                  ${product.originalPrice.toFixed(2)}
                </Text>
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>
                    SAVE ${(product.originalPrice - product.price).toFixed(0)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Description */}
          <Text style={[typography.titleSmall, { color: colors.textPrimary, marginBottom: 8 }]}>
            About This Item
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.textSecondary, lineHeight: 22 }]}>
            {product.description}
          </Text>

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={[typography.titleSmall, { color: colors.textPrimary, marginBottom: 12 }]}>
                Highlights & Specifications
              </Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.textPrimary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Quantity Selector */}
          <View style={[styles.quantityContainer, { borderColor: colors.border }]}>
            <View>
              <Text style={[typography.titleSmall, { color: colors.textPrimary }]}>
                Quantity
              </Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Select item units
              </Text>
            </View>
            <View
              style={[
                styles.quantityControls,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                onPress={handleDecrement}
                style={styles.qtyBtn}
                disabled={quantity <= 1}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={quantity <= 1 ? colors.textMuted : colors.textPrimary}
                />
              </TouchableOpacity>
              <Text style={[styles.qtyNumber, { color: colors.textPrimary }]}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={handleIncrement}
                style={styles.qtyBtn}
                disabled={quantity >= product.stock}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="add"
                  size={18}
                  color={quantity >= product.stock ? colors.textMuted : colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
            Total Price ({quantity} {quantity === 1 ? 'item' : 'items'})
          </Text>
          <Text style={[styles.totalPrice, { color: colors.textPrimary }]}>
            ${totalPrice}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.cartButton,
            {
              backgroundColor: addedNotice ? '#10B981' : colors.primary,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Ionicons
            name={addedNotice ? 'checkmark-circle' : 'cart'}
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.cartButtonText}>
            {addedNotice ? 'Added to Cart!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageWrapper: {
    width: width,
    height: 320,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 14,
    marginTop: 8,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  stockBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  detailsCard: {
    marginTop: -20,
    padding: 20,
    borderTopWidth: 1,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  reviewsCount: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    gap: 10,
  },
  mainPrice: {
    fontSize: 26,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  discountTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountTagText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 18,
  },
  featuresSection: {
    marginTop: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNumber: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
