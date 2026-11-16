import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

const ANIMATION_OPTIONS = [
  { id: 'shimmer', label: 'Shimmer', icon: 'sparkles-outline', desc: 'Flowing linear gradient wave' },
  { id: 'pulse', label: 'Pulse', icon: 'pulse-outline', desc: 'Gentle opacity breathing rhythm' },
  { id: 'static', label: 'Static', icon: 'stop-circle-outline', desc: 'Fixed solid placeholder tone' },
];

export default function SkellXDemoModal() {
  const {
    isDemoModalOpen,
    closeDemoModal,
    animationMode,
    setAnimationMode,
    themeMode,
    setThemeMode,
    triggerLoadingDemo,
    colors,
    borderRadius,
  } = useAppTheme();

  return (
    <Modal
      visible={isDemoModalOpen}
      transparent
      animationType="fade"
      onRequestClose={closeDemoModal}
    >
      <Pressable style={styles.overlay} onPress={closeDemoModal}>
        <Pressable
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <View style={[styles.badgeIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="construct" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  SkellX Playground
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Customize skeleton loading animation & themes
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={closeDemoModal}
              style={[styles.closeBtn, { backgroundColor: colors.background }]}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Section 1: Animation Mode Selector */}
          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
            ANIMATION MODE
          </Text>
          <View style={styles.optionsColumn}>
            {ANIMATION_OPTIONS.map((opt) => {
              const isSelected = animationMode === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.animationOptionRow,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  onPress={() => setAnimationMode(opt.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isSelected ? colors.primary : colors.textSecondary}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                      {opt.desc}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 2: Theme Selector */}
          <Text style={[styles.sectionLabel, { color: colors.textPrimary, marginTop: 16 }]}>
            THEME MODE
          </Text>
          <View style={styles.themeToggleRow}>
            <TouchableOpacity
              style={[
                styles.themeBtn,
                {
                  backgroundColor: themeMode === 'light' ? colors.primary : colors.background,
                  borderColor: themeMode === 'light' ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="sunny"
                size={18}
                color={themeMode === 'light' ? '#FFFFFF' : colors.textPrimary}
              />
              <Text
                style={[
                  styles.themeBtnText,
                  { color: themeMode === 'light' ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Light Theme
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                {
                  backgroundColor: themeMode === 'dark' ? colors.primary : colors.background,
                  borderColor: themeMode === 'dark' ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="moon"
                size={18}
                color={themeMode === 'dark' ? '#FFFFFF' : colors.textPrimary}
              />
              <Text
                style={[
                  styles.themeBtnText,
                  { color: themeMode === 'dark' ? '#FFFFFF' : colors.textPrimary },
                ]}
              >
                Dark Theme
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section 3: Trigger Loading Simulation */}
          <View style={[styles.actionContainer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.simulateButton,
                { backgroundColor: colors.primary, borderRadius: borderRadius.md },
              ]}
              onPress={() => {
                triggerLoadingDemo();
                closeDemoModal();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.simulateButtonText}>
                Trigger Loading Skeletons Now
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  optionsColumn: {
    gap: 8,
  },
  animationOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
  },
  optionLabel: {
    fontSize: 14,
  },
  optionDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  themeToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  simulateButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
