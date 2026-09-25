import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface QuickActionButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
  onPress: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  icon,
  color,
  bgColor,
  onPress
}) => {
  const { colors, isDark } = useTheme();

  const iconColor = color || colors.primary;
  const containerBg = bgColor || (isDark ? colors.surface : colors.primaryTint);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.iconCircle, { backgroundColor: containerBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 78,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
  }
});
