import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onAction
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleCol}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>

      {actionText && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          style={styles.actionBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>{actionText}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 18,
    paddingHorizontal: 16,
  },
  titleCol: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 2,
  }
});
