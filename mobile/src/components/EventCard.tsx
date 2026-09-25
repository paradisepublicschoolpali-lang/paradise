import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SchoolEvent } from '../types';
import { useTheme } from '../context/ThemeContext';

interface EventCardProps {
  event: SchoolEvent;
  onPress: () => void;
  onRsvp?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, onRsvp }) => {
  const { colors } = useTheme();

  const dateObj = new Date(event.date);
  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = dateObj.getDate() || '18';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable onPress={onPress} style={styles.imageContainer}>
        <Image
          source={{ uri: event.coverImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        <View style={styles.datePill}>
          <Text style={styles.dateDay}>{dayStr}</Text>
          <Text style={styles.dateMonth}>{monthStr}</Text>
        </View>
      </Pressable>

      <View style={styles.content}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {event.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              {event.time}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]} numberOfLines={1}>
              {event.venue}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.rsvpRow}>
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={[styles.rsvpCount, { color: colors.textMuted }]}>
              {event.rsvpCount} Attending
            </Text>
          </View>

          {onRsvp ? (
            <TouchableOpacity
              style={[styles.rsvpBtn, { backgroundColor: colors.primaryTint }]}
              onPress={onRsvp}
              accessibilityRole="button"
              accessibilityLabel="RSVP for event"
            >
              <Text style={[styles.rsvpBtnText, { color: colors.primary }]}>I'm Attending</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  datePill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  dateDay: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
    lineHeight: 18,
  },
  dateMonth: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rsvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rsvpCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  rsvpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rsvpBtnText: {
    fontSize: 12,
    fontWeight: '700',
  }
});
