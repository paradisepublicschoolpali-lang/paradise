import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { linkingService } from '../services/linkingService';

interface ContactScreenProps {
  onBack: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { config } = useSchoolData();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Contact & Location"
        subtitle="Direct phone, email & Google Maps"
        showBack
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Campus Address Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.topRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="location" size={22} color={colors.primary} />
            </View>
            <View style={styles.topRowInfo}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Campus Location</Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary }]}>Pali Main Campus</Text>
            </View>
          </View>

          <Text style={[styles.addressText, { color: colors.text }]}>{config.address}</Text>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => linkingService.openMap()}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open in Google Maps"
          >
            <Ionicons name="navigate" size={16} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Get Directions in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Contact Actions Grid */}
        <View style={styles.gridRow}>
          {/* Primary Phone */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => linkingService.openPhone(config.contactPhone)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Call Landline"
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="call" size={20} color="#2563EB" />
            </View>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Office Phone</Text>
            <Text style={[styles.gridValue, { color: colors.text }]}>{config.contactPhone}</Text>
          </TouchableOpacity>

          {/* Secondary Mobile */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => linkingService.openPhone(config.secondaryPhone)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Call Mobile Helpline"
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="phone-portrait" size={20} color="#2563EB" />
            </View>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Direct Mobile</Text>
            <Text style={[styles.gridValue, { color: colors.text }]}>{config.secondaryPhone}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          {/* WhatsApp */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => linkingService.openWhatsApp(config.whatsappNumber)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Chat on WhatsApp"
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#16A34A" />
            </View>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>WhatsApp Chat</Text>
            <Text style={[styles.gridValue, { color: colors.text }]}>Admissions Help</Text>
          </TouchableOpacity>

          {/* Email */}
          <TouchableOpacity
            style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => linkingService.openEmail(config.contactEmail)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Send Email"
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="mail" size={20} color="#D97706" />
            </View>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Email Inquiry</Text>
            <Text style={[styles.gridValue, { color: colors.text }]} numberOfLines={1}>
              Send Mail
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timings Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.topRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
              <Ionicons name="time-outline" size={22} color={colors.accent} />
            </View>
            <View style={styles.topRowInfo}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Hours & Timings</Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary }]}>Campus schedule</Text>
            </View>
          </View>

          <View style={[styles.timingRow, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.timingDay, { color: colors.text }]}>School Timings</Text>
            <Text style={[styles.timingTime, { color: colors.primary }]}>{config.schoolTimings}</Text>
          </View>

          <View style={styles.timingRow}>
            <Text style={[styles.timingDay, { color: colors.text }]}>Administrative Office</Text>
            <Text style={[styles.timingTime, { color: colors.primary }]}>08:30 AM - 04:30 PM</Text>
          </View>
        </View>

        {/* Official Website Card */}
        <TouchableOpacity
          style={[styles.websiteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => linkingService.openWebsite(config.websiteUrl)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open School Website"
        >
          <Ionicons name="globe-outline" size={22} color={colors.primary} />
          <View style={styles.websiteInfo}>
            <Text style={[styles.websiteTitle, { color: colors.text }]}>Visit Official Website</Text>
            <Text style={[styles.websiteUrl, { color: colors.textSecondary }]}>{config.websiteUrl}</Text>
          </View>
          <Ionicons name="open-outline" size={17} color={colors.primary} />
        </TouchableOpacity>
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
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRowInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 1,
  },
  addressText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  gridIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  timingRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  timingDay: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  timingTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginTop: 4,
  },
  websiteInfo: {
    flex: 1,
  },
  websiteTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  websiteUrl: {
    fontSize: 11.5,
  }
});
