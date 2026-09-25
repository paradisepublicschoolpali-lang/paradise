import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { ADMISSION_STEPS, REQUIRED_DOCUMENTS } from '../data/schoolData';
import { linkingService } from '../services/linkingService';

interface AdmissionsScreenProps {
  onBack: () => void;
  onOpenApplyForm: () => void;
}

export const AdmissionsScreen: React.FC<AdmissionsScreenProps> = ({
  onBack,
  onOpenApplyForm
}) => {
  const { colors, isDark } = useTheme();
  const { config } = useSchoolData();

  const eligibility = [
    { grade: 'Nursery', age: '3+ Years as on March 31st', criteria: 'Informal child interaction' },
    { grade: 'LKG / UKG', age: '4+ / 5+ Years', criteria: 'Basic alphabet & counting readiness' },
    { grade: 'Class 1 to 5', age: '6+ Years onwards', criteria: 'Previous class report card & interaction' },
    { grade: 'Class 6 to 8', age: '11+ Years onwards', criteria: 'Written aptitude assessment & TC' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Admissions 2026-27"
        subtitle="Nursery to Class 8 enrollment guidelines"
        showBack
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner with Apply CTA */}
        <View style={[styles.bannerCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.bannerTag}>ACADEMIC SESSION {config.academicYear}</Text>
          <Text style={styles.bannerTitle}>Admissions Open for Nursery to Class 8</Text>
          <Text style={styles.bannerSub}>
            Join our nurturing co-educational campus in Pali, Rajasthan.
          </Text>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={onOpenApplyForm}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Open application form"
          >
            <Ionicons name="document-text" size={17} color="#1E3A8A" />
            <Text style={styles.applyBtnText}>Fill Online Application Form</Text>
          </TouchableOpacity>
        </View>

        {/* 4-Step Process */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>STEP-BY-STEP GUIDE</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Admission Procedure</Text>

          {ADMISSION_STEPS.map((s, idx) => (
            <View key={idx} style={[styles.stepItem, { borderBottomColor: colors.borderLight }]}>
              <View style={[styles.stepBadge, { backgroundColor: colors.primaryTint }]}>
                <Text style={[styles.stepBadgeText, { color: colors.primary }]}>{s.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>{s.title}</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Age & Eligibility Table */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>AGE REQUIREMENTS</Text>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
            Eligibility Matrix
          </Text>

          {eligibility.map((item, idx) => (
            <View key={idx} style={[styles.eligibilityRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.eligibilityHeader}>
                <Text style={[styles.gradeName, { color: colors.primary }]}>{item.grade}</Text>
                <Text style={[styles.ageReq, { color: colors.textSecondary }]}>{item.age}</Text>
              </View>
              <Text style={[styles.criteriaText, { color: colors.textMuted }]}>
                Admission Criteria: {item.criteria}
              </Text>
            </View>
          ))}
        </View>

        {/* Required Documents Checklist */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>DOCUMENTATION</Text>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
            Required Documents Checklist
          </Text>

          {REQUIRED_DOCUMENTS.map((doc, idx) => (
            <View key={idx} style={styles.docRow}>
              <Ionicons name="checkmark-circle" size={17} color={colors.success} />
              <Text style={[styles.docText, { color: colors.text }]}>{doc}</Text>
            </View>
          ))}
        </View>

        {/* Admissions Help Desk */}
        <View style={[styles.helpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="headset-outline" size={24} color={colors.primary} />
          <View style={styles.helpInfo}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>Admissions Bureau Helpline</Text>
            <Text style={[styles.helpSub, { color: colors.textSecondary }]}>
              Have questions regarding fee structure, bus routes, or syllabus?
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.callBtn, { backgroundColor: colors.primary }]}
            onPress={() => linkingService.openPhone(config.contactPhone)}
            accessibilityRole="button"
            accessibilityLabel="Call Admissions Helpline"
          >
            <Ionicons name="call" size={14} color="#FFFFFF" />
            <Text style={styles.callBtnText}>Call Office</Text>
          </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 36,
  },
  bannerCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  bannerTag: {
    color: '#FCD34D',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 4,
  },
  bannerSub: {
    color: '#DBEAFE',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 16,
  },
  applyBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  applyBtnText: {
    color: '#1E3A8A',
    fontSize: 13.5,
    fontWeight: '700',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  sectionBadge: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  eligibilityRow: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  eligibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  gradeName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  ageReq: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  criteriaText: {
    fontSize: 11.5,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  docText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  helpSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  }
});
