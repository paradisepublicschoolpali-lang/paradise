import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notice } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NoticeCardProps {
  notice: Notice;
  onPress: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
  const { colors, isDark } = useTheme();

  const getCategoryColor = (cat: Notice['category']) => {
    switch (cat) {
      case 'Examination':
        return { bg: isDark ? '#1E293B' : '#EFF6FF', text: '#2563EB' };
      case 'Urgent':
        return { bg: isDark ? '#3E1B1B' : '#FEE2E2', text: '#DC2626' };
      case 'Holiday':
        return { bg: isDark ? '#3D2A18' : '#FEF3C7', text: '#D97706' };
      case 'Sports':
        return { bg: isDark ? '#143825' : '#DCFCE7', text: '#16A34A' };
      default:
        return { bg: isDark ? '#1E293B' : '#F1F5F9', text: colors.primary };
    }
  };

  const badgeStyle = getCategoryColor(notice.category);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: notice.isPinned ? colors.primaryLight : colors.border,
          borderWidth: notice.isPinned ? 1.5 : 1,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Notice: ${notice.title}`}
    >
      <View style={styles.topRow}>
        <View style={[styles.categoryBadge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.categoryText, { color: badgeStyle.text }]}>
            {notice.category}
          </Text>
        </View>

        <View style={styles.dateRow}>
          {notice.isPinned ? (
            <View style={[styles.pinnedBadge, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="pin" size={11} color={colors.accent} />
              <Text style={[styles.pinnedText, { color: colors.accent }]}>Pinned</Text>
            </View>
          ) : null}
          <Text style={[styles.dateText, { color: colors.textMuted }]}>{notice.date}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {notice.title}
      </Text>

      <Text style={[styles.snippet, { color: colors.textSecondary }]} numberOfLines={2}>
        {notice.content}
      </Text>

      <View style={[styles.bottomRow, { borderTopColor: colors.borderLight }]}>
        <View style={styles.authorBadge}>
          <Ionicons name="person-circle-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.authorText, { color: colors.textSecondary }]}>
            {notice.author}
          </Text>
        </View>

        {notice.pdfUrl ? (
          <View style={[styles.pdfBadge, { backgroundColor: colors.primaryTint }]}>
            <Ionicons name="document-text" size={12} color={colors.primary} />
            <Text style={[styles.pdfText, { color: colors.primary }]}>Document</Text>
          </View>
        ) : (
          <View style={styles.arrowRow}>
            <Text style={[styles.readMore, { color: colors.primary }]}>Read</Text>
            <Ionicons name="chevron-forward" size={13} color={colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
  },
  snippet: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorText: {
    fontSize: 11,
    fontWeight: '500',
  },
  pdfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pdfText: {
    fontSize: 11,
    fontWeight: '600',
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readMore: {
    fontSize: 11.5,
    fontWeight: '600',
  }
});
