export interface Notice {
  id: string;
  title: string;
  category: 'Examination' | 'Sports' | 'Academic' | 'Holiday' | 'Urgent' | 'General';
  targetAudience: 'All' | 'Parents' | 'Students' | 'Teachers';
  date: string;
  content: string;
  pdfUrl?: string;
  author: string;
  isPinned?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'Sports' | 'Exhibition' | 'Cultural' | 'Academic' | 'Celebration';
  date: string;
  time: string;
  venue: string;
  description: string;
  coverImage: string;
  rsvpCount: number;
  isUpcoming: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Sports' | 'Academics' | 'Arts & Culture' | 'Celebrations';
  imageUrl: string;
  description: string;
  date: string;
}

export interface Facility {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  imageUrl: string;
  features: string[];
}

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  applicantName: string;
  gradeApplying: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool?: string;
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Interview Scheduled' | 'Accepted' | 'Rejected';
  notes?: string;
}

export interface SchoolConfig {
  schoolName: string;
  motto: string;
  affiliationCode: string;
  academicYear: string;
  currentTerm: string;
  contactEmail: string;
  contactPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  visitingHours: string;
  schoolTimings: string;
  establishedYear: string;
  address: string;
  websiteUrl: string;
  principalName: string;
  principalRole: string;
  principalCredentials: string;
  principalPhoto: string;
  principalMessage: string;
  heroHeadline: string;
  heroSubtitle: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  house?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  busRoute?: string;
  busNumber?: string;
  attendanceRate: number;
  gpa: number;
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  avatarUrl?: string;
}

export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  teacherName: string;
  description: string;
  assignedDate: string;
  dueDate: string;
  attachmentUrl?: string;
  maxPoints: number;
  isSubmitted?: boolean;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  startTime: string;
  endTime: string;
  grade: string;
  section: string;
  subject: string;
  teacherName: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  remarks?: string;
  recordedBy: string;
}

export interface ExamResult {
  id: string;
  examName: string;
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
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  term: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  breakdown: {
    tuition: number;
    laboratory?: number;
    sports?: number;
    transport?: number;
  };
  payments: {
    id: string;
    amount: number;
    date: string;
    method: string;
    receiptNo: string;
  }[];
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student' | 'guest';

export interface MobileUser {
  id: string;
  loginId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string;
  grade?: string;
  section?: string;
  phone?: string;
}

export type RootTab = 'home' | 'academics' | 'attendance' | 'communication' | 'more';
export type MoreSubScreen = 'menu' | 'about' | 'admissions' | 'facilities' | 'contact' | 'fees' | 'settings';

