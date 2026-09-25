import { AuthService } from '../services/authService';
import { TimetableService } from '../services/timetableService';
import { ExamService } from '../services/examService';
import { FeeService } from '../services/feeService';
import { AttendanceService } from '../services/attendanceService';
import { AuditService } from '../services/auditService';
import { db } from '../database';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log(`=======================================================`);
  console.log(`🧪 Running Paradise Public School ERP Automated Tests`);
  console.log(`=======================================================\n`);

  // 1. AUTHENTICATION TESTS
  console.log(`[1] Authentication & RBAC Tests:`);
  try {
    const adminLogin = await AuthService.login('admin', 'renugupta@19');
    assert(adminLogin.success && adminLogin.user.role === 'SUPER_ADMIN', 'Admin login succeeds with SUPER_ADMIN role');
    assert(adminLogin.redirectUrl === '/admin/dashboard', 'Admin redirectUrl points to /admin/dashboard');

    const teacherLogin = await AuthService.login('sunita.science', 'teacher123');
    assert(teacherLogin.success && teacherLogin.user.role === 'TEACHER', 'Teacher login succeeds with TEACHER role');

    const parentLogin = await AuthService.login('vikram.sharma', 'parent123');
    assert(parentLogin.success && parentLogin.user.role === 'PARENT', 'Parent login succeeds with PARENT role');
    assert(parentLogin.user.profile && parentLogin.user.profile.children.length === 2, 'Parent profile has multiple linked children');

    const studentLogin = await AuthService.login('aryan10', 'password123');
    assert(studentLogin.success && studentLogin.user.role === 'STUDENT', 'Student login succeeds with STUDENT role');

    let badAuthFailed = false;
    try {
      await AuthService.login('admin', 'wrong_password_123');
    } catch {
      badAuthFailed = true;
    }
    assert(badAuthFailed, 'Invalid password correctly throws authentication error');
  } catch (err: any) {
    assert(false, `Authentication test failed unexpectedly: ${err.message}`);
  }

  // 2. TIMETABLE CONFLICT DETECTION TESTS
  console.log(`\n[2] Timetable Conflict Detection Tests:`);
  try {
    // Attempt to book a teacher who is already busy
    let teacherClashCaught = false;
    try {
      TimetableService.createSlot({
        dayOfWeek: 'MONDAY',
        periodNumber: 1, // Mrs. Sunita Verma is already booked in Period 1
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        grade: 'Class 7',
        section: 'A',
        subject: 'Science',
        teacherId: 'tch-1',
        teacherName: 'Mrs. Sunita Verma',
        room: 'Room 202'
      });
    } catch (err: any) {
      if (err.message.includes('Teacher Conflict')) {
        teacherClashCaught = true;
      }
    }
    assert(teacherClashCaught, 'Double-booking teacher at same period and day is strictly rejected');

    // Attempt to book a room that is already occupied
    let roomClashCaught = false;
    try {
      TimetableService.createSlot({
        dayOfWeek: 'MONDAY',
        periodNumber: 1, // Science Lab 1 is already occupied by 8-A
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        grade: 'Class 6',
        section: 'A',
        subject: 'Physics',
        teacherId: 'tch-2',
        teacherName: 'Mr. Rajesh Iyer',
        room: 'Science Lab 1'
      });
    } catch (err: any) {
      if (err.message.includes('Room Conflict')) {
        roomClashCaught = true;
      }
    }
    assert(roomClashCaught, 'Double-booking room at same period and day is strictly rejected');

    // Schedule a valid non-conflicting slot
    const validSlot = TimetableService.createSlot({
      dayOfWeek: 'WEDNESDAY',
      periodNumber: 4,
      startTime: '11:30 AM',
      endTime: '12:20 PM',
      grade: 'Class 8',
      section: 'A',
      subject: 'Robotics',
      teacherId: 'tch-1',
      teacherName: 'Mrs. Sunita Verma',
      room: 'STEM Studio'
    });
    assert(!!validSlot.id, 'Non-conflicting timetable slot is scheduled successfully');
  } catch (err: any) {
    assert(false, `Timetable test error: ${err.message}`);
  }

  // 3. EXAM MARKS VALIDATION TESTS
  console.log(`\n[3] Exam Marks Validation Tests:`);
  try {
    let excessMarksCaught = false;
    try {
      ExamService.enterStudentMarks('ex-1', 'std-1', [
        { subject: 'Maths', marksObtained: 105 } // Maximum marks is 100
      ]);
    } catch (err: any) {
      if (err.message.includes('cannot exceed maximum')) {
        excessMarksCaught = true;
      }
    }
    assert(excessMarksCaught, 'Marks exceeding maximum allowed marks are strictly rejected');

    let negativeMarksCaught = false;
    try {
      ExamService.enterStudentMarks('ex-1', 'std-1', [
        { subject: 'Maths', marksObtained: -5 }
      ]);
    } catch (err: any) {
      if (err.message.includes('negative') || err.message.includes('Validation Error')) {
        negativeMarksCaught = true;
      }
    }
    assert(negativeMarksCaught, 'Negative marks are strictly rejected');

    const validGrading = ExamService.enterStudentMarks('ex-1', 'std-1', [
      { subject: 'Maths', marksObtained: 95 },
      { subject: 'Science', marksObtained: 92 },
      { subject: 'English', marksObtained: 88 },
      { subject: 'Social Science', marksObtained: 85 },
      { subject: 'Hindi', marksObtained: 90 }
    ], 'Consistent academic excellence.');
    assert(validGrading.percentage === 90 && validGrading.gpa === 9, 'Valid marks calculate percentage and GPA accurately');
  } catch (err: any) {
    assert(false, `Exam marks test error: ${err.message}`);
  }

  // 4. FEE BILLING & PAYMENT TESTS
  console.log(`\n[4] Fee Billing & Invoicing Tests:`);
  try {
    const summary = FeeService.getSummary();
    assert(summary.totalExpected > 0 && summary.totalCollected > 0, 'Fee metrics aggregate expected and collected amounts');

    const paymentResult = FeeService.recordPayment('inv-1', 35000, 'UPI', 'TXN-TEST-12345');
    assert(paymentResult.success && paymentResult.invoice.status === 'PAID', 'Full payment transitions invoice status to PAID');
    assert(!!paymentResult.payment.receiptNo, 'Instant receipt number generated with payment');

    let overpaymentBlocked = false;
    try {
      FeeService.recordPayment('inv-1', 5000, 'CASH');
    } catch {
      overpaymentBlocked = true;
    }
    assert(overpaymentBlocked, 'Overpaying on settled invoice is strictly rejected');
  } catch (err: any) {
    assert(false, `Fee test error: ${err.message}`);
  }

  // 5. ATTENDANCE REGISTER TESTS
  console.log(`\n[5] Attendance Register Tests:`);
  try {
    const testDate = '2026-09-01';
    const updated = AttendanceService.markClassAttendance(
      'Class 8',
      'A',
      testDate,
      [
        { studentId: 'std-1', status: 'PRESENT' },
        { studentId: 'std-2', status: 'ABSENT', remarks: 'Fever' }
      ],
      'Mrs. Sunita Verma'
    );
    assert(updated.length === 2, 'Marked roll call attendance for class students');

    // Duplicate check: Update same day with different status
    const reMarked = AttendanceService.markClassAttendance(
      'Class 8',
      'A',
      testDate,
      [{ studentId: 'std-2', status: 'PRESENT', remarks: 'Late arrival authorized' }],
      'Mrs. Sunita Verma'
    );
    assert(reMarked[0].status === 'PRESENT', 'Duplicate check cleanly upserts attendance for same scholar and date');
  } catch (err: any) {
    assert(false, `Attendance test error: ${err.message}`);
  }

  // 6. AUDIT LOGGING TESTS
  console.log(`\n[6] Audit Logging Tests:`);
  try {
    const logEntry = AuditService.log(
      'usr-admin-1',
      'Dr. Renu Gupta',
      'SUPER_ADMIN',
      'TEST_ACTION',
      'SYSTEM',
      'Verified audit logging integrity'
    );
    assert(!!logEntry.id && logEntry.action === 'TEST_ACTION', 'Administrative action recorded in audit log with metadata');
  } catch (err: any) {
    assert(false, `Audit log test error: ${err.message}`);
  }

  console.log(`\n=======================================================`);
  console.log(`📊 Test Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log(`=======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
