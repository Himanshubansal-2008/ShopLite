import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 32 - CARD_GAP) / 2;

export default function ProductListingScreen({ navigation, route }) {
  const { colors, typography, borderRadius, addToCart } = useAppTheme();
  const initialCategory = route.params?.initialCategory || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product, productId: product.id });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconCircle,
          { backgroundColor: colors.borderLight, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search-outline" size={48} color={colors.textMuted} />
      </View>
      <Text style={[typography.titleMedium, { color: colors.textPrimary, marginTop: 16 }]}>
        No Products Found
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          { color: colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 32 },
        ]}
      >
        We couldn't find any products matching "{searchQuery}". Try checking for typos or searching a different keyword.
      </Text>
      <TouchableOpacity
        style={[
          styles.clearFiltersButton,
          { backgroundColor: colors.primary, borderRadius: borderRadius.md },
        ]}
        onPress={handleClearFilters}
        activeOpacity={0.8}
      >
        <Ionicons name="refresh" size={16} color="#FFFFFF" />
        <Text style={styles.clearFiltersText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View
        style={[
          styles.headerSection,
          { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
        ]}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Filter by name, brand or type..."
        />
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {/* Meta Bar */}
      <View style={styles.metaBar}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          SHOWING{' '}
          <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
            {filteredProducts.length}
          </Text>{' '}
          {filteredProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
        </Text>
        {(searchQuery.length > 0 || selectedCategory !== 'all') && (
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={[styles.activeFilterReset, { color: colors.primary }]}>
              Clear all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Two-Column Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          filteredProducts.length === 0 && styles.listContentEmpty,
        ]}
        columnWrapperStyle={filteredProducts.length > 0 ? styles.columnWrapper : undefined}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            style={{ width: CARD_WIDTH }}
            onPress={() => handleProductPress(item)}
            onAddToCart={() => addToCart(1)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  metaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeFilterReset: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 20,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
