import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onCancel }) => {
  const { colors, isDark } = useTheme();
  const { login, quickLogin, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    clearError();
    if (role === 'parent') {
      setLoginId('vikram.sharma');
      setPassword('parent123');
    } else if (role === 'teacher') {
      setLoginId('sunita.science');
      setPassword('teacher123');
    } else if (role === 'admin') {
      setLoginId('admin');
      setPassword('admin123');
    }
  };

  const handleSignIn = async () => {
    const id = loginId.trim() || (selectedRole === 'admin' ? 'admin' : selectedRole === 'teacher' ? 'sunita.science' : 'vikram.sharma');
    const pwd = password.trim() || (selectedRole === 'admin' ? 'admin123' : selectedRole === 'teacher' ? 'teacher123' : 'parent123');

    const res = await login(id, pwd, selectedRole);
    if (res.success) {
      if (onSuccess) onSuccess();
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    quickLogin(role);
    if (onSuccess) onSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with School Logo */}
        <View style={styles.brandingSection}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.schoolName, { color: colors.text }]}>
            PARADISE PUBLIC SCHOOL
          </Text>
          <Text style={[styles.schoolAffiliation, { color: colors.primary }]}>
            CBSE Affiliated (Nursery to Class 8) • Estd. 1994
          </Text>
          <Text style={[styles.motto, { color: colors.textSecondary }]}>
            Excellence • Integrity • Leadership
          </Text>
        </View>

        {/* Role Tab Selector */}
        <View style={[styles.roleTabsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.roleTab,
              selectedRole === 'parent' && [styles.activeRoleTab, { backgroundColor: colors.primary }]
            ]}
            onPress={() => handleRoleSelect('parent')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="people"
              size={16}
              color={selectedRole === 'parent' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleTabText,
                { color: selectedRole === 'parent' ? '#FFFFFF' : colors.textSecondary }
              ]}
            >
              Parent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleTab,
              selectedRole === 'teacher' && [styles.activeRoleTab, { backgroundColor: '#059669' }]
            ]}
            onPress={() => handleRoleSelect('teacher')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="school"
              size={16}
              color={selectedRole === 'teacher' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleTabText,
                { color: selectedRole === 'teacher' ? '#FFFFFF' : colors.textSecondary }
              ]}
            >
              Teacher
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleTab,
              selectedRole === 'admin' && [styles.activeRoleTab, { backgroundColor: '#DC2626' }]
            ]}
            onPress={() => handleRoleSelect('admin')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={selectedRole === 'admin' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleTabText,
                { color: selectedRole === 'admin' ? '#FFFFFF' : colors.textSecondary }
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Form */}
        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.portalHeading, { color: colors.text }]}>
              {selectedRole === 'admin'
                ? 'School Administration Portal'
                : selectedRole === 'teacher'
                ? 'Teacher & Faculty Portal'
                : 'Parent & Student Portal'}
            </Text>
            <Text style={[styles.portalSubheading, { color: colors.textSecondary }]}>
              {selectedRole === 'admin'
                ? 'Institutional governance, fee ledger & staff management'
                : selectedRole === 'teacher'
                ? 'Class attendance, homework assignments & report cards'
                : 'Track student progress, attendance, fees & circulars'}
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: '#F87171' }]}>
              <Ionicons name="alert-circle" size={18} color="#B91C1C" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* User ID Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              {selectedRole === 'admin'
                ? 'Admin Login ID / Username'
                : selectedRole === 'teacher'
                ? 'Teacher ID / Email'
                : 'Admission No / Mobile Number'}
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons
                name={selectedRole === 'admin' ? 'key-outline' : selectedRole === 'teacher' ? 'mail-outline' : 'person-outline'}
                size={18}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={
                  selectedRole === 'admin'
                    ? 'e.g. admin'
                    : selectedRole === 'teacher'
                    ? 'e.g. sunita.science'
                    : 'e.g. vikram.sharma'
                }
                placeholderTextColor={colors.textMuted}
                value={loginId}
                onChangeText={setLoginId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Password
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInBtn,
              {
                backgroundColor:
                  selectedRole === 'admin'
                    ? '#DC2626'
                    : selectedRole === 'teacher'
                    ? '#059669'
                    : colors.primary
              }
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.signInBtnText}>
                  Sign In to {selectedRole === 'admin' ? 'Admin Portal' : selectedRole === 'teacher' ? 'Teacher Portal' : 'Parent Portal'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 1-Tap Quick Demo Logins */}
        <View style={styles.demoSection}>
          <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>
            ⚡ ONE-TAP DEMO ACCESS:
          </Text>

          <View style={styles.demoList}>
            {/* Parent Demo */}
            <TouchableOpacity
              style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleQuickDemo('parent')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="people" size={18} color="#1E40AF" />
              </View>
              <View style={styles.demoMeta}>
                <Text style={[styles.demoRoleName, { color: colors.text }]}>Parent Demo</Text>
                <Text style={[styles.demoSubText, { color: colors.textSecondary }]}>
                  Vikram Sharma • Aryan (8-A) & Anvi (1-A)
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Teacher Demo */}
            <TouchableOpacity
              style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleQuickDemo('teacher')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconCircle, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="school" size={18} color="#059669" />
              </View>
              <View style={styles.demoMeta}>
                <Text style={[styles.demoRoleName, { color: colors.text }]}>Teacher Demo</Text>
                <Text style={[styles.demoSubText, { color: colors.textSecondary }]}>
                  Mrs. Sunita Verma • Science HOD & Class 8-A
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Admin Demo */}
            <TouchableOpacity
              style={[styles.demoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleQuickDemo('admin')}
              activeOpacity={0.7}
            >
              <View style={[styles.demoIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#DC2626" />
              </View>
              <View style={styles.demoMeta}>
                <Text style={[styles.demoRoleName, { color: colors.text }]}>Admin Demo</Text>
                <Text style={[styles.demoSubText, { color: colors.textSecondary }]}>
                  Dr. Renu Gupta • Principal & Full Oversight
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue as Guest */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => handleQuickDemo('guest')}
          activeOpacity={0.7}
        >
          <Text style={[styles.guestButtonText, { color: colors.primary }]}>
            Browse School Website as Guest Visitor
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingBottom: 40,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 18,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 12,
  },
  logoImage: {
    width: 72,
    height: 72,
    borderRadius: 18,
  },
  schoolName: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  schoolAffiliation: {
    fontSize: 11.5,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  motto: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  roleTabsContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeRoleTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
  },
  portalHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  portalSubheading: {
    fontSize: 11.5,
    marginTop: 3,
    lineHeight: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  signInBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  demoSection: {
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  demoList: {
    gap: 8,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  demoMeta: {
    flex: 1,
  },
  demoRoleName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  demoSubText: {
    fontSize: 11,
    marginTop: 1.5,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestButtonText: {
    fontSize: 13,
    fontWeight: '600',
  }
});
