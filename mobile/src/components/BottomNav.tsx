import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { RootTab } from '../types';

interface BottomNavProps {
  activeTab: RootTab;
  onTabChange: (tab: RootTab) => void;
  noticeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  noticeCount = 3
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs: {
    id: RootTab;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'academics', label: 'Academics', icon: 'book-outline', activeIcon: 'book' },
    { id: 'attendance', label: 'Attendance', icon: 'calendar-outline', activeIcon: 'calendar' },
    { id: 'communication', label: 'Connect', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', badge: noticeCount },
    { id: 'more', label: 'More', icon: 'grid-outline', activeIcon: 'grid' }
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, 8),
        }
      ]}
    >
      <View style={styles.tabRow}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={styles.tabButton}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={22}
                  color={isActive ? colors.tabBarActive : colors.tabBarInactive}
                />
                {tab.badge && tab.badge > 0 ? (
                  <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.tabBarActive : colors.tabBarInactive,
                    fontWeight: isActive ? '700' : '500',
                  }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconWrapper: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  }
});
