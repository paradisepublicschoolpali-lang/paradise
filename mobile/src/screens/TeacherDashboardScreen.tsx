import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSchoolData } from '../context/SchoolDataContext';

export const TeacherDashboardScreen: React.FC = () => {
  const { colors } = useTheme();
  const { currentUser, logout } = useAuth();
  const { notices, students } = useSchoolData();

  const [markedPeriods, setMarkedPeriods] = useState<Record<string, boolean>>({
    'p1': true
  });

  const togglePeriodAttendance = (periodId: string) => {
    setMarkedPeriods(prev => ({
      ...prev,
      [periodId]: !prev[periodId]
    }));
    Alert.alert('Attendance Updated', 'Class attendance records saved successfully.');
  };

  const schedule = [
    { id: 'p1', period: 'Period 1', time: '08:30 - 09:15 AM', class: 'Class 8-A', subject: 'Science (Physics)', room: 'Science Lab 2', count: 38 },
    { id: 'p2', period: 'Period 2', time: '09:20 - 10:05 AM', class: 'Class 8-B', subject: 'Science (Physics)', room: 'Room 204', count: 36 },
    { id: 'p4', period: 'Period 4', time: '11:00 - 11:45 AM', class: 'Class 7-A', subject: 'General Science', room: 'Room 105', count: 40 },
    { id: 'p6', period: 'Period 6', time: '01:00 - 01:45 PM', class: 'Class 6-B', subject: 'Junior Science Lab', room: 'Science Lab 1', count: 35 },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Teacher Profile Card */}
      <View style={[styles.teacherCard, { backgroundColor: '#064E3B', borderColor: '#047857' }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatarCircle, { backgroundColor: '#059669' }]}>
            <Ionicons name="school" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.teacherName}>{currentUser.name}</Text>
            <Text style={styles.teacherDesignation}>{currentUser.designation || 'Head of Department - Sciences'}</Text>
            <Text style={styles.teacherGradeBadge}>{currentUser.grade || 'Class Teacher: Class 8-A'}</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>Today's Classes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>149</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>95.2%</Text>
            <Text style={styles.statLabel}>Avg Attendance</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Teacher Quick Actions</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Class Attendance', 'Opening Roll Call for Class 8-A (38 Students)...')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkbox-outline" size={22} color="#059669" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Mark Attendance</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Class 8-A Roll Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('New Homework', 'Create a new homework task for Class 8-A/7-A')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="book-outline" size={22} color="#2563EB" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Assign Homework</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Add Tasks & Due Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Exam Results', 'Open Exam Marks Ledger')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="ribbon-outline" size={22} color="#D97706" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Enter Marks</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Unit Test & Term Exam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Broadcast Message', 'Send SMS/App Alert to Class 8-A Parents')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="megaphone-outline" size={22} color="#7C3AED" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Class Notice</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Broadcast to Parents</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Teaching Schedule */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Class Schedule</Text>
      <View style={styles.scheduleList}>
        {schedule.map((slot) => {
          const isMarked = markedPeriods[slot.id];
          return (
            <View
              key={slot.id}
              style={[styles.slotCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.slotTop}>
                <View style={styles.periodTag}>
                  <Text style={styles.periodTagText}>{slot.period}</Text>
                </View>
                <Text style={[styles.slotTime, { color: colors.textSecondary }]}>
                  <Ionicons name="time-outline" size={13} /> {slot.time}
                </Text>
              </View>

              <View style={styles.slotBody}>
                <Text style={[styles.slotClass, { color: colors.text }]}>{slot.class}</Text>
                <Text style={[styles.slotSubject, { color: colors.primary }]}>{slot.subject}</Text>
                <Text style={[styles.slotRoom, { color: colors.textMuted }]}>
                  <Ionicons name="location-outline" size={12} /> {slot.room} • {slot.count} Students
                </Text>
              </View>

              <View style={styles.slotFooter}>
                <TouchableOpacity
                  style={[
                    styles.attendanceBtn,
                    { backgroundColor: isMarked ? '#ECFDF5' : colors.primaryTint }
                  ]}
                  onPress={() => togglePeriodAttendance(slot.id)}
                >
                  <Ionicons
                    name={isMarked ? 'checkmark-circle' : 'finger-print-outline'}
                    size={15}
                    color={isMarked ? '#059669' : colors.primary}
                  />
                  <Text
                    style={[
                      styles.attendanceBtnText,
                      { color: isMarked ? '#059669' : colors.primary }
                    ]}
                  >
                    {isMarked ? 'Attendance Recorded' : 'Mark Attendance'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Pending Grading Submissions */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Homework Reviews</Text>
      <View style={[styles.pendingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.pendingHeader}>
          <Text style={[styles.pendingTitle, { color: colors.text }]}>Class 8-A • Science</Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>28 / 38 Submitted</Text>
          </View>
        </View>
        <Text style={[styles.pendingDesc, { color: colors.textSecondary }]}>
          "Chapter 4: Cell Structure & Microorganisms" — 10 submissions awaiting evaluation and remarks.
        </Text>
        <TouchableOpacity
          style={[styles.gradeActionBtn, { backgroundColor: '#059669' }]}
          onPress={() => Alert.alert('Homework Grading', 'Opening Class 8-A submission list...')}
        >
          <Text style={styles.gradeActionBtnText}>Review Submissions</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  teacherCard: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMeta: {
    flex: 1,
  },
  teacherName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  teacherDesignation: {
    color: '#A7F3D0',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  teacherGradeBadge: {
    color: '#FDE047',
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNum: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: '#D1FAE5',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionSub: {
    fontSize: 11,
    marginTop: 2,
  },
  scheduleList: {
    gap: 10,
    marginBottom: 20,
  },
  slotCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  slotTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  periodTag: {
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  periodTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  slotTime: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  slotBody: {
    marginBottom: 10,
  },
  slotClass: {
    fontSize: 15,
    fontWeight: '700',
  },
  slotSubject: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  slotRoom: {
    fontSize: 11.5,
    marginTop: 4,
  },
  slotFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  attendanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 8,
  },
  attendanceBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pendingCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingBadgeText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },
  pendingDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  gradeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  gradeActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  }
});
