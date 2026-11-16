import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, typography, borderRadius, addToCart } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const featuredProducts = PRODUCTS.filter((p) => p.featured);
  const popularProducts = PRODUCTS.filter((p) => p.popular);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product, productId: product.id });
  };

  const handleSearchPress = () => {
    navigation.navigate('Products');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: insets.top, backgroundColor: colors.cardBackground }}>
        <Header />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <SearchBar
            editable={false}
            onPress={handleSearchPress}
            placeholder="Search products, brands, audio..."
          />
        </View>

        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <View
            style={[
              styles.heroBanner,
              {
                backgroundColor: colors.primary,
                borderRadius: borderRadius.lg,
              },
            ]}
          >
            <View style={styles.heroTextContainer}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>SEASON SALE • 25% OFF</Text>
              </View>
              <Text style={styles.heroTitle}>Premium Audio & Modern Tech</Text>
              <Text style={styles.heroSubtitle}>
                Upgrade your workspace with curated gear
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => navigation.navigate('Products')}
                activeOpacity={0.8}
              >
                <Text style={styles.heroButtonText}>Shop Collection</Text>
                <Ionicons name="arrow-forward" size={14} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
            Categories
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            if (catId !== 'all') {
              navigation.navigate('Products', { initialCategory: catId });
            }
          }}
        />

        {/* Featured Products Carousel / Row */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="sparkles" size={18} color="#F59E0B" />
            <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
              Featured Gear
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalProductsContainer}
        >
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              style={styles.featuredCard}
              onPress={() => handleProductPress(product)}
              onAddToCart={() => addToCart(1)}
            />
          ))}
        </ScrollView>

        {/* Popular Products Grid */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <View style={styles.titleWithIcon}>
            <Ionicons name="flame" size={20} color="#EF4444" />
            <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
              Popular Essentials
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              style={styles.gridCard}
              onPress={() => handleProductPress(product)}
              onAddToCart={() => addToCart(1)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  heroBanner: {
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTextContainer: {
    zIndex: 1,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    marginBottom: 14,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroButtonText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  horizontalProductsContainer: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  featuredCard: {
    width: width * 0.44,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 44) / 2,
    marginBottom: 14,
  },
});
