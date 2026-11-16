import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  GridSkeleton,
  SearchSkeleton,
  EmptyStateSkeleton,
} from 'skellx';
import { useAppTheme } from '../context/ThemeContext';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 32 - CARD_GAP) / 2;

export default function ProductListingScreen({ navigation, route }) {
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

  const initialCategory = route.params?.initialCategory || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Respond to demo reload trigger
  useEffect(() => {
    if (demoReloadKey > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [demoReloadKey]);

  // Category switch loading simulation
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  // Search input handler with search skeleton simulation
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.length > 0 && !isSearching) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
      }, 400);
    }
  };

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 850);
  }, []);

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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {/* SkellX EmptyStateSkeleton demonstrates empty search state */}
      <EmptyStateSkeleton
        illustrationSize={100}
        showAction={false}
        descriptionLines={2}
        animation={animationMode}
        style={styles.emptySkeleton}
      />
      <Text style={[typography.titleMedium, { color: colors.textPrimary, marginTop: 12 }]}>
        No Products Found
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          { color: colors.textSecondary, textAlign: 'center', marginTop: 6, paddingHorizontal: 28 },
        ]}
      >
        No matches for "{searchQuery}". Try a different keyword or reset filters.
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
          onChangeText={handleSearchChange}
          onClear={() => setSearchQuery('')}
          placeholder="Filter by name, brand or type..."
        />
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </View>

      {/* Meta Bar & Quick Animation Controller */}
      <View style={styles.metaBar}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>
          SHOWING{' '}
          <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
            {isLoading || isSearching ? '...' : filteredProducts.length}
          </Text>{' '}
          {filteredProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
        </Text>

        <View style={styles.animationControlsRow}>
          {['shimmer', 'pulse', 'static'].map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => {
                setAnimationMode(mode);
                triggerLoadingDemo();
              }}
              style={[
                styles.miniModeBtn,
                {
                  backgroundColor:
                    animationMode === mode ? colors.primary : colors.cardBackground,
                  borderColor:
                    animationMode === mode ? colors.primary : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.miniModeText,
                  {
                    color: animationMode === mode ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: animationMode === mode ? '700' : '500',
                  },
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content: SkellX Skeletons or Grid */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonIndicator}>
            <Text style={[styles.skeletonBadge, { color: colors.primary }]}>
              Rendering SkellX &lt;GridSkeleton animation="{animationMode}" /&gt;
            </Text>
          </View>
          <GridSkeleton
            count={6}
            columns={2}
            itemHeight={140}
            spacing={CARD_GAP}
            showText={true}
            animation={animationMode}
          />
        </View>
      ) : isSearching ? (
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonIndicator}>
            <Text style={[styles.skeletonBadge, { color: colors.primary }]}>
              Rendering SkellX &lt;SearchSkeleton animation="{animationMode}" /&gt;
            </Text>
          </View>
          <SearchSkeleton
            results={4}
            showFilters={false}
            showThumbnail={true}
            thumbnailSize={54}
            spacing={14}
            animation={animationMode}
          />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.listContent,
            filteredProducts.length === 0 && styles.listContentEmpty,
          ]}
          columnWrapperStyle={filteredProducts.length > 0 ? styles.columnWrapper : undefined}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
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
      )}
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
  animationControlsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniModeBtn: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  miniModeText: {
    fontSize: 10,
    textTransform: 'capitalize',
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  skeletonIndicator: {
    marginBottom: 8,
    alignItems: 'center',
  },
  skeletonBadge: {
    fontSize: 11,
    fontWeight: '700',
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
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  emptySkeleton: {
    width: '100%',
    alignItems: 'center',
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
