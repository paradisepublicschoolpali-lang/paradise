import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { linkingService } from '../services/linkingService';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showContactAction?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showContactAction = true
}) => {
  const { colors, isDark } = useTheme();
  const { config } = useSchoolData();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border
        }
      ]}
    >
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <View style={styles.shieldIcon}>
              <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
            </View>
          </View>
        )}

        <View style={styles.titleCol}>
          <Text style={[styles.mainTitle, { color: colors.text }]} numberOfLines={1}>
            {title || config.schoolName}
          </Text>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {subtitle || 'CBSE Affiliated (Nursery to Class 8) • Estd. 1994'}
          </Text>
        </View>
      </View>

      {showContactAction && (
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.actionIconBtn, { backgroundColor: colors.primaryTint }]}
            onPress={() => linkingService.openPhone(config.contactPhone)}
            accessibilityLabel="Call school"
            accessibilityRole="button"
          >
            <Ionicons name="call" size={17} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoBadge: {
    marginRight: 12,
  },
  shieldIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  titleCol: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subTitle: {
    fontSize: 11,
    marginTop: 1.5,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
