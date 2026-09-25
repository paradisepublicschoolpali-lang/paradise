import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { GalleryItem } from '../types';

interface GalleryScreenProps {
  onSelectImage: (item: GalleryItem) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SPACING = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - 32 - GRID_SPACING) / 2;

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ onSelectImage }) => {
  const { colors, isDark } = useTheme();
  const { gallery } = useSchoolData();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Campus', 'Sports', 'Academics', 'Arts & Culture', 'Celebrations'];

  const filteredGallery = useMemo(() => {
    if (selectedCategory === 'All') return gallery;
    return gallery.filter(item => item.category === selectedCategory);
  }, [gallery, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Campus Gallery" subtitle="Campus life, studios & athletic moments" />

      {/* Category Filter */}
      <View style={[styles.categoryContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
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

      {/* Photo Grid */}
      <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
        {filteredGallery.length > 0 ? (
          <View style={styles.grid}>
            {filteredGallery.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => onSelectImage(item)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`View photo: ${item.title}`}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.cardCategory, { color: colors.primary }]}>
                      {item.category}
                    </Text>
                    <Ionicons name="expand-outline" size={13} color={colors.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="images-outline"
            title="No Photos in Category"
            description="Photographs for this category are being curated."
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
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
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
  gridContent: {
    padding: 16,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_SPACING,
  },
  gridCard: {
    width: COLUMN_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#CBD5E1',
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  }
});
