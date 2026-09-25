import bcrypt from 'bcryptjs';

export interface DbUser {
  id: string;
  loginId: string;
  email: string;
  phone?: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'STAFF' | 'PARENT' | 'STUDENT' | 'GUEST';
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DbStudent {
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
  feeStatus: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
}

export interface DbParent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  occupation?: string;
  address: string;
  childIds: string[];
}

export interface DbTeacher {
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
  assignedClasses: {
    grade: string;
    section: string;
    subject: string;
    isClassTeacher?: boolean;
  }[];
}

export interface DbTimetableSlot {
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

export interface DbAttendance {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  rollNo: string;
  grade: string;
  section: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';
  remarks?: string;
  recordedBy: string;
}

export interface DbHomework {
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
}

export interface DbHomeworkSubmission {
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

export interface DbExam {
  id: string;
  title: string;
  academicYear: string;
  term: string;
  startDate: string;
  endDate: string;
  status: 'SCHEDULED' | 'ONGOING' | 'GRADING' | 'PUBLISHED';
  subjects: {
    subject: string;
    examDate: string;
    startTime: string;
    endTime: string;
    maxMarks: number;
    passingMarks: number;
  }[];
}

export interface DbExamResult {
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

export interface DbFeeInvoice {
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
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  breakdown: {
    tuition: number;
    laboratory?: number;
    sports?: number;
    transport?: number;
    library?: number;
  };
  payments: {
    id: string;
    amount: number;
    date: string;
    method: string;
    transactionId: string;
    receiptNo: string;
  }[];
}

export interface DbLeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantRole: 'STUDENT' | 'TEACHER' | 'STAFF';
  grade?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  reviewedBy?: string;
  reviewRemarks?: string;
}

export interface DbNotice {
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

export interface DbEvent {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  coverImage: string;
  rsvpCount: number;
  isUpcoming: boolean;
}

export interface DbMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface DbAdmission {
  id: string;
  applicationNo: string;
  applicantName: string;
  gradeApplying: string;
  dob: string;
  gender: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool?: string;
  submissionDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'ACCEPTED' | 'REJECTED' | 'ENROLLED';
  notes?: string;
  testScore?: number;
}

export interface DbAuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  targetModule: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

/**
 * In-memory Relational Database State
 */
class Database {
  users: DbUser[] = [];
  students: DbStudent[] = [];
  parents: DbParent[] = [];
  teachers: DbTeacher[] = [];
  timetable: DbTimetableSlot[] = [];
  attendance: DbAttendance[] = [];
  homework: DbHomework[] = [];
  submissions: DbHomeworkSubmission[] = [];
  exams: DbExam[] = [];
  results: DbExamResult[] = [];
  feeInvoices: DbFeeInvoice[] = [];
  leaveRequests: DbLeaveRequest[] = [];
  notices: DbNotice[] = [];
  events: DbEvent[] = [];
  messages: DbMessage[] = [];
  admissions: DbAdmission[] = [];
  auditLogs: DbAuditLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 8);
    const adminPasswordHash = bcrypt.hashSync('renugupta@19', 8);
    const teacherPasswordHash = bcrypt.hashSync('teacher123', 8);

