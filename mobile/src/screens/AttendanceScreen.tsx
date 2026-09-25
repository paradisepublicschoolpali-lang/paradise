import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { ChildSwitcher } from '../components/ChildSwitcher';

export const AttendanceScreen: React.FC = () => {
  const { colors } = useTheme();
  const { activeStudent, attendance, leaveRequests, submitLeaveRequest } = useSchoolData();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-02');
  const [reason, setReason] = useState('');

  // Calculate statistics
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;

  const handleApplyLeave = () => {
    if (!reason.trim()) {
      const msg = 'Please enter a clear reason for the leave application.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Missing Reason', msg);
      return;
    }

    submitLeaveRequest(fromDate, toDate, reason);
    setShowLeaveModal(false);
    setReason('');

    const successMsg = `Leave application for ${fromDate} to ${toDate} submitted to class teacher.`;
    if (Platform.OS === 'web') alert(successMsg);
    else Alert.alert('Submitted', successMsg);
  };

  const studentLeaves = leaveRequests.filter(l => l.studentId === activeStudent.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendance & Leaves</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Daily Registry & Official Absence Requests
        </Text>
      </View>

      {/* Child Switcher */}
      <ChildSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryStudent}>{activeStudent.name}</Text>
              <Text style={styles.summaryClass}>
                {activeStudent.grade} - Sec {activeStudent.section} (Roll: {activeStudent.rollNo})
              </Text>
            </View>
            <View style={styles.todayPill}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.todayPillText}>TODAY: PRESENT</Text>
            </View>
          </View>

          <View style={styles.rateRow}>
            <View>
              <Text style={styles.rateValue}>{activeStudent.attendanceRate}%</Text>
              <Text style={styles.rateLabel}>Total Cumulative Rate</Text>
            </View>
            <TouchableOpacity
              style={styles.applyLeaveBtn}
              onPress={() => setShowLeaveModal(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={18} color={colors.primary} />
              <Text style={[styles.applyLeaveText, { color: colors.primary }]}>Apply Leave</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>{presentCount}</Text>
              <Text style={styles.metricLabel}>Present</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: '#F87171' }]}>{absentCount}</Text>
              <Text style={styles.metricLabel}>Absent</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricNumber, { color: '#FBBF24' }]}>{lateCount}</Text>
              <Text style={styles.metricLabel}>Late</Text>
            </View>
          </View>
        </View>

        {/* Leave Applications History */}
        {studentLeaves.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Leave Applications</Text>
            {studentLeaves.map(leave => (
              <View
                key={leave.id}
                style={[styles.leaveCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.leaveHeader}>
                  <View style={styles.leaveDates}>
                    <Ionicons name="calendar-outline" size={15} color={colors.primary} />
                    <Text style={[styles.leaveDatesText, { color: colors.text }]}>
                      {leave.fromDate} {leave.fromDate !== leave.toDate ? `to ${leave.toDate}` : ''}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          leave.status === 'Approved'
                            ? '#10B9811A'
                            : leave.status === 'Rejected'
                            ? '#EF44441A'
                            : '#F59E0B1A',
                        borderColor:
                          leave.status === 'Approved'
                            ? '#10B981'
                            : leave.status === 'Rejected'
                            ? '#EF4444'
                            : '#F59E0B'
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            leave.status === 'Approved'
                              ? '#10B981'
                              : leave.status === 'Rejected'
                              ? '#EF4444'
                              : '#D97706'
                        }
                      ]}
                    >
                      {leave.status}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.leaveReason, { color: colors.textMuted }]}>{leave.reason}</Text>
                <Text style={[styles.leaveAppliedDate, { color: colors.textMuted }]}>
                  Submitted on {leave.appliedDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Daily Attendance History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Log Entries</Text>
          {attendance.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.surface }]}>
              <Text style={{ color: colors.textMuted }}>No log entries recorded yet.</Text>
            </View>
          ) : (
            attendance.map(item => {
              const isPresent = item.status === 'Present';
              const isLate = item.status === 'Late';
              const isAbsent = item.status === 'Absent';

              const badgeBg = isPresent ? '#10B98118' : isLate ? '#F59E0B18' : '#EF444418';
              const badgeColor = isPresent ? '#10B981' : isLate ? '#D97706' : '#EF4444';
              const badgeIcon = isPresent
                ? 'checkmark-circle'
                : isLate
                ? 'time'
                : 'close-circle';

              return (
                <View
                  key={item.id}
                  style={[styles.historyRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.historyLeft}>
                    <View style={[styles.historyStatusPill, { backgroundColor: badgeBg }]}>
                      <Ionicons name={badgeIcon as any} size={15} color={badgeColor} />
                      <Text style={[styles.historyStatusText, { color: badgeColor }]}>{item.status}</Text>
                    </View>
                    <View style={styles.dateBlock}>
                      <Text style={[styles.historyDate, { color: colors.text }]}>{item.date}</Text>
                      <Text style={[styles.historyTeacher, { color: colors.textMuted }]}>
                        Verified by {item.recordedBy}
                      </Text>
                    </View>
                  </View>

                  {item.remarks && (
                    <View style={[styles.remarksBadge, { backgroundColor: colors.background }]}>
                      <Text style={[styles.remarksText, { color: colors.textMuted }]} numberOfLines={1}>
                        {item.remarks}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Leave Application Modal */}
      <Modal
        visible={showLeaveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Apply for Student Leave</Text>
              <TouchableOpacity onPress={() => setShowLeaveModal(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>From Date (YYYY-MM-DD)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={fromDate}
              onChangeText={setFromDate}
              placeholder="2026-09-01"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>To Date (YYYY-MM-DD)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={toDate}
              onChangeText={setToDate}
              placeholder="2026-09-02"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>Reason for Absence</Text>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }
              ]}
              value={reason}
              onChangeText={setReason}
              placeholder="e.g., Medical treatment, Family emergency, Out of town..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={() => setShowLeaveModal(false)}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleApplyLeave}
              >
                <Text style={styles.submitBtnText}>Submit to Principal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  summaryStudent: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  summaryClass: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  todayPillText: {
    color: '#065F46',
    fontSize: 10.5,
    fontWeight: '800',
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  rateValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  rateLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  applyLeaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  applyLeaveText: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  leaveCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  leaveDates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaveDatesText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  leaveReason: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 4,
  },
  leaveAppliedDate: {
    fontSize: 10.5,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    width: 82,
    justifyContent: 'center',
  },
  historyStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dateBlock: {},
  historyDate: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  historyTeacher: {
    fontSize: 11,
    marginTop: 1,
  },
  remarksBadge: {
    maxWidth: 120,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  remarksText: {
    fontSize: 11,
  },
  emptyBox: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  }
});
