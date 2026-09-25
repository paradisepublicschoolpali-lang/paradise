import { TimetableSlot, UserRole } from './types';

/**
 * Validates timetable slots to detect teacher and room scheduling conflicts.
 */
export function detectTimetableConflict(
  newSlot: Omit<TimetableSlot, 'id'>,
  existingSlots: TimetableSlot[],
  currentSlotId?: string
): { hasConflict: boolean; reason?: string } {
  for (const slot of existingSlots) {
    if (currentSlotId && slot.id === currentSlotId) continue;

    const sameDay = slot.dayOfWeek === newSlot.dayOfWeek;
    const samePeriod = slot.periodNumber === newSlot.periodNumber;

    if (sameDay && samePeriod) {
      // 1. Teacher Double-Booking Check
      if (slot.teacherId === newSlot.teacherId) {
        return {
          hasConflict: true,
          reason: `Teacher clash: ${newSlot.teacherName} is already assigned to ${slot.grade}-${slot.section} for Period ${slot.periodNumber} on ${slot.dayOfWeek}.`
        };
      }

      // 2. Room Double-Booking Check
      if (
        slot.room &&
        newSlot.room &&
        slot.room.trim().toLowerCase() === newSlot.room.trim().toLowerCase()
      ) {
        return {
          hasConflict: true,
          reason: `Room clash: Room ${newSlot.room} is already occupied by ${slot.grade}-${slot.section} (${slot.subject}) during Period ${slot.periodNumber}.`
        };
      }

      // 3. Class Double-Booking Check
      if (slot.grade === newSlot.grade && slot.section === newSlot.section) {
        return {
          hasConflict: true,
          reason: `Class clash: ${newSlot.grade}-${newSlot.section} already has ${slot.subject} scheduled for Period ${slot.periodNumber}.`
        };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Validates examination marks with bounds checking.
 */
export function validateExamMark(
  marksObtained: number,
  maxMarks: number
): { isValid: boolean; error?: string; grade: string } {
  if (isNaN(marksObtained)) {
    return { isValid: false, error: 'Marks must be a valid number', grade: 'F' };
  }
  if (marksObtained < 0) {
    return { isValid: false, error: 'Marks cannot be negative', grade: 'F' };
  }
  if (marksObtained > maxMarks) {
    return {
      isValid: false,
      error: `Marks obtained (${marksObtained}) cannot exceed maximum allowed marks (${maxMarks})`,
      grade: 'F'
    };
  }

  const percentage = (marksObtained / maxMarks) * 100;
  let grade = 'F';

  if (percentage >= 91) grade = 'A1';
  else if (percentage >= 81) grade = 'A2';
  else if (percentage >= 71) grade = 'B1';
  else if (percentage >= 61) grade = 'B2';
  else if (percentage >= 51) grade = 'C1';
  else if (percentage >= 41) grade = 'C2';
  else if (percentage >= 33) grade = 'D';

  return { isValid: true, grade };
}

/**
 * Computes fee invoice status based on due dates and payment totals.
 */
export function computeFeeStatus(
  amount: number,
  discount: number,
  paidAmount: number,
  dueDate: string
): 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' {
  const netDue = Math.max(0, amount - discount);
  if (paidAmount >= netDue) {
    return 'PAID';
  }

  const today = new Date().toISOString().split('T')[0];
  const isPastDue = today > dueDate;

  if (paidAmount > 0) {
    return isPastDue ? 'OVERDUE' : 'PARTIAL';
  }

  return isPastDue ? 'OVERDUE' : 'PENDING';
}

/**
 * Permission checks for role-based access control (RBAC).
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  SCHOOL_ADMIN: [
    'students:read', 'students:write',
    'teachers:read', 'teachers:write',
    'parents:read', 'parents:write',
    'classes:read', 'classes:write',
    'subjects:read', 'subjects:write',
    'attendance:read', 'attendance:write', 'attendance:override',
    'timetable:read', 'timetable:write',
    'homework:read', 'homework:write',
    'exams:read', 'exams:write', 'exams:publish',
    'fees:read', 'fees:write',
    'admissions:read', 'admissions:write',
    'notices:read', 'notices:write',
    'events:read', 'events:write',
    'reports:read',
    'audit:read',
    'settings:write'
  ],
  TEACHER: [
    'classes:assigned:read',
    'students:assigned:read',
    'attendance:assigned:write',
    'homework:assigned:write',
    'exams:assigned:marks:write',
    'notices:read', 'notices:assigned:write',
    'events:read',
    'messages:read', 'messages:write',
    'leave:apply'
  ],
  ACCOUNTANT: [
    'students:read',
    'fees:read', 'fees:write',
    'reports:financial:read',
    'notices:read'
  ],
  STAFF: [
    'notices:read',
    'events:read',
    'leave:apply'
  ],
  PARENT: [
    'children:read',
    'attendance:child:read',
    'homework:child:read',
    'timetable:child:read',
    'results:child:read',
    'fees:child:read', 'fees:child:pay',
    'notices:read',
    'events:read',
    'messages:child:write',
    'leave:child:apply'
  ],
  STUDENT: [
    'profile:self:read',
    'attendance:self:read',
    'homework:self:read', 'homework:self:submit',
    'timetable:self:read',
    'results:self:read',
    'notices:read',
    'events:read'
  ],
  GUEST: [
    'public:read'
  ]
};

export function hasPermission(role: UserRole, requiredPermission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  if (permissions.includes('*')) return true;
  return permissions.includes(requiredPermission);
}
