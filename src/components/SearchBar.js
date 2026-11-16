import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function SearchBar({
  value = '',
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Search products, brands, audio...',
  editable = true,
  onPress,
}) {
  const { colors, borderRadius } = useAppTheme();

  const Container = editable ? View : TouchableOpacity;

  return (
    <Container
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
      onPress={onPress}
      activeOpacity={editable ? 1 : 0.7}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textMuted}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
        returnKeyType="search"
      />
      {value.length > 0 && editable && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
});
