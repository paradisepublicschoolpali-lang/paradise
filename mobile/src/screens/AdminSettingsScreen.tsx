import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Header } from '../components/Header';
import { SchoolConfig, Notice } from '../types';

interface AdminSettingsScreenProps {
  onBack: () => void;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { config, updateConfig, notices, addNotice, deleteNotice, students, addStudent } = useSchoolData();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'principal' | 'notices' | 'students'>('branding');

  // School Config Form
  const [schoolName, setSchoolName] = useState(config.schoolName);
  const [motto, setMotto] = useState(config.motto);
  const [affiliationCode, setAffiliationCode] = useState(config.affiliationCode);
  const [academicYear, setAcademicYear] = useState(config.academicYear);
  const [currentTerm, setCurrentTerm] = useState(config.currentTerm);
  const [establishedYear, setEstablishedYear] = useState(config.establishedYear);
  const [schoolTimings, setSchoolTimings] = useState(config.schoolTimings);
  const [selectedThemeColor, setSelectedThemeColor] = useState(config.themeColor || '#1E40AF');
  const [logoLetter, setLogoLetter] = useState(config.logoLetter || 'P');

  // Contact Form
  const [contactEmail, setContactEmail] = useState(config.contactEmail);
  const [contactPhone, setContactPhone] = useState(config.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [address, setAddress] = useState(config.address);

  // Principal Form
  const [principalName, setPrincipalName] = useState(config.principalName);
  const [principalCredentials, setPrincipalCredentials] = useState(config.principalCredentials);
  const [principalMessage, setPrincipalMessage] = useState(config.principalMessage);

  // New Notice Form
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<Notice['category']>('General');
  const [noticeAudience, setNoticeAudience] = useState<Notice['targetAudience']>('All');
  const [noticeContent, setNoticeContent] = useState('');

  // New Student Enrollment Form
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newAdmissionNo, setNewAdmissionNo] = useState('');
  const [newGrade, setNewGrade] = useState('Class 8');
  const [newSection, setNewSection] = useState('A');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianPhone, setNewGuardianPhone] = useState('');

  const THEME_PRESETS = [
    { label: 'Royal Blue', hex: '#1E40AF' },
    { label: 'Emerald Green', hex: '#059669' },
    { label: 'Crimson Red', hex: '#DC2626' },
    { label: 'Royal Purple', hex: '#7C3AED' },
    { label: 'Amber Gold', hex: '#D97706' },
    { label: 'Midnight Navy', hex: '#0F172A' },
  ];

  const handleSaveBranding = () => {
    updateConfig({
      schoolName,
      motto,
      affiliationCode,
      academicYear,
      currentTerm,
      establishedYear,
      schoolTimings,
      themeColor: selectedThemeColor,
      logoLetter
    });
    Alert.alert('Settings Saved', 'School branding and app identity updated successfully across the mobile application.');
  };

  const handleSaveContact = () => {
    updateConfig({
      contactEmail,
      contactPhone,
      whatsappNumber,
      address
    });
    Alert.alert('Contact Updated', 'Institutional contact numbers and location updated.');
  };

  const handleSavePrincipal = () => {
    updateConfig({
      principalName,
      principalCredentials,
      principalMessage
    });
    Alert.alert('Principal Desk Saved', 'Principal desk details and message updated.');
  };

  const handlePublishNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      Alert.alert('Missing Fields', 'Please enter a title and content for the circular.');
      return;
    }

    addNotice({
      title: noticeTitle.trim(),
      category: noticeCategory,
      targetAudience: noticeAudience,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      content: noticeContent.trim(),
      author: 'Office of the Principal'
    });

    setNoticeTitle('');
    setNoticeContent('');
    setShowAddNotice(false);
    Alert.alert('Circular Broadcasted', 'New school notice published to all parent and student portals.');
  };

  const handleEnrollStudent = () => {
    if (!newStudentName.trim() || !newAdmissionNo.trim()) {
      Alert.alert('Missing Information', 'Please fill in student name and admission number.');
      return;
    }

    addStudent({
      name: newStudentName.trim(),
      admissionNo: newAdmissionNo.trim(),
      rollNo: `${newGrade.replace('Class ', '')}${newSection}-${Math.floor(Math.random() * 80 + 10)}`,
      grade: newGrade,
      section: newSection,
      dob: '2014-06-15',
      gender: 'Male',
      guardianName: newGuardianName.trim() || 'Parent/Guardian',
      guardianPhone: newGuardianPhone.trim() || '+91 98290 00000',
      guardianEmail: `${newStudentName.toLowerCase().replace(/\s+/g, '')}@student.paradise.edu`,
      address: 'Pali, Rajasthan - 306401'
    });

    setNewStudentName('');
    setNewAdmissionNo('');
    setShowAddStudent(false);
    Alert.alert('Student Enrolled', `${newStudentName} has been enrolled into ${newGrade}-${newSection}.`);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Admin Control & Customization"
        subtitle="Branding, circulars, faculty & ERP controls"
        showBack
        onBack={onBack}
        showContactAction={false}
      />

      {/* Navigation Sub-Tabs */}
      <View style={[styles.subTabsContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'branding' && styles.activeTabBtn]}
            onPress={() => setActiveTab('branding')}
          >
            <Ionicons name="color-palette-outline" size={15} color={activeTab === 'branding' ? '#DC2626' : colors.textSecondary} />
            <Text style={[styles.tabBtnText, { color: activeTab === 'branding' ? '#DC2626' : colors.textSecondary }]}>
              Branding & App Theme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'notices' && styles.activeTabBtn]}
            onPress={() => setActiveTab('notices')}
          >
            <Ionicons name="megaphone-outline" size={15} color={activeTab === 'notices' ? '#DC2626' : colors.textSecondary} />
            <Text style={[styles.tabBtnText, { color: activeTab === 'notices' ? '#DC2626' : colors.textSecondary }]}>
              Circulars & Notices
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'students' && styles.activeTabBtn]}
            onPress={() => setActiveTab('students')}
          >
            <Ionicons name="people-outline" size={15} color={activeTab === 'students' ? '#DC2626' : colors.textSecondary} />
            <Text style={[styles.tabBtnText, { color: activeTab === 'students' ? '#DC2626' : colors.textSecondary }]}>
              Student Roster ({students.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'principal' && styles.activeTabBtn]}
            onPress={() => setActiveTab('principal')}
          >
            <Ionicons name="school-outline" size={15} color={activeTab === 'principal' ? '#DC2626' : colors.textSecondary} />
            <Text style={[styles.tabBtnText, { color: activeTab === 'principal' ? '#DC2626' : colors.textSecondary }]}>
              Principal Desk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'contact' && styles.activeTabBtn]}
            onPress={() => setActiveTab('contact')}
          >
            <Ionicons name="call-outline" size={15} color={activeTab === 'contact' ? '#DC2626' : colors.textSecondary} />
            <Text style={[styles.tabBtnText, { color: activeTab === 'contact' ? '#DC2626' : colors.textSecondary }]}>
              Contact & Campus
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* TAB 1: BRANDING & THEME */}
        {activeTab === 'branding' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>School Brand & Identity</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Customize the name, motto, monogram initial, and primary colors shown throughout the mobile app.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>School Name</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={schoolName}
                  onChangeText={setSchoolName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Institutional Motto / Tagline</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={motto}
                  onChangeText={setMotto}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Established Year</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={establishedYear}
                    onChangeText={setEstablishedYear}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Monogram Initial</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={logoLetter}
                    onChangeText={setLogoLetter}
                    maxLength={3}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Academic Session</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={academicYear}
                    onChangeText={setAcademicYear}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Current Term</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={currentTerm}
                    onChangeText={setCurrentTerm}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>CBSE Affiliation Code</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={affiliationCode}
                  onChangeText={setAffiliationCode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Daily School Hours</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={schoolTimings}
                  onChangeText={setSchoolTimings}
                />
              </View>

              {/* Theme Color Presets */}
              <Text style={[styles.label, { color: colors.textSecondary, marginTop: 4, marginBottom: 8 }]}>
                Primary App Theme Color Preset
              </Text>
              <View style={styles.presetsRow}>
                {THEME_PRESETS.map((p) => {
                  const isSelected = selectedThemeColor === p.hex;
                  return (
                    <TouchableOpacity
                      key={p.hex}
                      style={[
                        styles.colorPresetCircle,
                        { backgroundColor: p.hex },
                        isSelected && styles.colorPresetSelected
                      ]}
                      onPress={() => setSelectedThemeColor(p.hex)}
                    >
                      {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#DC2626' }]}
                onPress={handleSaveBranding}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Branding Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: CIRCULARS & NOTICES */}
        {activeTab === 'notices' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>School Circulars & Notices</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Broadcast emergency alerts, CBSE circulars and academic notices.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: '#DC2626' }]}
                onPress={() => setShowAddNotice(!showAddNotice)}
              >
                <Ionicons name={showAddNotice ? 'close' : 'add'} size={18} color="#FFFFFF" />
                <Text style={styles.addBtnText}>{showAddNotice ? 'Cancel' : 'New Circular'}</Text>
              </TouchableOpacity>
            </View>

            {/* Create Notice Form */}
            {showAddNotice && (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 16 }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Publish New Circular</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Notice Title</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="e.g. CBSE Term-1 Examination Schedule Released"
                    placeholderTextColor={colors.textMuted}
                    value={noticeTitle}
                    onChangeText={setNoticeTitle}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
                    <View style={styles.categoryPills}>
                      {(['Urgent', 'Examination', 'Sports', 'General'] as const).map(cat => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.smallPill,
                            noticeCategory === cat && { backgroundColor: '#DC2626' }
                          ]}
                          onPress={() => setNoticeCategory(cat)}
                        >
                          <Text style={[styles.smallPillText, { color: noticeCategory === cat ? '#FFFFFF' : colors.textSecondary }]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Audience</Text>
                    <View style={styles.categoryPills}>
                      {(['All', 'Parents', 'Teachers'] as const).map(aud => (
                        <TouchableOpacity
                          key={aud}
                          style={[
                            styles.smallPill,
                            noticeAudience === aud && { backgroundColor: '#2563EB' }
                          ]}
                          onPress={() => setNoticeAudience(aud)}
                        >
                          <Text style={[styles.smallPillText, { color: noticeAudience === aud ? '#FFFFFF' : colors.textSecondary }]}>
                            {aud}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Content / Announcement</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.textArea,
                      { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }
                    ]}
                    placeholder="Enter the complete notification text..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={noticeContent}
                    onChangeText={setNoticeContent}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: '#059669' }]}
                  onPress={handlePublishNotice}
                >
                  <Ionicons name="megaphone" size={18} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Publish & Broadcast Notice</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Existing Notices List */}
            <View style={styles.noticeList}>
              {notices.map((n) => (
                <View
                  key={n.id}
                  style={[styles.noticeItemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.noticeMetaRow}>
                    <View style={[styles.catBadge, { backgroundColor: n.category === 'Urgent' ? '#FEE2E2' : '#EFF6FF' }]}>
                      <Text style={[styles.catBadgeText, { color: n.category === 'Urgent' ? '#DC2626' : '#2563EB' }]}>
                        {n.category}
                      </Text>
                    </View>
                    <Text style={[styles.noticeDate, { color: colors.textSecondary }]}>{n.date}</Text>
                    <TouchableOpacity
                      onPress={() => deleteNotice(n.id)}
                      style={styles.deleteNoticeBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.noticeCardTitle, { color: colors.text }]}>{n.title}</Text>
                  <Text style={[styles.noticeCardContent, { color: colors.textSecondary }]} numberOfLines={2}>
                    {n.content}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: STUDENT ROSTER & ENROLLMENT */}
        {activeTab === 'students' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Student Enrollment & Roster</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  View all enrolled students or register a new admission.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: '#059669' }]}
                onPress={() => setShowAddStudent(!showAddStudent)}
              >
                <Ionicons name={showAddStudent ? 'close' : 'person-add'} size={16} color="#FFFFFF" />
                <Text style={styles.addBtnText}>{showAddStudent ? 'Cancel' : 'Enroll Student'}</Text>
              </TouchableOpacity>
            </View>

            {/* New Student Enrollment Form */}
            {showAddStudent && (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginBottom: 16 }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Enroll New Student</Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Student Full Name</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    placeholder="e.g. Dhruv Maheshwari"
                    placeholderTextColor={colors.textMuted}
                    value={newStudentName}
                    onChangeText={setNewStudentName}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Admission Number</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      placeholder="PPS-2026-0912"
                      placeholderTextColor={colors.textMuted}
                      value={newAdmissionNo}
                      onChangeText={setNewAdmissionNo}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Class Grade</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      value={newGrade}
                      onChangeText={setNewGrade}
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Guardian Name</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      placeholder="e.g. Ramesh Maheshwari"
                      placeholderTextColor={colors.textMuted}
                      value={newGuardianName}
                      onChangeText={setNewGuardianName}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Guardian Phone</Text>
                    <TextInput
                      style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                      placeholder="+91 98290 ..."
                      placeholderTextColor={colors.textMuted}
                      value={newGuardianPhone}
                      onChangeText={setNewGuardianPhone}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: '#059669' }]}
                  onPress={handleEnrollStudent}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Complete Student Enrollment</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Students List */}
            <View style={styles.studentList}>
              {students.map((std) => (
                <View
                  key={std.id}
                  style={[styles.studentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.studentAvatarBox}>
                    <Ionicons name="person" size={20} color="#2563EB" />
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={[styles.studentNameText, { color: colors.text }]}>{std.name}</Text>
                    <Text style={[styles.studentSubText, { color: colors.textSecondary }]}>
                      {std.grade}-{std.section} • Roll: {std.rollNo} • Adm: {std.admissionNo}
                    </Text>
                    <Text style={[styles.studentGuardian, { color: colors.textMuted }]}>
                      Guardian: {std.guardianName} ({std.guardianPhone})
                    </Text>
                  </View>
                  <View style={styles.studentRateBox}>
                    <Text style={[styles.rateNum, { color: '#059669' }]}>{std.attendanceRate}%</Text>
                    <Text style={[styles.rateLabel, { color: colors.textMuted }]}>Attendance</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: PRINCIPAL DESK */}
        {activeTab === 'principal' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Principal Desk & Leadership</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Configure the Head of Institution name, credentials, and message to visitors and parents.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Principal Name</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={principalName}
                  onChangeText={setPrincipalName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Academic Credentials</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={principalCredentials}
                  onChangeText={setPrincipalCredentials}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Principal's Message</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    styles.textArea,
                    { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }
                  ]}
                  multiline
                  numberOfLines={4}
                  value={principalMessage}
                  onChangeText={setPrincipalMessage}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#DC2626' }]}
                onPress={handleSavePrincipal}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Principal Desk</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 5: CONTACT & CAMPUS */}
        {activeTab === 'contact' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Institutional Contact & Location</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Update official email, desk telephone numbers, WhatsApp helpdesk, and campus address.
            </Text>

            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Official Email</Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Desk Phone</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={contactPhone}
                    onChangeText={setContactPhone}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>WhatsApp Helpdesk</Text>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                    value={whatsappNumber}
                    onChangeText={setWhatsappNumber}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Full Campus Address</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    styles.textArea,
                    { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }
                  ]}
                  multiline
                  numberOfLines={3}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#DC2626' }]}
                onPress={handleSaveContact}
                activeOpacity={0.8}
              >
                <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Contact Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subTabsContainer: {
    borderBottomWidth: 1,
  },
  tabsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTabBtn: {
    backgroundColor: '#FEE2E2',
  },
  tabBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 17,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 5,
  },
  textInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    marginTop: 4,
  },
  colorPresetCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPresetSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  smallPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  smallPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  noticeList: {
    gap: 10,
  },
  noticeItemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  noticeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noticeDate: {
    fontSize: 11,
    flex: 1,
  },
  deleteNoticeBtn: {
    padding: 4,
  },
  noticeCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  noticeCardContent: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  studentList: {
    gap: 10,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  studentAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  studentSubText: {
    fontSize: 11,
    marginTop: 2,
  },
  studentGuardian: {
    fontSize: 10.5,
    marginTop: 2,
  },
  studentRateBox: {
    alignItems: 'flex-end',
  },
  rateNum: {
    fontSize: 13,
    fontWeight: '800',
  },
  rateLabel: {
    fontSize: 9.5,
  }
});
