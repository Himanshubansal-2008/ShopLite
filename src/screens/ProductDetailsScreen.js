import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardSkeleton, ProductSkeleton } from 'skellx';
import { useAppTheme } from '../context/ThemeContext';
import { PRODUCTS } from '../data/products';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const {
    colors,
    typography,
    borderRadius,
    addToCart,
    animationMode,
    setAnimationMode,
    demoReloadKey,
    triggerLoadingDemo,
  } = useAppTheme();

  const productId = route.params?.productId;
  const initialProduct = route.params?.product;

  const product =
    initialProduct ||
    PRODUCTS.find((p) => p.id === productId) ||
    PRODUCTS[0];

  const stock = typeof product?.stock === 'number' ? product.stock : 0;
  const isOutOfStock = stock <= 0;

  const isMountedRef = useRef(true);
  const refreshTimerRef = useRef(null);
  const noticeTimerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(isOutOfStock ? 0 : 1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    setQuantity(isOutOfStock ? 0 : 1);
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }, 700);
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, [productId, isOutOfStock]);

  // Respond to demo reload trigger
  useEffect(() => {
    if (demoReloadKey > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [demoReloadKey]);

  const handleRefresh = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    setIsLoading(true);
    refreshTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleIncrement = () => {
    if (!isOutOfStock && quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (!isOutOfStock && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock || quantity <= 0) {
      return;
    }
    addToCart(quantity);
    setAddedNotice(true);
    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setAddedNotice(false);
      }
    }, 2000);
  };

  const totalPrice = isOutOfStock ? '0.00' : (product.price * quantity).toFixed(2);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Quick Animation Bar */}
      <View
        style={[
          styles.quickBar,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.quickBarTitle, { color: colors.textSecondary }]}>
          Animation:
        </Text>
        <View style={styles.modeRow}>
          {['shimmer', 'pulse', 'static'].map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => {
                setAnimationMode(mode);
                triggerLoadingDemo();
              }}
              style={[
                styles.modeBtn,
                {
                  backgroundColor:
                    animationMode === mode ? colors.primary : colors.background,
                  borderColor:
                    animationMode === mode ? colors.primary : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modeBtnText,
                  {
                    color:
                      animationMode === mode ? '#FFFFFF' : colors.textPrimary,
                    fontWeight: animationMode === mode ? '700' : '500',
                  },
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={triggerLoadingDemo}
          style={[styles.reloadBtn, { backgroundColor: colors.primaryLight }]}
          activeOpacity={0.7}
        >
          <Ionicons name="reload" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {isLoading ? (
          /* SkellX CardSkeleton for Product Details Loading */
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonBadgeWrapper}>
              <Text style={[styles.skeletonBadge, { color: colors.primary }]}>
                Rendering SkellX &lt;CardSkeleton animation="{animationMode}" /&gt;
              </Text>
            </View>
            <CardSkeleton
              width="100%"
              imageHeight={280}
              avatarSize={38}
              lines={4}
              spacing={14}
              animation={animationMode}
              style={[
                styles.cardSkeletonStyle,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            />
            <View style={{ marginTop: 16 }}>
              <ProductSkeleton
                width="100%"
                imageHeight={120}
                titleLines={2}
                priceWidth="30%"
                animation={animationMode}
              />
            </View>
          </View>
        ) : (
          <>
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
              {isOutOfStock ? (
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor: 'rgba(239, 68, 68, 0.95)',
                    },
                  ]}
                >
                  <Ionicons name="close-circle" size={12} color="#FFFFFF" />
                  <Text style={styles.stockBadgeText}>Out of Stock</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.stockBadge,
                    {
                      backgroundColor:
                        stock > 10
                          ? 'rgba(16, 185, 129, 0.9)'
                          : 'rgba(245, 158, 11, 0.9)',
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
                  <Text style={styles.stockBadgeText}>
                    {stock > 10 ? 'In Stock' : `Only ${stock} left`}
                  </Text>
                </View>
              )}
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
              {/* Out of Stock Alert Banner */}
              {isOutOfStock && (
                <View
                  style={[
                    styles.outOfStockBanner,
                    {
                      backgroundColor: colors.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                      borderColor: colors.danger,
                    },
                  ]}
                >
                  <Ionicons name="alert-circle" size={20} color={colors.danger} />
                  <View style={styles.outOfStockBannerContent}>
                    <Text style={[styles.outOfStockTitle, { color: colors.danger }]}>
                      Currently Out of Stock
                    </Text>
                    <Text style={[styles.outOfStockDesc, { color: colors.textSecondary }]}>
                      This item is not available for purchase at the moment.
                    </Text>
                  </View>
                </View>
              )}

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
                  <Text
                    style={[
                      typography.titleSmall,
                      { color: colors.textPrimary, marginBottom: 12 },
                    ]}
                  >
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
                    {isOutOfStock ? '0 units in stock' : 'Select item units'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.quantityControls,
                    {
                      backgroundColor: isOutOfStock ? colors.borderLight : colors.background,
                      borderColor: colors.border,
                      opacity: isOutOfStock ? 0.5 : 1,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={handleDecrement}
                    style={styles.qtyBtn}
                    disabled={isOutOfStock || quantity <= 1}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="remove"
                      size={18}
                      color={isOutOfStock || quantity <= 1 ? colors.textMuted : colors.textPrimary}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.qtyNumber, { color: isOutOfStock ? colors.textMuted : colors.textPrimary }]}>
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={handleIncrement}
                    style={styles.qtyBtn}
                    disabled={isOutOfStock || quantity >= stock}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      color={isOutOfStock || quantity >= stock ? colors.textMuted : colors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      {!isLoading && (
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
              {isOutOfStock
                ? 'Item Unavailable'
                : `Total Price (${quantity} ${quantity === 1 ? 'item' : 'items'})`}
            </Text>
            <Text
              style={[
                styles.totalPrice,
                { color: isOutOfStock ? colors.textMuted : colors.textPrimary },
              ]}
            >
              ${totalPrice}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.cartButton,
              {
                backgroundColor: isOutOfStock
                  ? colors.border
                  : addedNotice
                  ? '#10B981'
                  : colors.primary,
                borderRadius: borderRadius.md,
              },
            ]}
            onPress={handleAddToCart}
            disabled={isOutOfStock}
            activeOpacity={isOutOfStock ? 1 : 0.8}
            accessibilityLabel={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            <Ionicons
              name={
                isOutOfStock
                  ? 'ban-outline'
                  : addedNotice
                  ? 'checkmark-circle'
                  : 'cart'
              }
              size={20}
              color={isOutOfStock ? colors.textMuted : '#FFFFFF'}
            />
            <Text
              style={[
                styles.cartButtonText,
                { color: isOutOfStock ? colors.textMuted : '#FFFFFF' },
              ]}
            >
              {isOutOfStock
                ? 'Out of Stock'
                : addedNotice
                ? 'Added to Cart!'
                : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  quickBarTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  modeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  modeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeBtnText: {
    fontSize: 11,
  },
  reloadBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonBadgeWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardSkeletonStyle: {
    borderWidth: 1,
    borderRadius: 14,
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
  outOfStockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  outOfStockBannerContent: {
    flex: 1,
    marginLeft: 10,
  },
  outOfStockTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  outOfStockDesc: {
    fontSize: 12,
    lineHeight: 16,
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
