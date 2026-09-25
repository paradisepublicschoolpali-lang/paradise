import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';

export const ChildSwitcher: React.FC = () => {
  const { colors } = useTheme();
  const { students, activeStudent, setActiveStudentId } = useSchoolData();

  if (!students || students.length <= 1) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.labelRow}>
        <Ionicons name="people" size={15} color={colors.primary} />
        <Text style={[styles.switchLabel, { color: colors.textMuted }]}>SELECT CHILD / PROFILE</Text>
      </View>
      <View style={styles.childPills}>
        {students.map(student => {
          const isSelected = student.id === activeStudent?.id;
          return (
            <TouchableOpacity
              key={student.id}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  borderColor: isSelected ? colors.primary : colors.border
                }
              ]}
              onPress={() => setActiveStudentId(student.id)}
              activeOpacity={0.8}
            >
              {student.avatarUrl ? (
                <Image source={{ uri: student.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.border }]}>
                  <Text style={[styles.avatarLetter, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                    {student.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View style={styles.nameBlock}>
                <Text
                  style={[
                    styles.childName,
                    { color: isSelected ? '#FFFFFF' : colors.text, fontWeight: isSelected ? '700' : '600' }
                  ]}
                  numberOfLines={1}
                >
                  {student.name}
                </Text>
                <Text
                  style={[
                    styles.childGrade,
                    { color: isSelected ? 'rgba(255,255,255,0.85)' : colors.textMuted }
                  ]}
                >
                  {student.grade}-{student.section} • Roll {student.rollNo}
                </Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={18} color="#FBBF24" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  switchLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  childPills: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarLetter: {
    fontSize: 14,
    fontWeight: '700',
  },
  nameBlock: {
    flex: 1,
  },
  childName: {
    fontSize: 13,
  },
  childGrade: {
    fontSize: 10.5,
    marginTop: 1,
  },
  checkIcon: {
    marginLeft: 4,
  }
});
