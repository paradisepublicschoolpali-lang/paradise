export type UserRole = 'guest' | 'parent' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string;
  grade?: string;
  section?: string;
  loginId?: string;
}

export interface Student {
  id: string;
  loginId: string;
  password?: string;
  admissionNo: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  house: 'Phoenix Gold' | 'Royal Gryphon' | 'Emerald Dragon' | 'Solar Falcon';
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  busRoute?: string;
  busNumber?: string;
  lockerNumber?: string;
  avatar: string;
  attendanceRate: number; // e.g. 96.5
  gpa: number; // e.g. 3.9
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
}

export interface Teacher {
  id: string;
  loginId: string;
  password?: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  qualification: string;
  experienceYears: number;
  assignedClasses: {
    grade: string;
    section: string;
    subject: string;
  }[];
  avatar: string;
  joiningDate: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Urgent' | 'Academic' | 'Examination' | 'Sports' | 'Holiday' | 'General';
  targetAudience: 'All' | 'Parents' | 'Teachers' | 'Students';
  date: string;
  content: string;
  pdfUrl?: string;
  author: string;
  isPinned: boolean;
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
  previousSchool: string;
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Interview Scheduled' | 'Accepted' | 'Rejected';
  notes?: string;
  testScore?: number;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  attachments?: string[];
  maxPoints: number;
  status: 'Active' | 'Closed';
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  status: 'Submitted' | 'Graded' | 'Pending';
  score?: number;
  feedback?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  remarks?: string;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

export interface SubjectResult {
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  examName: string;
  academicYear: string;
  subjects: SubjectResult[];
  totalMarks: number;
  maxTotal: number;
  percentage: number;
  gpa: number;
  rank: number;
  overallGrade: string;
  teacherRemarks: string;
}

export interface FeeItem {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  term: string;
  dueDate: string;
  breakdown: {
    tuition: number;
    transport?: number;
    labAndLibrary?: number;
    sportsAndActivities?: number;
    developmentFund?: number;
  };
  totalAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentDate?: string;
  paymentMethod?: 'Credit Card' | 'Debit Card' | 'UPI' | 'Net Banking' | 'Bank Wire';
  transactionId?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'Sports' | 'Cultural' | 'Academic' | 'Exhibition' | 'Workshop';
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

export interface SchoolConfig {
  schoolName: string;
  motto: string;
  affiliationCode: string;
  academicYear: string;
  currentTerm: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  principalName: string;
  principalPhoto: string;
  principalMessage: string;
  heroHeadline: string;
  heroSubtitle: string;
  logoType: 'shield' | 'image';
  logoLetter: string;
  logoShieldColor: string;
  logoAccentColor: string;
  logoImageUrl: string;
}
