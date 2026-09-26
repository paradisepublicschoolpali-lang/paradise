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

interface AdminDashboardScreenProps {
  onOpenCustomization?: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onOpenCustomization }) => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const { notices } = useSchoolData();

  const handleBroadcastAlert = () => {
    Alert.alert(
      'Issue School Circular',
      'Select audience to broadcast announcement:',
      [
        { text: 'All Parents & Students', onPress: () => Alert.alert('Sent', 'Circular dispatched via App & SMS.') },
        { text: 'Teaching Staff Only', onPress: () => Alert.alert('Sent', 'Internal faculty memo dispatched.') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Principal / Admin Header Card */}
      <View style={[styles.adminCard, { backgroundColor: '#7F1D1D', borderColor: '#991B1B' }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatarCircle, { backgroundColor: '#DC2626' }]}>
            <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.adminName}>{currentUser.name}</Text>
            <Text style={styles.adminDesignation}>{currentUser.designation || 'Principal & Head of Institution'}</Text>
            <Text style={styles.affiliationBadge}>CBSE Affiliation No: 2130842 • School Code: 71234</Text>
          </View>
        </View>

        {/* 4-Stat High Level KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>842</Text>
            <Text style={styles.kpiLabel}>Enrolled Students</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>38</Text>
            <Text style={styles.kpiLabel}>Teaching Staff</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>95.8%</Text>
            <Text style={styles.kpiLabel}>Daily Attendance</Text>
          </View>
          <View style={styles.kpiDivider} />
          <View style={styles.kpiBox}>
            <Text style={styles.kpiValue}>86.1%</Text>
            <Text style={styles.kpiLabel}>Fee Collected</Text>
          </View>
        </View>
      </View>

      {/* App & School ERP Customization Banner */}
      <TouchableOpacity
        style={[styles.customizerBanner, { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' }]}
        onPress={onOpenCustomization}
        activeOpacity={0.85}
      >
        <View style={styles.customizerIconCircle}>
          <Ionicons name="color-palette" size={24} color="#FDE047" />
        </View>
        <View style={styles.customizerMeta}>
          <View style={styles.bannerTag}>
            <Text style={styles.bannerTagText}>ADMIN CONTROL</Text>
          </View>
          <Text style={styles.customizerTitle}>Customize App & School ERP</Text>
          <Text style={styles.customizerSub}>
            Theme colors, school branding, circulars, student roster & principal desk
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Admin Quick Action Launchers */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Administrative Control Center</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleBroadcastAlert}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="megaphone" size={22} color="#DC2626" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Issue Circular</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Broadcast SMS & App Notice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('New Admissions', '14 pending applications for Session 2026-27 under review.')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="person-add" size={22} color="#D97706" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Admissions (14)</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Review & Schedule Interviews</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Fee Treasury', 'Total collections this quarter: ₹48.2 Lakhs. 34 dues pending.')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="cash" size={22} color="#059669" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Fee Treasury</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Collection & Defaulter List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => Alert.alert('Staff Directory', 'All 38 teachers reported on duty. 1 substitute arranged.')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="people" size={22} color="#2563EB" />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Staff Roster</Text>
          <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Attendance & Substitutions</Text>
        </TouchableOpacity>
      </View>

      {/* School Financial Overview Card */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Term 1 Financial Health</Text>
      <View style={[styles.financeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.financeHeader}>
          <Text style={[styles.financeTitle, { color: colors.text }]}>Q1/Q2 Fee Settlement</Text>
          <Text style={[styles.financePercentage, { color: '#059669' }]}>86.1% Settled</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '86%' }]} />
        </View>

        <View style={styles.financeDetails}>
          <View>
            <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Collected</Text>
            <Text style={[styles.amountValue, { color: '#059669' }]}>₹48,21,600</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Outstanding Dues</Text>
            <Text style={[styles.amountValue, { color: '#DC2626' }]}>₹7,78,400</Text>
          </View>
        </View>
      </View>

      {/* Official Circulars Stream */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Administrative Bulletins</Text>
      <View style={styles.circularList}>
        {notices.slice(0, 3).map((notice) => (
          <View
            key={notice.id}
            style={[styles.circularCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.circularHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{notice.category}</Text>
              </View>
              <Text style={[styles.circularDate, { color: colors.textSecondary }]}>{notice.date}</Text>
            </View>
            <Text style={[styles.circularTitle, { color: colors.text }]}>{notice.title}</Text>
            <Text style={[styles.circularSnippet, { color: colors.textSecondary }]} numberOfLines={2}>
              {notice.content}
            </Text>
          </View>
        ))}
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
  adminCard: {
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
  adminName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  adminDesignation: {
    color: '#FECACA',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  affiliationBadge: {
    color: '#FDE047',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 3,
  },
  kpiGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  kpiBox: {
    flex: 1,
    alignItems: 'center',
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  kpiValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  kpiLabel: {
    color: '#FCA5A5',
    fontSize: 9.5,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  customizerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  customizerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customizerMeta: {
    flex: 1,
    marginRight: 8,
  },
  bannerTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  bannerTagText: {
    color: '#000000',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  customizerTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  customizerSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10.5,
    marginTop: 2,
    lineHeight: 14,
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
  financeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  financeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  financeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  financePercentage: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  financeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  circularList: {
    gap: 10,
  },
  circularCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  circularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  circularDate: {
    fontSize: 11.5,
  },
  circularTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  circularSnippet: {
    fontSize: 12,
    lineHeight: 17,
  }
});
