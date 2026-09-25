import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { ThemeMode } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { colors, isDark, mode, setMode } = useTheme();
  const { config } = useSchoolData();

  const [notifNotices, setNotifNotices] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifHolidays, setNotifHolidays] = useState(true);
  const [notifAdmissions, setNotifAdmissions] = useState(false);

  const themeOptions: { label: string; mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'System Default', mode: 'system', icon: 'phone-portrait-outline' },
    { label: 'Light Theme', mode: 'light', icon: 'sunny-outline' },
    { label: 'Dark Theme', mode: 'dark', icon: 'moon-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Settings & Info"
        subtitle="Theme, notifications & app details"
        showBack
        onBack={onBack}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Appearance Mode */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Choose your preferred color theme
          </Text>

          <View style={styles.themeGroup}>
            {themeOptions.map(opt => {
              const isSelected = mode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? colors.primaryTint : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setMode(opt.mode)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Ionicons
                    name={opt.icon}
                    size={18}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? '700' : '500'
                      }
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notifications Preferences */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Alerts</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select which school announcements you wish to receive
          </Text>

          <View style={[styles.switchRow, { borderBottomColor: colors.borderLight }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>New Circulars & Notices</Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                Important exam timetables and official circulars
              </Text>
            </View>
            <Switch
              value={notifNotices}
              onValueChange={setNotifNotices}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={[styles.switchRow, { borderBottomColor: colors.borderLight }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>School Events & Galas</Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                Sports day, science exhibitions and cultural fests
              </Text>
            </View>
            <Switch
              value={notifEvents}
              onValueChange={setNotifEvents}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={[styles.switchRow, { borderBottomColor: colors.borderLight }]}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>Holidays & Closures</Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                Vacation schedules and weather emergency updates
              </Text>
            </View>
            <Switch
              value={notifHolidays}
              onValueChange={setNotifHolidays}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>Admissions Updates</Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>
                Registration deadlines and interview notifications
              </Text>
            </View>
            <Switch
              value={notifAdmissions}
              onValueChange={setNotifAdmissions}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Institution Info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Institution Credentials</Text>

          <View style={[styles.infoRow, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>School</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{config.schoolName}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Affiliation</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{config.affiliationCode}</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Established</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Year {config.establishedYear}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Current Term</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{config.currentTerm}</Text>
          </View>
        </View>

        {/* App Version Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Info</Text>

          <View style={[styles.infoRow, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Build Version</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>v1.0.0 (Native Build)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Platform</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Android & iOS (Universal)</Text>
          </View>

          <TouchableOpacity
            style={[styles.clearBtn, { borderColor: colors.border }]}
            onPress={() => Alert.alert('Cache Cleared', 'Local offline cache has been refreshed.')}
          >
            <Ionicons name="trash-outline" size={15} color={colors.textSecondary} />
            <Text style={[styles.clearBtnText, { color: colors.textSecondary }]}>
              Clear Offline Cache
            </Text>
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
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
    marginBottom: 14,
  },
  themeGroup: {
    gap: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  themeLabel: {
    fontSize: 13,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  switchInfo: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  switchDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  infoLabel: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    gap: 6,
  },
  clearBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
  }
});
