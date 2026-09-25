import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { ChildSwitcher } from '../components/ChildSwitcher';
import { HomeworkTask, TimetableSlot, ExamResult } from '../types';

export const AcademicsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { activeStudent, homework, timetable, examResults, submitHomework } = useSchoolData();

  const [activeTab, setActiveTab] = useState<'homework' | 'timetable' | 'exams'>('homework');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const handleHomeworkSubmit = (hw: HomeworkTask) => {
    if (hw.isSubmitted) return;
    submitHomework(hw.id);
    const msg = `Homework for "${hw.subject}" marked as submitted to ${hw.teacherName}.`;
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Homework Submitted', msg);
    }
  };

  const handleDownloadReportCard = (exam: ExamResult) => {
    const msg = `Official Digital Report Card for "${exam.examName}" generated and ready. Total: ${exam.totalMarks}/${exam.maxTotal} (${exam.percentage}%).`;
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Report Card', msg);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Academics</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Curriculum, Timetable & Performance
        </Text>
      </View>

      {/* Child Switcher */}
      <ChildSwitcher />

      {/* Sub-Navigation Tabs */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'homework' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('homework')}
        >
          <Ionicons
            name="document-text"
            size={16}
            color={activeTab === 'homework' ? '#FFFFFF' : colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'homework' ? '#FFFFFF' : colors.text }
            ]}
          >
            Homework ({homework.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'timetable' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('timetable')}
        >
          <Ionicons
            name="time"
            size={16}
            color={activeTab === 'timetable' ? '#FFFFFF' : colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'timetable' ? '#FFFFFF' : colors.text }
            ]}
          >
            Timetable
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'exams' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('exams')}
        >
          <Ionicons
            name="ribbon"
            size={16}
            color={activeTab === 'exams' ? '#FFFFFF' : colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'exams' ? '#FFFFFF' : colors.text }
            ]}
          >
            Exams & Marks
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: HOMEWORK */}
        {activeTab === 'homework' && (
          <View style={styles.tabContent}>
            {homework.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                <Ionicons name="checkmark-done-circle" size={48} color={colors.success} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>All Caught Up!</Text>
                <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                  No pending assignments for {activeStudent.name}.
                </Text>
              </View>
            ) : (
              homework.map(hw => (
                <View
                  key={hw.id}
                  style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.badgeSubject, { backgroundColor: colors.primary + '18' }]}>
                      <Text style={[styles.badgeSubjectText, { color: colors.primary }]}>
                        {hw.subject}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.badgeStatus,
                        {
                          backgroundColor: hw.isSubmitted ? '#10B9811A' : '#F59E0B1A',
                          borderColor: hw.isSubmitted ? '#10B981' : '#F59E0B'
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeStatusText,
                          { color: hw.isSubmitted ? '#10B981' : '#D97706' }
                        ]}
                      >
                        {hw.isSubmitted ? 'Submitted' : 'Pending Submission'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.cardTitle, { color: colors.text }]}>{hw.title}</Text>
                  <Text style={[styles.cardDesc, { color: colors.textMuted }]}>{hw.description}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="person-outline" size={14} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.textMuted }]}>{hw.teacherName}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                      <Text style={[styles.metaText, { color: colors.textMuted }]}>Due: {hw.dueDate}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star-outline" size={14} color={colors.accent} />
                      <Text style={[styles.metaText, { color: colors.textMuted }]}>{hw.maxPoints} pts</Text>
                    </View>
                  </View>

                  {!hw.isSubmitted ? (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                      onPress={() => handleHomeworkSubmit(hw)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cloud-upload-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.actionBtnText}>Mark Complete / Submit</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.submittedAck}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.submittedAckText}>Verified submission recorded on cloud</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 2: TIMETABLE */}
        {activeTab === 'timetable' && (
          <View style={styles.tabContent}>
            {/* Day Selector */}
            <View style={styles.daySelector}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: selectedDay === day ? colors.primary : colors.surface,
                      borderColor: selectedDay === day ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      { color: selectedDay === day ? '#FFFFFF' : colors.text }
                    ]}
                  >
                    {day.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {timetable.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Classes Scheduled</Text>
                <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                  Enjoy your free study session!
                </Text>
              </View>
            ) : (
              timetable.map(slot => (
                <View
                  key={slot.id}
                  style={[styles.slotCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={[styles.periodCol, { backgroundColor: colors.primary + '12' }]}>
                    <Text style={[styles.periodNumber, { color: colors.primary }]}>
                      P{slot.periodNumber}
                    </Text>
                    <Text style={[styles.periodTime, { color: colors.textMuted }]}>
                      {slot.startTime}
                    </Text>
                  </View>

                  <View style={styles.slotDetails}>
                    <Text style={[styles.slotSubject, { color: colors.text }]}>{slot.subject}</Text>
                    <View style={styles.slotSubRow}>
                      <View style={styles.slotMeta}>
                        <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                        <Text style={[styles.slotMetaText, { color: colors.textMuted }]}>
                          {slot.teacherName}
                        </Text>
                      </View>
                      <View style={styles.slotMeta}>
                        <Ionicons name="location-outline" size={13} color={colors.accent} />
                        <Text style={[styles.slotMetaText, { color: colors.accent }]}>
                          {slot.room}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* TAB 3: EXAMS & MARKS */}
        {activeTab === 'exams' && (
          <View style={styles.tabContent}>
            {examResults.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Published Exams</Text>
                <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
                  Results will be published by the Examination Directorate once verified.
                </Text>
              </View>
            ) : (
              examResults.map(exam => (
                <View
                  key={exam.id}
                  style={[styles.examCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.examHeader}>
                    <View>
                      <Text style={[styles.examTitle, { color: colors.text }]}>{exam.examName}</Text>
                      <Text style={[styles.examBadgeHonors, { color: colors.primary }]}>
                        {exam.overallGrade} • Rank #{exam.rank || 1}
                      </Text>
                    </View>
                    <View style={[styles.gpaCircle, { backgroundColor: colors.primary }]}>
                      <Text style={styles.gpaScore}>{exam.percentage}%</Text>
                      <Text style={styles.gpaLabel}>Score</Text>
                    </View>
                  </View>

                  {/* Subject Wise Table */}
                  <View style={[styles.tableContainer, { borderColor: colors.border }]}>
                    <View style={[styles.tableHeader, { backgroundColor: colors.background }]}>
                      <Text style={[styles.tableColSubject, styles.tableHeadText, { color: colors.textMuted }]}>
                        SUBJECT
                      </Text>
                      <Text style={[styles.tableColMarks, styles.tableHeadText, { color: colors.textMuted }]}>
                        MARKS
                      </Text>
                      <Text style={[styles.tableColGrade, styles.tableHeadText, { color: colors.textMuted }]}>
                        GRADE
                      </Text>
                    </View>

                    {exam.subjects.map((sub, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.tableRow,
                          { borderBottomColor: colors.border },
                          idx % 2 === 1 && { backgroundColor: colors.background + '50' }
                        ]}
                      >
                        <View style={styles.tableColSubject}>
                          <Text style={[styles.subjectName, { color: colors.text }]}>{sub.subject}</Text>
                          {sub.remarks && (
                            <Text style={[styles.subjectRemarks, { color: colors.textMuted }]}>
                              {sub.remarks}
                            </Text>
                          )}
                        </View>
                        <Text style={[styles.tableColMarks, styles.marksText, { color: colors.text }]}>
                          {sub.marksObtained}/{sub.maxMarks}
                        </Text>
                        <View style={styles.tableColGrade}>
                          <View style={[styles.gradePill, { backgroundColor: colors.primary + '18' }]}>
                            <Text style={[styles.gradeText, { color: colors.primary }]}>
                              {sub.grade}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  {exam.teacherRemarks && (
                    <View style={[styles.remarksBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                      <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
                      <Text style={[styles.remarksText, { color: colors.text }]}>
                        <Text style={{ fontWeight: '700' }}>Faculty Evaluation: </Text>
                        {exam.teacherRemarks}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.downloadBtn, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                    onPress={() => handleDownloadReportCard(exam)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="download-outline" size={18} color={colors.primary} />
                    <Text style={[styles.downloadBtnText, { color: colors.primary }]}>
                      Download Official CBSE Marksheet
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
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
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 12,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeSubject: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSubjectText: {
    fontSize: 11.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  submittedAck: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  submittedAckText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  slotCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  periodCol: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  periodNumber: {
    fontSize: 18,
    fontWeight: '900',
  },
  periodTime: {
    fontSize: 10,
    marginTop: 2,
  },
  slotDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  slotSubject: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  slotSubRow: {
    flexDirection: 'row',
    gap: 16,
  },
  slotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slotMetaText: {
    fontSize: 12,
  },
  examCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  examBadgeHonors: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  gpaCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpaScore: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  gpaLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tableContainer: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeadText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableColSubject: {
    flex: 2,
  },
  tableColMarks: {
    flex: 1,
    textAlign: 'center',
  },
  tableColGrade: {
    flex: 1,
    alignItems: 'flex-end',
  },
  subjectName: {
    fontSize: 13,
    fontWeight: '600',
  },
  subjectRemarks: {
    fontSize: 11,
    marginTop: 1,
  },
  marksText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gradePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gradeText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  remarksBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  remarksText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 8,
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: '700',
  }
});
