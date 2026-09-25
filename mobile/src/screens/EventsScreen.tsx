import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';
import { SchoolEvent } from '../types';

interface EventsScreenProps {
  onSelectEvent: (event: SchoolEvent) => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ onSelectEvent }) => {
  const { colors, isDark } = useTheme();
  const { events, isLoading, refreshData, rsvpEvent } = useSchoolData();

  const [activeSegment, setActiveSegment] = useState<'upcoming' | 'past'>('upcoming');

  const filteredEvents = useMemo(() => {
    return events.filter(e => (activeSegment === 'upcoming' ? e.isUpcoming : !e.isUpcoming));
  }, [events, activeSegment]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="School Events" subtitle="Academic, sports & cultural calendar" />

      {/* Segmented Switcher */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.segmentWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              { backgroundColor: activeSegment === 'upcoming' ? colors.primary : 'transparent' }
            ]}
            onPress={() => setActiveSegment('upcoming')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeSegment === 'upcoming' }}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeSegment === 'upcoming' ? '#FFFFFF' : colors.textSecondary }
              ]}
            >
              Upcoming ({events.filter(e => e.isUpcoming).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              { backgroundColor: activeSegment === 'past' ? colors.primary : 'transparent' }
            ]}
            onPress={() => setActiveSegment('past')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeSegment === 'past' }}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeSegment === 'past' ? '#FFFFFF' : colors.textSecondary }
              ]}
            >
              Previous Events
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
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
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => onSelectEvent(event)}
              onRsvp={() => rsvpEvent(event.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="calendar-outline"
            title={activeSegment === 'upcoming' ? 'No Upcoming Events' : 'No Previous Events'}
            description={
              activeSegment === 'upcoming'
                ? 'Check back soon for upcoming athletic meets, Olympiads, and celebrations.'
                : 'Archived events will appear here after conclusion.'
            }
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
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  segmentWrapper: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  }
});
