import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { NoticeCard } from '../components/NoticeCard';
import { EmptyState } from '../components/EmptyState';
import { Notice } from '../types';

interface NoticesScreenProps {
  onSelectNotice: (notice: Notice) => void;
}

export const NoticesScreen: React.FC<NoticesScreenProps> = ({ onSelectNotice }) => {
  const { colors, isDark } = useTheme();
  const { notices, isLoading, refreshData } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Examination', 'Sports', 'Academic', 'Holiday', 'Urgent'];

  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [notices, selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Notice Board" subtitle="Official circulars, timetables & directives" />

      {/* Search Input Bar */}
      <View style={[styles.searchBarContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="search" size={17} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search circulars, exams, holidays..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Horizontal Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(cat)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary }
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Notices List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshData}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {filteredNotices.length > 0 ? (
          filteredNotices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onPress={() => onSelectNotice(notice)}
            />
          ))
        ) : (
          <EmptyState
            icon="newspaper-outline"
            title="No Notices Found"
            description={
              searchQuery
                ? `No circulars match "${searchQuery}". Try a different keyword.`
                : 'There are no notices published in this category at this moment.'
            }
            actionText={searchQuery ? 'Clear Search' : undefined}
            onAction={searchQuery ? () => setSearchQuery('') : undefined}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  }
});
