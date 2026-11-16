import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function Header({ title = 'ShopLite', showBack = false, onBack }) {
  const { colors, themeMode, toggleTheme, cartCount } = useAppTheme();

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.iconButton, { backgroundColor: colors.background }]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="bag-handle" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
                Shop<Text style={{ color: colors.primary }}>Lite</Text>
              </Text>
              <Text style={[styles.brandTagline, { color: colors.textMuted }]}>
                Powered by SkellX
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {/* Theme toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconButton, { backgroundColor: colors.background }]}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Theme"
        >
          <Ionicons
            name={themeMode === 'dark' ? 'sunny' : 'moon'}
            size={18}
            color={themeMode === 'dark' ? '#FBBF24' : colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Cart counter */}
        <View style={[styles.iconButton, { backgroundColor: colors.background }]}>
          <Ionicons name="cart-outline" size={20} color={colors.textPrimary} />
          {cartCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.danger }]}>
              <Text style={styles.badgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