    // 1. Users
    this.users = [
      {
        id: 'usr-admin-1',
        loginId: 'admin',
        email: 'principal@paradiseschool.edu',
        phone: '+91 2932 224567',
        passwordHash: adminPasswordHash,
        name: 'Dr. Renu Gupta',
        role: 'SUPER_ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-01-01'
      },
      {
        id: 'usr-acc-1',
        loginId: 'accountant',
        email: 'accounts@paradiseschool.edu',
        phone: '+91 2932 224568',
        passwordHash: bcrypt.hashSync('accounts123', 8),
        name: 'Mr. Naresh Agarwal',
        role: 'ACCOUNTANT',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-01-05'
      },
      {
        id: 'usr-tch-1',
        loginId: 'sunita.science',
        email: 's.verma@paradiseschool.edu',
        phone: '+91 98110 23456',
        passwordHash: teacherPasswordHash,
        name: 'Mrs. Sunita Verma',
        role: 'TEACHER',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-01-10'
      },
      {
        id: 'usr-tch-2',
        loginId: 'rajesh.math',
        email: 'r.iyer@paradiseschool.edu',
        phone: '+91 98205 34567',
        passwordHash: teacherPasswordHash,
        name: 'Mr. Rajesh Iyer',
        role: 'TEACHER',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-01-10'
      },
      {
        id: 'usr-par-1',
        loginId: 'vikram.sharma',
        email: 'vikram.sharma@gmail.com',
        phone: '+91 98290 34567',
        passwordHash: bcrypt.hashSync('parent123', 8),
        name: 'Mr. Vikram Sharma',
        role: 'PARENT',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      },
      {
        id: 'usr-std-1',
        loginId: 'aryan10',
        email: 'aryan.sharma@student.paradise.edu',
        phone: '+91 98290 34567',
        passwordHash: defaultPasswordHash,
        name: 'Aryan Sharma',
        role: 'STUDENT',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      },
      {
        id: 'usr-std-2',
        loginId: 'anvi1',
        email: 'anvi.sharma@student.paradise.edu',
        phone: '+91 98290 34567',
        passwordHash: defaultPasswordHash,
        name: 'Anvi Sharma',
        role: 'STUDENT',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      },
      {
        id: 'usr-std-3',
        loginId: 'ananya10',
        email: 'ananya.deshmukh@student.paradise.edu',
        phone: '+91 98291 45678',
        passwordHash: defaultPasswordHash,
        name: 'Ananya Deshmukh',
        role: 'STUDENT',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      },
      {
        id: 'usr-std-4',
        loginId: 'aarav7',
        email: 'aarav.gupta@student.paradise.edu',
        phone: '+91 98292 22334',
        passwordHash: defaultPasswordHash,
        name: 'Aarav Gupta',
        role: 'STUDENT',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      },
      {
        id: 'usr-std-5',
        loginId: 'ishaan6',
        email: 'ishaan.verma@student.paradise.edu',
        phone: '+91 98293 88990',
        passwordHash: defaultPasswordHash,
        name: 'Ishaan Verma',
        role: 'STUDENT',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      },
      {
        id: 'usr-std-6',
        loginId: 'diya8',
        email: 'diya.rathore@student.paradise.edu',
        phone: '+91 98294 11223',
        passwordHash: defaultPasswordHash,
        name: 'Diya Rathore',
        role: 'STUDENT',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        isActive: true,
        createdAt: '2026-02-01'
      }
    ];

    // 2. Teachers
    this.teachers = [
      {
        id: 'tch-1',
        userId: 'usr-tch-1',
        employeeId: 'PPS-FAC-014',
        name: 'Mrs. Sunita Verma',
        email: 's.verma@paradiseschool.edu',
        phone: '+91 98110 23456',
        department: 'Science',
        designation: 'Head of Department - Sciences',
        qualifications: 'M.Sc. Physics, B.Ed (Rajasthan Univ)',
        joiningDate: '2016-07-01',
        assignedClasses: [
          { grade: 'Class 8', section: 'A', subject: 'Science', isClassTeacher: true },
          { grade: 'Class 7', section: 'A', subject: 'Science' },
          { grade: 'Class 6', section: 'A', subject: 'Science' }
        ]
      },
      {
        id: 'tch-2',
        userId: 'usr-tch-2',
        employeeId: 'PPS-FAC-022',
        name: 'Mr. Rajesh Iyer',
        email: 'r.iyer@paradiseschool.edu',
        phone: '+91 98205 34567',
        department: 'Mathematics',
        designation: 'Senior Faculty - Mathematics',
        qualifications: 'M.Sc. Mathematics, B.Ed (CMI)',
        joiningDate: '2014-08-15',
        assignedClasses: [
          { grade: 'Class 8', section: 'A', subject: 'Maths' },
          { grade: 'Class 7', section: 'B', subject: 'Maths', isClassTeacher: true }
        ]
      }
    ];

    // 3. Parents
    this.parents = [
      {
        id: 'par-1',
        userId: 'usr-par-1',
        name: 'Mr. Vikram Sharma',
        email: 'vikram.sharma@gmail.com',
        phone: '+91 98290 34567',
        alternatePhone: '+91 2932 220011',
        occupation: 'Chartered Accountant',
        address: 'Flat 402, Golden Heights, Station Road, Pali, Rajasthan - 306401',
        childIds: ['std-1', 'std-2']
      }
    ];

