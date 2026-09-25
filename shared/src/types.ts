/**
 * Paradise Public School - Shared Models & Role System
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'STAFF'
  | 'PARENT'
  | 'STUDENT'
  | 'GUEST';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';

export type FeeStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AdmissionStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'ENROLLED';

export type ExamStatus = 'SCHEDULED' | 'ONGOING' | 'GRADING' | 'PUBLISHED';

export interface UserSession {
  id: string;
  loginId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserSession;
  redirectUrl: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  house?: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  parentId?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  busRoute?: string;
  busNumber?: string;
  attendanceRate: number;
  gpa: number;
  feeStatus: FeeStatus;
  avatarUrl?: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  occupation?: string;
  address: string;
  children: StudentProfile[];
}

export interface TeacherProfile {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualifications: string;
  joiningDate: string;
  avatarUrl?: string;
  assignedClasses: {
    grade: string;
    section: string;
    subject: string;
    isClassTeacher?: boolean;
  }[];
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  periodNumber: number;
  startTime: string;
  endTime: string;
  grade: string;
  section: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
}

export interface AttendanceEntry {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  rollNo: string;
  grade: string;
  section: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
  updatedAt?: string;
}

export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  teacherId: string;
  teacherName: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentUrl?: string;
  maxPoints: number;
  submissionCount?: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  submissionUrl?: string;
  notes?: string;
  status: 'SUBMITTED' | 'LATE' | 'GRADED' | 'RESUBMIT';
  marksObtained?: number;
  feedback?: string;
}

export interface Exam {
  id: string;
  title: string;
  academicYear: string;
  term: string;
  startDate: string;
  endDate: string;
  status: ExamStatus;
  subjects: {
    subject: string;
    examDate: string;
    startTime: string;
    endTime: string;
    maxMarks: number;
    passingMarks: number;
  }[];
}

export interface StudentResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  subjects: {
    subject: string;
    marksObtained: number;
    maxMarks: number;
    grade: string;
    remarks?: string;
  }[];
  totalMarks: number;
  maxTotal: number;
  percentage: number;
  gpa: number;
  rank?: number;
  overallGrade: string;
  teacherRemarks?: string;
  isPublished: boolean;
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  term: string;
  dueDate: string;
  amount: number;
  discount: number;
  paidAmount: number;
  status: FeeStatus;
  breakdown: {
    tuition: number;
    laboratory?: number;
    sports?: number;
    transport?: number;
    library?: number;
    development?: number;
  };
  payments: {
    id: string;
    amount: number;
    date: string;
    method: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'CHEQUE';
    transactionId: string;
    receiptNo: string;
  }[];
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: 'STUDENT' | 'TEACHER' | 'STAFF';
  grade?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewRemarks?: string;
}

export interface SchoolNotice {
  id: string;
  title: string;
  category: 'EXAMINATION' | 'SPORTS' | 'ACADEMIC' | 'HOLIDAY' | 'URGENT' | 'GENERAL';
  targetAudience: 'ALL' | 'PARENTS' | 'STUDENTS' | 'TEACHERS' | 'STAFF';
  targetGrade?: string;
  targetSection?: string;
  date: string;
  content: string;
  pdfUrl?: string;
  author: string;
  isPinned: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachmentUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetModule: string;
  targetId?: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}
