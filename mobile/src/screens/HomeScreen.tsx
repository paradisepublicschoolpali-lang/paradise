import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { SectionHeader } from '../components/SectionHeader';
import { ChildSwitcher } from '../components/ChildSwitcher';
import { NoticeCard } from '../components/NoticeCard';
import { EventCard } from '../components/EventCard';
import { RootTab, MoreSubScreen, Notice, SchoolEvent } from '../types';
import { linkingService } from '../services/linkingService';

interface HomeScreenProps {
  onNavigateTab: (tab: RootTab) => void;
  onNavigateMore: (sub: MoreSubScreen) => void;
  onSelectNotice: (notice: Notice) => void;
  onSelectEvent: (event: SchoolEvent) => void;
  onOpenAdmissionForm: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onNavigateMore,
  onSelectNotice,
  onSelectEvent,
  onOpenAdmissionForm
}) => {
  const { colors } = useTheme();
  const {
    config,
    notices,
    events,
    isLoading,
    refreshData,
    rsvpEvent,
    activeStudent,
    homework,
    timetable,
    fees
  } = useSchoolData();

  const pinnedNotice = notices.find(n => n.isPinned) || notices[0];
  const recentNotices = notices.slice(0, 2);
  const upcomingEvents = events.filter(e => e.isUpcoming).slice(0, 2);

  const pendingHw = homework.filter(h => !h.isSubmitted).length;
  const firstSlot = timetable[0];
  const pendingFee = fees.find(f => f.status === 'Pending');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
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
        {/* Child Selector */}
        <ChildSwitcher />

        {/* Student Quick Status Card */}
        <View style={[styles.studentSnapshotCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.snapshotTop}>
            <View>
              <Text style={[styles.snapshotGreeting, { color: colors.textMuted }]}>
                STUDENT DASHBOARD
              </Text>
              <Text style={[styles.snapshotName, { color: colors.text }]}>
                {activeStudent.name}
              </Text>
              <Text style={[styles.snapshotClass, { color: colors.textMuted }]}>
                {activeStudent.grade} - Section {activeStudent.section} • Roll No: {activeStudent.rollNo}
              </Text>
            </View>
            <View style={styles.attendanceBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.attendanceBadgeText}>TODAY PRESENT</Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.snapshotStatsBar, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.snapshotStatCol}
              onPress={() => onNavigateTab('attendance')}
            >
              <Text style={[styles.statValue, { color: colors.primary }]}>{activeStudent.attendanceRate}%</Text>
              <Text style={[styles.statTitle, { color: colors.textMuted }]}>Attendance</Text>
            </TouchableOpacity>

            <View style={styles.statSeparator} />

            <TouchableOpacity
              style={styles.snapshotStatCol}
              onPress={() => onNavigateTab('academics')}
            >
              <Text style={[styles.statValue, { color: pendingHw > 0 ? '#D97706' : '#10B981' }]}>
                {pendingHw} Due
              </Text>
              <Text style={[styles.statTitle, { color: colors.textMuted }]}>Homework</Text>
            </TouchableOpacity>

            <View style={styles.statSeparator} />

            <TouchableOpacity
              style={styles.snapshotStatCol}
              onPress={() => onNavigateMore('fees')}
            >
              <Text style={[styles.statValue, { color: pendingFee ? '#EF4444' : '#10B981' }]}>
                {pendingFee ? 'Pending' : 'Cleared'}
              </Text>
              <Text style={[styles.statTitle, { color: colors.textMuted }]}>Fees</Text>
            </TouchableOpacity>
          </View>

          {/* Next Period Glance */}
          {firstSlot && (
            <View style={styles.nextPeriodGlance}>
              <Ionicons name="time-outline" size={15} color={colors.primary} />
              <Text style={[styles.nextPeriodText, { color: colors.text }]}>
                <Text style={{ fontWeight: '700' }}>Next Class: </Text>
                {firstSlot.subject} ({firstSlot.startTime}) • {firstSlot.room}
              </Text>
            </View>
          )}
        </View>

        {/* 4 Quick ERP Module Launchers */}
        <View style={styles.erpGrid}>
          <TouchableOpacity
            style={[styles.erpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onNavigateTab('academics')}
            activeOpacity={0.8}
          >
            <View style={[styles.erpIconWrap, { backgroundColor: '#1E3A8A18' }]}>
              <Ionicons name="book" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.erpTitle, { color: colors.text }]}>Academics</Text>
            <Text style={[styles.erpSubtitle, { color: colors.textMuted }]}>Homework & Marks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.erpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onNavigateTab('attendance')}
            activeOpacity={0.8}
          >
            <View style={[styles.erpIconWrap, { backgroundColor: '#10B98118' }]}>
              <Ionicons name="calendar" size={20} color="#10B981" />
            </View>
            <Text style={[styles.erpTitle, { color: colors.text }]}>Attendance</Text>
            <Text style={[styles.erpSubtitle, { color: colors.textMuted }]}>Log & Leave Apply</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.erpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onNavigateTab('communication')}
            activeOpacity={0.8}
          >
            <View style={[styles.erpIconWrap, { backgroundColor: '#D9770618' }]}>
              <Ionicons name="chatbubbles" size={20} color="#D97706" />
            </View>
            <Text style={[styles.erpTitle, { color: colors.text }]}>Connect</Text>
            <Text style={[styles.erpSubtitle, { color: colors.textMuted }]}>Notices & Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.erpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onNavigateMore('fees')}
            activeOpacity={0.8}
          >
            <View style={[styles.erpIconWrap, { backgroundColor: '#7C3AED18' }]}>
              <Ionicons name="card" size={20} color="#7C3AED" />
            </View>
            <Text style={[styles.erpTitle, { color: colors.text }]}>Fee Desk</Text>
            <Text style={[styles.erpSubtitle, { color: colors.textMuted }]}>Invoices & UPI</Text>
          </TouchableOpacity>
        </View>

        {/* Important Announcement Banner */}
        {pinnedNotice ? (
          <TouchableOpacity
            style={[styles.announcementBanner, { backgroundColor: colors.primaryTint, borderColor: colors.primaryLight }]}
            onPress={() => onSelectNotice(pinnedNotice)}
            activeOpacity={0.8}
          >
            <View style={[styles.announcementIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="megaphone" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.announcementCol}>
              <View style={styles.announcementHeader}>
                <Text style={[styles.announcementTag, { color: colors.primary }]}>Official Circular</Text>
                <Text style={[styles.announcementDate, { color: colors.textMuted }]}>{pinnedNotice.date}</Text>
              </View>
              <Text style={[styles.announcementTitle, { color: colors.text }]} numberOfLines={1}>
                {pinnedNotice.title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        ) : null}

        {/* Latest Notices */}
        <SectionHeader
          title="Campus Circulars & Directives"
          subtitle="Official institutional updates"
          actionText="View all"
          onAction={() => onNavigateTab('communication')}
        />
        {recentNotices.map(notice => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onPress={() => onSelectNotice(notice)}
          />
        ))}

        {/* Upcoming Events */}
        <SectionHeader
          title="Upcoming Campus Calendar"
          subtitle="Sports, galas, and olympiads"
          actionText="View all"
          onAction={() => onNavigateTab('communication')}
        />
        {upcomingEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => onSelectEvent(event)}
            onRsvp={() => rsvpEvent(event.id)}
          />
        ))}

        {/* Admissions CTA Banner */}
        <View style={[styles.admissionCta, { backgroundColor: colors.primary }]}>
          <View style={styles.admissionCtaText}>
            <Text style={styles.admissionCtaBadge}>SESSION {config.academicYear}</Text>
            <Text style={styles.admissionCtaTitle}>Enroll Your Child Today</Text>
            <Text style={styles.admissionCtaSubtitle}>
              Applications open for Nursery to Class 8. Experience balanced holistic learning in Pali.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.admissionCtaBtn}
            onPress={onOpenAdmissionForm}
            activeOpacity={0.85}
          >
            <Text style={styles.admissionCtaBtnText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={15} color="#1E3A8A" />
          </TouchableOpacity>
        </View>

        {/* Quick Contact Footer Bar */}
        <View style={[styles.contactBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.contactBarInfo}>
            <Text style={[styles.contactBarTitle, { color: colors.text }]}>Paradise Public School</Text>
            <Text style={[styles.contactBarAddress, { color: colors.textMuted }]} numberOfLines={2}>
              {config.address}
            </Text>
          </View>
          <View style={styles.contactBarActions}>
            <TouchableOpacity
              style={[styles.contactIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => linkingService.openPhone(config.contactPhone)}
            >
              <Ionicons name="call" size={17} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => linkingService.openEmail(config.contactEmail)}
            >
              <Ionicons name="mail" size={17} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => linkingService.openMap()}
            >
              <Ionicons name="navigate" size={17} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  studentSnapshotCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  snapshotTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  snapshotGreeting: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  snapshotName: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  snapshotClass: {
    fontSize: 12,
    marginTop: 2,
  },
  attendanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98118',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  attendanceBadgeText: {
    color: '#065F46',
    fontSize: 10,
    fontWeight: '800',
  },
  snapshotStatsBar: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    marginBottom: 10,
  },
  snapshotStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statTitle: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 2,
  },
  statSeparator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(150,150,150,0.25)',
  },
  nextPeriodGlance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
  },
  nextPeriodText: {
    fontSize: 12,
  },
  erpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginBottom: 14,
    gap: 8,
  },
  erpCard: {
    width: '48.5%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  erpIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  erpTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  erpSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  announcementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  announcementIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementCol: {
    flex: 1,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  announcementTag: {
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  announcementDate: {
    fontSize: 10,
  },
  announcementTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  admissionCta: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  admissionCtaText: {
    flex: 1,
    paddingRight: 10,
  },
  admissionCtaBadge: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  admissionCtaTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  admissionCtaSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11.5,
    lineHeight: 16,
  },
  admissionCtaBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  admissionCtaBtnText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '800',
  },
  contactBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactBarInfo: {
    flex: 1,
    paddingRight: 10,
  },
  contactBarTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  contactBarAddress: {
    fontSize: 11,
    marginTop: 2,
  },
  contactBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
