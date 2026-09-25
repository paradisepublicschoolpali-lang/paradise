import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';

interface AdmissionFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  visible,
  onClose
}) => {
  const { colors, isDark } = useTheme();
  const { submitAdmission } = useSchoolData();

  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('Class 1');
  const [dob, setDob] = useState('2019-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppNo, setSubmittedAppNo] = useState<string | null>(null);

  const gradesList = [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4',
    'Class 5', 'Class 6', 'Class 7', 'Class 8'
  ];

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      Alert.alert('Required Field', 'Please enter candidate student name.');
      return;
    }
    if (!parentName.trim()) {
      Alert.alert('Required Field', 'Please enter parent/guardian name.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Required Field', 'Please enter primary contact number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const appNo = await submitAdmission({
        applicantName: studentName.trim(),
        gradeApplying: grade,
        dob,
        gender,
        parentName: parentName.trim(),
        parentEmail: email.trim() || 'not_provided@school.in',
        parentPhone: phone.trim(),
        address: address.trim() || 'Pali, Rajasthan',
        previousSchool: previousSchool.trim() || undefined
      });
      setSubmittedAppNo(appNo);
    } catch {
      Alert.alert('Error', 'Could not submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStudentName('');
    setParentName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPreviousSchool('');
    setSubmittedAppNo(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleResetAndClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Bar */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surface }]}
            onPress={handleResetAndClose}
            accessibilityLabel="Close form"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Apply for Admission</Text>
          <View style={{ width: 36 }} />
        </View>

        {submittedAppNo ? (
          <View style={styles.successContainer}>
            <View style={[styles.successIconCircle, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-circle" size={54} color={colors.success} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>Application Received!</Text>
            <Text style={[styles.successSub, { color: colors.textSecondary }]}>
              Your admission application has been registered with the admissions office.
            </Text>

            <View style={[styles.appNoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.appNoLabel, { color: colors.textSecondary }]}>
                Application Reference Number
              </Text>
              <Text style={[styles.appNoValue, { color: colors.primary }]}>{submittedAppNo}</Text>
            </View>

            <Text style={[styles.successNote, { color: colors.textMuted }]}>
              The school admissions bureau will contact you on {phone} within 2 business days to schedule the interaction.
            </Text>

            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
              onPress={handleResetAndClose}
              accessibilityRole="button"
              accessibilityLabel="Done"
            >
              <Text style={styles.doneBtnText}>Return to App</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.formScroll}>
            <View style={[styles.noticeBanner, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="school" size={20} color={colors.primary} />
              <Text style={[styles.noticeText, { color: colors.primary }]}>
                Admissions open for Academic Session 2026-27 (Nursery to Class 8).
              </Text>
            </View>

            {/* Candidate Details */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Candidate Details</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Student Full Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. Aryan Sharma"
              placeholderTextColor={colors.textMuted}
              value={studentName}
              onChangeText={setStudentName}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Class Applying For *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeChipsRow}>
              {gradesList.map(g => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.gradeChip,
                    {
                      backgroundColor: grade === g ? colors.primary : colors.card,
                      borderColor: grade === g ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setGrade(g)}
                >
                  <Text
                    style={[
                      styles.gradeChipText,
                      { color: grade === g ? '#FFFFFF' : colors.text }
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Gender</Text>
            <View style={styles.genderRow}>
              {(['Male', 'Female', 'Other'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor: gender === g ? colors.primary : colors.card,
                      borderColor: gender === g ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, { color: gender === g ? '#FFFFFF' : colors.text }]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Guardian Details */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>
              Parent / Guardian Details
            </Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Father / Mother / Guardian Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. Vikram Sharma"
              placeholderTextColor={colors.textMuted}
              value={parentName}
              onChangeText={setParentName}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Contact Phone Number *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. +91 98290 12345"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. parent@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Residential Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. Sumerpur Road, Pali"
              placeholderTextColor={colors.textMuted}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Previous School Attended (if any)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="e.g. St. Paul Junior School, Pali"
              placeholderTextColor={colors.textMuted}
              value={previousSchool}
              onChangeText={setPreviousSchool}
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Submit Admission Application"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="send" size={17} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Submit Application</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  formScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 6,
  },
  gradeChipsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  gradeChipText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  appNoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  appNoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  appNoValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  successNote: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 30,
  },
  doneBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