    // 4. Students
    this.students = [
      {
        id: 'std-1',
        userId: 'usr-std-1',
        admissionNo: 'PPS-2022-0842',
        rollNo: '08A-18',
        name: 'Aryan Sharma',
        grade: 'Class 8',
        section: 'A',
        house: 'Ashoka House',
        dob: '2012-04-14',
        gender: 'MALE',
        bloodGroup: 'O+',
        parentId: 'par-1',
        guardianName: 'Vikram Sharma',
        guardianPhone: '+91 98290 34567',
        guardianEmail: 'vikram.sharma@gmail.com',
        address: 'Flat 402, Golden Heights, Station Road, Pali, Rajasthan - 306401',
        busRoute: 'Route 1 - Sumerpur Road & Housing Board',
        busNumber: 'RJ-22-PA-0418',
        attendanceRate: 96.4,
        gpa: 9.8,
        feeStatus: 'PENDING'
      },
      {
        id: 'std-2',
        userId: 'usr-std-2',
        admissionNo: 'PPS-2025-1104',
        rollNo: '01A-06',
        name: 'Anvi Sharma',
        grade: 'Class 1',
        section: 'A',
        house: 'Tagore House',
        dob: '2019-10-11',
        gender: 'FEMALE',
        bloodGroup: 'B+',
        parentId: 'par-1',
        guardianName: 'Vikram Sharma',
        guardianPhone: '+91 98290 34567',
        guardianEmail: 'vikram.sharma@gmail.com',
        address: 'Flat 402, Golden Heights, Station Road, Pali, Rajasthan - 306401',
        busRoute: 'Route 1 - Sumerpur Road & Housing Board',
        busNumber: 'RJ-22-PA-0418',
        attendanceRate: 98.8,
        gpa: 10.0,
        feeStatus: 'PAID'
      },
      {
        id: 'std-3',
        userId: 'usr-std-3',
        admissionNo: 'PPS-2022-0711',
        rollNo: '08A-04',
        name: 'Ananya Deshmukh',
        grade: 'Class 8',
        section: 'A',
        house: 'Tagore House',
        dob: '2012-08-22',
        gender: 'FEMALE',
        bloodGroup: 'B+',
        guardianName: 'Dr. Rajesh Deshmukh',
        guardianPhone: '+91 98291 45678',
        guardianEmail: 'dr.deshmukh@gmail.com',
        address: 'B-18, Mandiya Road, Pali, Rajasthan - 306401',
        busRoute: 'Route 2 - Suraj Pole & Mandiya Road',
        busNumber: 'RJ-22-PA-0210',
        attendanceRate: 98.2,
        gpa: 9.9,
        feeStatus: 'PAID'
      },
      {
        id: 'std-4',
        userId: 'usr-std-4',
        admissionNo: 'PPS-2023-0912',
        rollNo: '07A-12',
        name: 'Aarav Gupta',
        grade: 'Class 7',
        section: 'A',
        house: 'Shivaji House',
        dob: '2013-01-19',
        gender: 'MALE',
        bloodGroup: 'A+',
        guardianName: 'Sanjay Gupta',
        guardianPhone: '+91 98292 22334',
        guardianEmail: 'sanjay.gupta@enterprise.in',
        address: 'Plot 77, Housing Board Colony, Pali, Rajasthan - 306401',
        busRoute: 'Route 3 - Station Road & Tagore Nagar',
        busNumber: 'RJ-22-PA-0105',
        attendanceRate: 93.5,
        gpa: 9.4,
        feeStatus: 'PAID'
      },
      {
        id: 'std-5',
        userId: 'usr-std-5',
        admissionNo: 'PPS-2021-0624',
        rollNo: '06A-25',
        name: 'Ishaan Verma',
        grade: 'Class 6',
        section: 'A',
        house: 'Raman House',
        dob: '2014-03-30',
        gender: 'MALE',
        bloodGroup: 'AB+',
        guardianName: 'Manoj Verma',
        guardianPhone: '+91 98293 88990',
        guardianEmail: 'manoj.verma@steelworks.com',
        address: '12, Industrial Area Phase 1, Pali, Rajasthan - 306401',
        busRoute: 'Route 4 - Industrial Area & Bus Stand',
        busNumber: 'RJ-22-PA-0312',
        attendanceRate: 95.1,
        gpa: 9.2,
        feeStatus: 'PAID'
      },
      {
        id: 'std-6',
        userId: 'usr-std-6',
        admissionNo: 'PPS-2022-0819',
        rollNo: '08A-11',
        name: 'Diya Rathore',
        grade: 'Class 8',
        section: 'A',
        house: 'Ashoka House',
        dob: '2012-07-09',
        gender: 'FEMALE',
        bloodGroup: 'O-',
        guardianName: 'Mahendra Singh Rathore',
        guardianPhone: '+91 98294 11223',
        guardianEmail: 'm.rathore@heritagehotel.com',
        address: 'Fort Road, Near Somnath Temple, Pali, Rajasthan - 306401',
        busRoute: 'Route 1 - Sumerpur Road & Housing Board',
        busNumber: 'RJ-22-PA-0418',
        attendanceRate: 97.4,
        gpa: 9.6,
        feeStatus: 'PENDING'
      }
    ];

