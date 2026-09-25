import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';

interface FacilitiesScreenProps {
  onBack: () => void;
}

export const FacilitiesScreen: React.FC<FacilitiesScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { facilities } = useSchoolData();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Campus Facilities"
        subtitle="Infrastructure, labs & athletics"
        showBack
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {facilities.map(item => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <View style={styles.titleRow}>
                <View style={[styles.iconBox, { backgroundColor: colors.primaryTint }]}>
                  <Ionicons name={item.iconName as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.titleCol}>
                  <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.subtitle, { color: colors.accent }]}>{item.subtitle}</Text>
                </View>
              </View>

              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {item.description}
              </Text>

              <View style={[styles.featuresBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Text style={[styles.featuresHeading, { color: colors.text }]}>Key Highlights</Text>
                {item.features.map((feat, idx) => (
                  <View key={idx} style={styles.featRow}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                    <Text style={[styles.featText, { color: colors.textSecondary }]}>{feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#CBD5E1',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  featuresBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  featuresHeading: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  featText: {
    fontSize: 12,
  }
});
