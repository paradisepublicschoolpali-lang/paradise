import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { useAuth } from '../context/AuthContext';
import { linkingService } from '../services/linkingService';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showContactAction?: boolean;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showContactAction = true,
  onOpenProfile
}) => {
  const { colors } = useTheme();
  const { config } = useSchoolData();
  const { currentUser, role, isAuthenticated } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', icon: 'shield-checkmark', bg: '#DC2626', text: '#FFFFFF' };
      case 'teacher':
        return { label: 'Faculty', icon: 'school', bg: '#059669', text: '#FFFFFF' };
      case 'parent':
        return { label: 'Parent', icon: 'people', bg: '#2563EB', text: '#FFFFFF' };
      default:
        return { label: 'Guest', icon: 'person', bg: '#64748B', text: '#FFFFFF' };
    }
  };

  const badge = getRoleBadge();

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
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImg}
              resizeMode="cover"
            />
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

      <View style={styles.rightActions}>
        {/* Role Pill Badge */}
        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.roleBadge, { backgroundColor: badge.bg }]}
            onPress={onOpenProfile}
            activeOpacity={0.8}
          >
            <Ionicons name={badge.icon as any} size={11} color={badge.text} style={{ marginRight: 3 }} />
            <Text style={[styles.roleBadgeText, { color: badge.text }]}>
              {badge.label}
            </Text>
          </TouchableOpacity>
        )}

        {showContactAction && (
          <TouchableOpacity
            style={[styles.actionIconBtn, { backgroundColor: colors.primaryTint }]}
            onPress={() => linkingService.openPhone(config.contactPhone)}
            accessibilityLabel="Call school"
            accessibilityRole="button"
          >
            <Ionicons name="call" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoBadge: {
    marginRight: 10,
  },
  logoImg: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  titleCol: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subTitle: {
    fontSize: 10.5,
    marginTop: 1,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