    // 5. Timetable Slots
    this.timetable = [
      {
        id: 'tt-1',
        dayOfWeek: 'MONDAY',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        grade: 'Class 8',
        section: 'A',
        subject: 'Science',
        teacherId: 'tch-1',
        teacherName: 'Mrs. Sunita Verma',
        room: 'Science Lab 1'
      },
      {
        id: 'tt-2',
        dayOfWeek: 'MONDAY',
        periodNumber: 2,
        startTime: '09:30 AM',
        endTime: '10:20 AM',
        grade: 'Class 8',
        section: 'A',
        subject: 'Maths',
        teacherId: 'tch-2',
        teacherName: 'Mr. Rajesh Iyer',
        room: 'Room 108'
      },
      {
        id: 'tt-3',
        dayOfWeek: 'TUESDAY',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        grade: 'Class 8',
        section: 'A',
        subject: 'Science',
        teacherId: 'tch-1',
        teacherName: 'Mrs. Sunita Verma',
        room: 'Science Lab 1'
      }
    ];

    // 6. Attendance Entries
    this.attendance = [
      {
        id: 'att-1',
        studentId: 'std-1',
        studentName: 'Aryan Sharma',
        admissionNo: 'PPS-2022-0842',
        rollNo: '08A-18',
        grade: 'Class 8',
        section: 'A',
        date: '2026-08-25',
        status: 'PRESENT',
        recordedBy: 'Mrs. Sunita Verma'
      },
      {
        id: 'att-2',
        studentId: 'std-1',
        studentName: 'Aryan Sharma',
        admissionNo: 'PPS-2022-0842',
        rollNo: '08A-18',
        grade: 'Class 8',
        section: 'A',
        date: '2026-08-24',
        status: 'PRESENT',
        recordedBy: 'Mrs. Sunita Verma'
      },
      {
        id: 'att-3',
        studentId: 'std-1',
        studentName: 'Aryan Sharma',
        admissionNo: 'PPS-2022-0842',
        rollNo: '08A-18',
        grade: 'Class 8',
        section: 'A',
        date: '2026-08-22',
        status: 'LATE',
        remarks: 'Bus route maintenance delay',
        recordedBy: 'Mrs. Sunita Verma'
      }
    ];

    // 7. Homework
    this.homework = [
      {
        id: 'hw-1',
        title: 'Plant & Animal Cell Structure & Microscope Practical',
        subject: 'Science',
        grade: 'Class 8',
        section: 'A',
        teacherId: 'tch-1',
        teacherName: 'Mrs. Sunita Verma',
        description: 'Observe microscopic slides of onion peel and cheek cells. Draw labeled diagrams and identify cellular organelles.',
        assignedDate: '2026-08-22',
        dueDate: '2026-08-30',
        maxPoints: 50,
        attachmentUrl: 'https://paradise-public-school.web.app/docs/cells-worksheet.pdf'
      },
      {
        id: 'hw-2',
        title: 'Linear Equations in One Variable - NCERT Exercise 3.2',
        subject: 'Maths',
        grade: 'Class 8',
        section: 'A',
        teacherId: 'tch-2',
        teacherName: 'Mr. Rajesh Iyer',
        description: 'Solve NCERT exercise set 3.2 (Problems 1 through 20) on algebraic word problems and perimeter balance equations.',
        assignedDate: '2026-08-24',
        dueDate: '2026-09-02',
        maxPoints: 40
      }
    ];

