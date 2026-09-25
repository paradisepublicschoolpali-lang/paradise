import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { MoreSubScreen } from '../types';
import { linkingService } from '../services/linkingService';

interface MoreScreenProps {
  onNavigateSub: (sub: MoreSubScreen) => void;
  onOpenAdmissionForm: () => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({
  onNavigateSub,
  onOpenAdmissionForm
}) => {
  const { colors } = useTheme();
  const { config, fees } = useSchoolData();

  const hasPendingFees = fees.some(f => f.status === 'Pending');

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
      <Header title="More & Services" subtitle="Administrative desk & settings" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            {config.schoolName}
          </Text>
          <Text style={[styles.footerMotto, { color: colors.textMuted }]}>
            {config.motto}
          </Text>
          <Text style={[styles.footerCode, { color: colors.textMuted }]}>
            {config.affiliationCode} • Pali, Rajasthan
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
  applyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  applyIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyInfo: {
    flex: 1,
  },
  applyBadge: {
    color: '#FCD34D',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  applyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  applySub: {
    color: '#DBEAFE',
    fontSize: 11,
    marginTop: 1,
  },
  menuList: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '700',
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  menuSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  quickLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerSchool: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  footerMotto: {
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  footerCode: {
    fontSize: 9.5,
  }
});
