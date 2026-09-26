import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { MoreSubScreen } from '../types';
import { linkingService } from '../services/linkingService';

interface MoreScreenProps {
  onNavigateSub: (sub: MoreSubScreen) => void;
  onOpenAdmissionForm: () => void;
  onOpenLogin?: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  onNavigateSub,
  onOpenAdmissionForm,
  onOpenLogin
}) => {
  const { colors } = useTheme();
  const { config, fees } = useSchoolData();
  const { currentUser, role, logout } = useAuth();

  const hasPendingFees = fees.some(f => f.status === 'Pending');

  const getRoleTheme = () => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator Portal', color: '#DC2626', bg: '#FEE2E2', icon: 'shield-checkmark' };
      case 'teacher':
        return { label: 'Teacher & Faculty Portal', color: '#059669', bg: '#D1FAE5', icon: 'school' };
      case 'parent':
        return { label: 'Parent & Student Portal', color: '#2563EB', bg: '#DBEAFE', icon: 'people' };
      default:
        return { label: 'Guest Visitor', color: '#64748B', bg: '#F1F5F9', icon: 'person' };
    }
  };

  const roleTheme = getRoleTheme();

  const menuItems: {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    subScreen: MoreSubScreen;
    badge?: string;
  }[] = [
    {
      title: 'Fee Treasury & Receipts',
      subtitle: 'Quarterly invoices, UPI payments & receipts',
      icon: 'card-outline',
      color: '#7C3AED',
      subScreen: 'fees',
      badge: hasPendingFees ? 'Action Due' : undefined
    },
    {
      title: 'About Paradise School',
      subtitle: 'Heritage, leadership, vision & milestones',
      icon: 'school-outline',
      color: '#1E3A8A',
      subScreen: 'about'
    },
    {
      title: 'Admissions & Enrollment',
      subtitle: 'Eligibility, procedure & online application',
      icon: 'document-text-outline',
      color: '#2563EB',
      subScreen: 'admissions',
      badge: 'Open 2026'
    },
    {
      title: 'Campus Facilities & Labs',
      subtitle: 'Robotics lab, library, sports & transport',
      icon: 'business-outline',
      color: '#7C3AED',
      subScreen: 'facilities'
    },
    {
      title: 'Contact & Location',
      subtitle: 'Direct dialers, email & Google Maps',
      icon: 'call-outline',
      color: '#DC2626',
      subScreen: 'contact'
    },
    {
      title: 'Settings & Appearance',
      subtitle: 'Light/Dark mode & notifications',
      icon: 'settings-outline',
      color: '#059669',
      subScreen: 'settings'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="More & Services"
        subtitle="Institutional desk, profile & settings"
        onOpenProfile={onOpenLogin}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Account / Role Card */}
        <View style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.accountTop}>
            <View style={[styles.accountAvatar, { backgroundColor: roleTheme.color }]}>
              <Ionicons name={roleTheme.icon as any} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.accountMeta}>
              <View style={styles.nameRoleRow}>
                <Text style={[styles.accountName, { color: colors.text }]}>{currentUser.name}</Text>
              </View>
              <View style={[styles.rolePill, { backgroundColor: roleTheme.bg }]}>
                <Text style={[styles.rolePillText, { color: roleTheme.color }]}>
                  {roleTheme.label}
                </Text>
              </View>
              <Text style={[styles.accountDesc, { color: colors.textSecondary }]}>
                {currentUser.designation || currentUser.grade || currentUser.email}
              </Text>
            </View>
          </View>

          <View style={[styles.accountActionsRow, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.switchAccountBtn, { backgroundColor: colors.primaryTint }]}
              onPress={onOpenLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
              <Text style={[styles.switchAccountBtnText, { color: colors.primary }]}>
                Switch Role / Log In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={logout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={16} color="#DC2626" />
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Apply Card */}
        <TouchableOpacity
          style={[styles.applyCard, { backgroundColor: colors.primary }]}
          onPress={onOpenAdmissionForm}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Apply for admission"
        >
          <View style={styles.applyIconCircle}>
            <Ionicons name="sparkles" size={20} color="#F59E0B" />
          </View>
          <View style={styles.applyInfo}>
            <Text style={styles.applyBadge}>SESSION {config.academicYear}</Text>
            <Text style={styles.applyTitle}>Apply for Admission</Text>
            <Text style={styles.applySub}>Instant online form for Nursery to Class 8</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Menu Navigation Items */}
        <View style={[styles.menuList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.menuRow,
                { borderBottomColor: colors.border },
                idx === menuItems.length - 1 ? { borderBottomWidth: 0 } : {}
              ]}
              onPress={() => onNavigateSub(item.subScreen)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.background }]}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>

              <View style={styles.menuInfo}>
                <View style={styles.titleWithBadge}>
                  <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                  {item.badge ? (
                    <View
                      style={[
                        styles.badgePill,
                        {
                          backgroundColor:
                            item.badge === 'Action Due' ? '#EF44441A' : colors.accent + '20'
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color: item.badge === 'Action Due' ? '#EF4444' : colors.accent
                          }
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.menuSub, { color: colors.textMuted }]}>
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Contact Buttons */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Institutional Desk</Text>

        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => linkingService.openPhone(config.contactPhone)}
            accessibilityLabel="Call school"
          >
            <Ionicons name="call" size={18} color="#2563EB" />
            <Text style={[styles.quickLabel, { color: colors.text }]}>Call Office</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => linkingService.openWhatsApp(config.whatsappNumber)}
            accessibilityLabel="WhatsApp"
          >
            <Ionicons name="logo-whatsapp" size={18} color="#16A34A" />
            <Text style={[styles.quickLabel, { color: colors.text }]}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => linkingService.openEmail(config.contactEmail)}
            accessibilityLabel="Email school"
          >
            <Ionicons name="mail" size={18} color="#D97706" />
            <Text style={[styles.quickLabel, { color: colors.text }]}>Send Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => linkingService.openMap()}
            accessibilityLabel="Google Maps"
          >
            <Ionicons name="navigate" size={18} color="#7C3AED" />
            <Text style={[styles.quickLabel, { color: colors.text }]}>Find in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* School Footer Note */}
        <View style={styles.footerNote}>
          <Text style={[styles.footerSchool, { color: colors.text }]}>
            PARADISE PUBLIC SCHOOL, PALI
          </Text>
          <Text style={[styles.footerAffiliation, { color: colors.textMuted }]}>
            CBSE Affiliation No: 2130842 • Estd. 1994
          </Text>
          <Text style={[styles.footerMotto, { color: colors.primary }]}>
            Excellence • Integrity • Leadership
          </Text>
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
  accountCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  accountTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountMeta: {
    flex: 1,
  },
  nameRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  rolePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  accountDesc: {
    fontSize: 11.5,
  },
  accountActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  switchAccountBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switchAccountBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  applyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  applyIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  applyInfo: {
    flex: 1,
  },
  applyBadge: {
    color: '#FDE047',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  applyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 1,
  },
  applySub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  menuList: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuInfo: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  menuSub: {
    fontSize: 11,
    marginTop: 1.5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 4,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  quickCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerSchool: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerAffiliation: {
    fontSize: 10.5,
    marginTop: 3,
  },
  footerMotto: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 4,
  }
});