    // 8. Exam & Results
    this.exams = [
      {
        id: 'ex-1',
        title: 'CBSE Term 1 Comprehensive Assessment 2026',
        academicYear: '2026-2027',
        term: 'Term 1',
        startDate: '2026-09-15',
        endDate: '2026-09-24',
        status: 'PUBLISHED',
        subjects: [
          { subject: 'Maths', examDate: '2026-09-15', startTime: '08:30 AM', endTime: '11:30 AM', maxMarks: 100, passingMarks: 33 },
          { subject: 'Science', examDate: '2026-09-17', startTime: '08:30 AM', endTime: '11:30 AM', maxMarks: 100, passingMarks: 33 },
          { subject: 'English', examDate: '2026-09-19', startTime: '08:30 AM', endTime: '11:30 AM', maxMarks: 100, passingMarks: 33 },
          { subject: 'Social Science', examDate: '2026-09-21', startTime: '08:30 AM', endTime: '11:30 AM', maxMarks: 100, passingMarks: 33 },
          { subject: 'Hindi', examDate: '2026-09-23', startTime: '08:30 AM', endTime: '11:30 AM', maxMarks: 100, passingMarks: 33 }
        ]
      }
    ];

    this.results = [
      {
        id: 'res-1',
        examId: 'ex-1',
        examName: 'CBSE Term 1 Comprehensive Assessment 2026',
        studentId: 'std-1',
        studentName: 'Aryan Sharma',
        grade: 'Class 8',
        section: 'A',
        subjects: [
          { subject: 'Maths', marksObtained: 98, maxMarks: 100, grade: 'A1', remarks: 'Flawless algebraic proofs' },
          { subject: 'Science', marksObtained: 96, maxMarks: 100, grade: 'A1', remarks: 'Distinction in practicals' },
          { subject: 'English', marksObtained: 92, maxMarks: 100, grade: 'A1', remarks: 'Rich vocabulary & grammar' },
          { subject: 'Social Science', marksObtained: 90, maxMarks: 100, grade: 'A1', remarks: 'Good historical analysis' },
          { subject: 'Hindi', marksObtained: 91, maxMarks: 100, grade: 'A1', remarks: 'Exemplary literature essay' }
        ],
        totalMarks: 467,
        maxTotal: 500,
        percentage: 93.4,
        gpa: 9.8,
        rank: 1,
        overallGrade: 'A1 (Gold Honors)',
        teacherRemarks: 'Aryan demonstrates exceptional academic rigor and exemplary peer leadership in Class 8-A.',
        isPublished: true
      }
    ];

    // 9. Fee Invoices
    this.feeInvoices = [
      {
        id: 'inv-1',
        invoiceNo: 'INV-2026-Q3-018',
        studentId: 'std-1',
        studentName: 'Aryan Sharma',
        grade: 'Class 8',
        section: 'A',
        term: 'Quarter 3 (Oct - Dec 2026)',
        dueDate: '2026-10-15',
        amount: 35000,
        discount: 0,
        paidAmount: 0,
        status: 'PENDING',
        breakdown: { tuition: 30000, laboratory: 3000, sports: 2000 },
        payments: []
      },
      {
        id: 'inv-2',
        invoiceNo: 'INV-2026-Q2-018',
        studentId: 'std-1',
        studentName: 'Aryan Sharma',
        grade: 'Class 8',
        section: 'A',
        term: 'Quarter 2 (Jul - Sep 2026)',
        dueDate: '2026-07-15',
        amount: 35000,
        discount: 0,
        paidAmount: 35000,
        status: 'PAID',
        breakdown: { tuition: 30000, laboratory: 3000, sports: 2000 },
        payments: [
          {
            id: 'pay-1',
            amount: 35000,
            date: '2026-07-10',
            method: 'UPI',
            transactionId: 'TXN-UPI-98321049',
            receiptNo: 'REC-2026-0710-01'
          }
        ]
      }
    ];

