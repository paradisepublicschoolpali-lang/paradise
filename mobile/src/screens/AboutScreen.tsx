import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';

interface AboutScreenProps {
  onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  const { colors, isDark } = useTheme();
  const { config } = useSchoolData();

  const values = [
    { title: 'Academic Rigor', desc: 'Relentless pursuit of intellectual mastery, critical reasoning, and foundational literacy.', icon: 'ribbon-outline' },
    { title: 'Moral Integrity', desc: 'Cultivating honesty, discipline, empathy, and ethical stewardship in every student.', icon: 'shield-checkmark-outline' },
    { title: 'Innovation Mindset', desc: 'Empowering curious minds through hands-on STEM, robotics, and scientific inquiry.', icon: 'bulb-outline' },
    { title: 'Inclusive Community', desc: 'Fostering cultural empathy, mutual respect, and global citizenship.', icon: 'heart-outline' }
  ];

  const milestones = [
    { year: config.establishedYear, title: `Foundation of ${config.schoolName}`, desc: 'Inaugurated with a visionary commitment to foundational academic and moral excellence in Pali.' },
    { year: '2004', title: 'State Elementary Education Honors', desc: 'Recognized for 100% foundational learning excellence and distinction in state evaluations.' },
    { year: '2012', title: 'Middle School Expansion (Class 6-8)', desc: 'Expanded modern middle school laboratories, digital language learning labs, and activity wings.' },
    { year: '2020', title: 'Atal Tinkering Jr. Lab & Smart Campus', desc: 'Inaugurated junior ATL robotics lab and interactive digital smart classrooms.' },
    { year: '2026', title: 'Excellence & Golden Legacy', desc: 'Premier co-educational Nursery to Class 8 CBSE-affiliated institution in Rajasthan.' }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="About School"
        subtitle="Heritage, leadership & core philosophy"
        showBack
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>HERITAGE & TRADITION</Text>
          <Text style={[styles.heading, { color: colors.text }]}>Paradise Public School</Text>
          <Text style={[styles.subHeading, { color: colors.accent }]}>
            Estd. {config.establishedYear} • {config.affiliationCode}
          </Text>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            For over three decades, Paradise Public School has stood as a beacon of academic distinction, moral rectitude, and holistic child development in Pali, Rajasthan.
          </Text>
        </View>

        {/* Principal's Message */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>HEAD OF INSTITUTION</Text>
          <View style={styles.principalRow}>
            <Image
              source={{ uri: config.principalPhoto }}
              style={styles.principalImg}
              resizeMode="cover"
            />
            <View style={styles.principalInfo}>
              <Text style={[styles.principalName, { color: colors.text }]}>{config.principalName}</Text>
              <Text style={[styles.principalRole, { color: colors.primary }]}>{config.principalRole}</Text>
              <Text style={[styles.principalCreds, { color: colors.textMuted }]}>
                {config.principalCredentials}
              </Text>
            </View>
          </View>

          <View style={[styles.quoteBox, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
            <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} style={{ marginBottom: 6 }} />
            <Text style={[styles.quoteText, { color: colors.text }]}>
              "{config.principalMessage}"
            </Text>
          </View>
        </View>

        {/* Vision & Mission */}
        <View style={styles.twoCol}>
          <View style={[styles.miniCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.miniIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="eye-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.miniTitle, { color: colors.text }]}>Our Vision</Text>
            <Text style={[styles.miniText, { color: colors.textSecondary }]}>
              To nurture sovereign, empathetic, and future-ready thinkers grounded in timeless moral values.
            </Text>
          </View>

          <View style={[styles.miniCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.miniIcon, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="rocket-outline" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.miniTitle, { color: colors.text }]}>Our Mission</Text>
            <Text style={[styles.miniText, { color: colors.textSecondary }]}>
              Delivering balanced education combining rigorous academics, junior STEM robotics, sports, and arts.
            </Text>
          </View>
        </View>

        {/* Core Values */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>OUR GUIDING PILLARS</Text>
          <Text style={[styles.heading, { color: colors.text, marginBottom: 12 }]}>Core Institutional Values</Text>
          {values.map((v, idx) => (
            <View key={idx} style={[styles.valueItem, { borderBottomColor: colors.borderLight }]}>
              <View style={[styles.valueIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name={v.icon as any} size={18} color={colors.primary} />
              </View>
              <View style={styles.valueContent}>
                <Text style={[styles.valueTitle, { color: colors.text }]}>{v.title}</Text>
                <Text style={[styles.valueDesc, { color: colors.textSecondary }]}>{v.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Milestones Timeline */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionBadge, { color: colors.primary }]}>THE PARADISE JOURNEY</Text>
          <Text style={[styles.heading, { color: colors.text, marginBottom: 16 }]}>Key Milestones</Text>
          {milestones.map((m, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <Text style={[styles.timelineYear, { color: colors.primary }]}>{m.year}</Text>
                <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                {idx < milestones.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                )}
              </View>
              <View style={styles.timelineRight}>
                <Text style={[styles.milestoneTitle, { color: colors.text }]}>{m.title}</Text>
                <Text style={[styles.milestoneDesc, { color: colors.textSecondary }]}>{m.desc}</Text>
              </View>
            </View>
          ))}
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
    marginBottom: 6,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  principalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginVertical: 12,
  },
  principalImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  principalInfo: {
    flex: 1,
  },
  principalName: {
    fontSize: 15,
    fontWeight: '800',
  },
  principalRole: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  principalCreds: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  quoteBox: {
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginTop: 6,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  miniCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  miniIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  miniText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  valueIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  valueDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    width: 56,
    alignItems: 'center',
    position: 'relative',
  },
  timelineYear: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 8,
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  milestoneDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  }
});