    // 10. Notices
    this.notices = [
      {
        id: 'not-1',
        title: 'CBSE Middle School Term 1 Assessment Timetable 2026-27',
        category: 'EXAMINATION',
        targetAudience: 'ALL',
        date: '2026-08-25',
        content: 'The comprehensive timetable for Classes 1 to 8 Term 1 CBSE Unit Assessments has been finalized. Morning assessment sessions will commence at 08:30 AM sharp.',
        pdfUrl: 'https://paradise-public-school.web.app/docs/term1-schedule.pdf',
        author: 'Academic Directorate',
        isPinned: true
      },
      {
        id: 'not-2',
        title: '32nd Annual Athletic Olympiad & Inter-House Sports Gala',
        category: 'SPORTS',
        targetAudience: 'ALL',
        date: '2026-08-20',
        content: 'We are delighted to announce the 32nd Annual Sports Gala scheduled for September 18-20, 2026. Events include Track & Field, Swimming, Gymnastics, and Fun Relays.',
        pdfUrl: 'https://paradise-public-school.web.app/docs/sports-schedule.pdf',
        author: 'Director of Physical Education',
        isPinned: true
      }
    ];

    // 11. Events
    this.events = [
      {
        id: 'evt-1',
        title: '32nd Annual Junior Sports Gala & Athletic Meet',
        category: 'Sports',
        date: '2026-09-18',
        time: '08:30 AM - 04:30 PM',
        venue: 'Main Campus Athletic Field & Arena',
        description: 'Three days of inter-house athletic events, track sprints, swimming heats, and yoga for Nursery to Class 8.',
        coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
        rsvpCount: 428,
        isUpcoming: true
      }
    ];

    // 12. Messages
    this.messages = [
      {
        id: 'msg-1',
        conversationId: 'conv-par-tch-1',
        senderId: 'usr-par-1',
        senderName: 'Mr. Vikram Sharma',
        senderRole: 'PARENT',
        receiverId: 'usr-tch-1',
        receiverName: 'Mrs. Sunita Verma',
        content: 'Good morning Mrs. Verma. I wanted to verify the practical science project requirements for Aryan.',
        timestamp: '2026-08-25T09:15:00Z',
        isRead: true
      },
      {
        id: 'msg-2',
        conversationId: 'conv-par-tch-1',
        senderId: 'usr-tch-1',
        senderName: 'Mrs. Sunita Verma',
        senderRole: 'TEACHER',
        receiverId: 'usr-par-1',
        receiverName: 'Mr. Vikram Sharma',
        content: 'Hello Mr. Sharma. Aryan can choose between Plant Cell slide observation or the atmospheric pressure demonstration.',
        timestamp: '2026-08-25T10:30:00Z',
        isRead: true
      }
    ];

    // 13. Admissions
    this.admissions = [
      {
        id: 'adm-1',
        applicationNo: 'PPS-ADM-2026-0042',
        applicantName: 'Devansh Kulkarni',
        gradeApplying: 'Class 8',
        dob: '2012-12-14',
        gender: 'MALE',
        parentName: 'Sanjay Kulkarni',
        parentEmail: 'sanjay.kulkarni@gmail.com',
        parentPhone: '+91 98290 45671',
        address: 'Flat 94, Crescent Heights, Sumerpur Road, Pali, Rajasthan - 306401',
        previousSchool: 'Central Academy, Pali',
        submissionDate: '2026-08-24',
        status: 'INTERVIEW_SCHEDULED',
        notes: 'Outstanding mathematics aptitude.',
        testScore: 94
      }
    ];

    // 14. Audit Logs
    this.auditLogs = [
      {
        id: 'aud-1',
        userId: 'usr-admin-1',
        userName: 'Dr. Renu Gupta',
        userRole: 'SUPER_ADMIN',
        action: 'EXAM_RESULT_PUBLISHED',
        targetModule: 'EXAMS',
        targetId: 'ex-1',
        details: 'Published CBSE Term 1 Comprehensive Assessment 2026 results to student & parent portals.',
        timestamp: '2026-08-25T11:00:00Z'
      }
    ];
  }
}

export const db = new Database();
