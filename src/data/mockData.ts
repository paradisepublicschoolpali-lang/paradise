import {
  Student,
  Teacher,
  Notice,
  AdmissionApplication,
  HomeworkItem,
  HomeworkSubmission,
  AttendanceRecord,
  LeaveApplication,
  ExamResult,
  FeeItem,
  SchoolEvent,
  GalleryItem,
  UserProfile,
  TeacherPeriod,
  SchoolSubject
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  guest: {
    id: 'guest-1',
    name: 'Guest Visitor',
    email: 'guest@paradiseschool.edu',
    role: 'guest',
  },
  parent: {
    id: 'std-1',
    loginId: 'aryan10',
    name: 'Aryan Sharma (Parent: Vikram Sharma)',
    email: 'vikram.sharma@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    grade: 'Class 8',
    section: 'A'
  },
  teacher: {
    id: 'tch-1',
    loginId: 'sunita.science',
    name: 'Mrs. Sunita Verma',
    email: 's.verma@paradiseschool.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    designation: 'Head of Department - Middle School Sciences'
  },
  admin: {
    id: 'adm-1',
    loginId: 'admin',
    name: 'Dr. Renu Gupta (Principal)',
    email: 'principal@paradiseschool.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=300',
    designation: 'Principal & Head of Institution'
  }
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    loginId: 'aryan10',
    password: 'password123',
    admissionNo: 'PPS-2022-0842',
    rollNo: '08A-18',
    name: 'Aryan Sharma',
    grade: 'Class 8',
    section: 'A',
    house: 'Phoenix Gold',
    dob: '2012-04-14',
    gender: 'Male',
    bloodGroup: 'O+',
    guardianName: 'Vikram Sharma',
    guardianPhone: '+91 98112 34567',
    guardianEmail: 'vikram.sharma@gmail.com',
    address: 'Flat 402, Golden Heights, Sector 14, Rohini, New Delhi - 110085',
    busRoute: 'Route 4 - Rohini & Pitampura Express',
    busNumber: 'DL-1PB-0418',
    lockerNumber: 'LK-08A-18',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 96.4,
    gpa: 3.92,
    feeStatus: 'Pending'
  },
  {
    id: 'std-2',
    loginId: 'ananya10',
    password: 'password123',
    admissionNo: 'PPS-2022-0711',
    rollNo: '08A-04',
    name: 'Ananya Deshmukh',
    grade: 'Class 8',
    section: 'A',
    house: 'Royal Gryphon',
    dob: '2012-08-22',
    gender: 'Female',
    bloodGroup: 'B+',
    guardianName: 'Dr. Rajesh Deshmukh',
    guardianPhone: '+91 98201 45678',
    guardianEmail: 'dr.deshmukh@gmail.com',
    address: 'B-18, Model Town Phase 2, New Delhi - 110009',
    busRoute: 'Route 2 - Model Town & Civil Lines',
    busNumber: 'DL-1PB-0210',
    lockerNumber: 'LK-08A-04',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 98.2,
    gpa: 3.98,
    feeStatus: 'Paid'
  },
  {
    id: 'std-3',
    loginId: 'aarav7',
    password: 'password123',
    admissionNo: 'PPS-2023-0912',
    rollNo: '07A-12',
    name: 'Aarav Gupta',
    grade: 'Class 7',
    section: 'A',
    house: 'Emerald Dragon',
    dob: '2013-01-19',
    gender: 'Male',
    bloodGroup: 'A+',
    guardianName: 'Sanjay Gupta',
    guardianPhone: '+91 98711 22334',
    guardianEmail: 'sanjay.gupta@enterprise.in',
    address: 'Plot 77, Ashok Vihar Phase 1, New Delhi - 110052',
    busRoute: 'Route 1 - Ashok Vihar & Shalimar Bagh',
    busNumber: 'DL-1PB-0105',
    lockerNumber: 'LK-07A-12',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 93.5,
    gpa: 3.75,
    feeStatus: 'Paid'
  },
  {
    id: 'std-4',
    loginId: 'ishaan6',
    password: 'password123',
    admissionNo: 'PPS-2021-0624',
    rollNo: '06A-25',
    name: 'Ishaan Verma',
    grade: 'Class 6',
    section: 'A',
    house: 'Solar Falcon',
    dob: '2014-11-05',
    gender: 'Male',
    bloodGroup: 'AB+',
    guardianName: 'Praveen Verma',
    guardianPhone: '+91 99100 88776',
    guardianEmail: 'praveen.verma@techsolutions.com',
    address: 'C-105, Paschim Vihar, New Delhi - 110063',
    busRoute: 'Route 4 - Paschim Vihar & Punjabi Bagh',
    busNumber: 'DL-1PB-0418',
    lockerNumber: 'LK-06A-25',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 97.0,
    gpa: 3.88,
    feeStatus: 'Paid'
  },
  {
    id: 'std-5',
    loginId: 'riya5',
    password: 'password123',
    admissionNo: 'PPS-2023-1102',
    rollNo: '05B-07',
    name: 'Riya Sen',
    grade: 'Class 5',
    section: 'B',
    house: 'Phoenix Gold',
    dob: '2015-06-17',
    gender: 'Female',
    bloodGroup: 'O-',
    guardianName: 'Debashis Sen',
    guardianPhone: '+91 98300 11223',
    guardianEmail: 'debashis.sen@consult.in',
    address: 'D-304, Saraswati Vihar, Pitampura, New Delhi - 110034',
    busRoute: 'Route 3 - Pitampura & Rani Bagh',
    busNumber: 'DL-1PB-0312',
    lockerNumber: 'LK-05B-07',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 91.8,
    gpa: 3.65,
    feeStatus: 'Overdue'
  },
  {
    id: 'std-6',
    loginId: 'kavya3',
    password: 'password123',
    admissionNo: 'PPS-2024-1290',
    rollNo: '03C-15',
    name: 'Kavya Singhania',
    grade: 'Class 3',
    section: 'C',
    house: 'Royal Gryphon',
    dob: '2017-09-30',
    gender: 'Female',
    bloodGroup: 'A-',
    guardianName: 'Anita Singhania',
    guardianPhone: '+91 98105 66778',
    guardianEmail: 'anita.singhania@corp.in',
    address: 'Villa 9, Grandeur Enclave, Civil Lines, New Delhi - 110054',
    busRoute: 'Route 2 - Model Town & Civil Lines',
    busNumber: 'DL-1PB-0210',
    lockerNumber: 'LK-03C-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 99.0,
    gpa: 4.0,
    feeStatus: 'Paid'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-1',
    loginId: 'sunita.science',
    password: 'teacher123',
    employeeId: 'PPS-FAC-014',
    name: 'Mrs. Sunita Verma',
    email: 's.verma@paradiseschool.edu',
    phone: '+91 98110 23456',
    designation: 'Head of Department - Sciences',
    department: 'Physics & STEM Labs',
    qualification: 'M.Sc. Physics, B.Ed (Delhi University)',
    experienceYears: 14,
    assignedClasses: [
      { grade: 'Class 8', section: 'A', subject: 'General & Physical Science' },
      { grade: 'Class 7', section: 'A', subject: 'Integrated Science & Discovery' },
      { grade: 'Class 6', section: 'A', subject: 'Environmental & Nature Science' }
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2016-07-01'
  },
  {
    id: 'tch-2',
    loginId: 'rajesh.math',
    password: 'teacher123',
    employeeId: 'PPS-FAC-022',
    name: 'Mr. Rajesh Iyer',
    email: 'r.iyer@paradiseschool.edu',
    phone: '+91 98205 34567',
    designation: 'Senior Faculty - Mathematics',
    department: 'Mathematics & Computing',
    qualification: 'M.Sc. Mathematics, B.Ed (Chennai Mathematical Institute)',
    experienceYears: 16,
    assignedClasses: [
      { grade: 'Class 8', section: 'A', subject: 'Algebra, Geometry & Statistics' },
      { grade: 'Class 7', section: 'B', subject: 'Practical Mathematics' },
      { grade: 'Class 6', section: 'A', subject: 'Foundational Numbers' }
    ],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2014-08-15'
  },
  {
    id: 'tch-3',
    loginId: 'anjali.english',
    password: 'teacher123',
    employeeId: 'PPS-FAC-035',
    name: 'Mrs. Anjali Sharma',
    email: 'a.sharma@paradiseschool.edu',
    phone: '+91 98114 56789',
    designation: 'Head of Languages & Literature',
    department: 'English Literature & Rhetoric',
    qualification: 'M.A. English, B.Ed (Jawaharlal Nehru University)',
    experienceYears: 12,
    assignedClasses: [
      { grade: 'Class 8', section: 'A', subject: 'English Literature & Public Speaking' },
      { grade: 'Class 7', section: 'A', subject: 'Creative Writing & Grammar' },
      { grade: 'Class 5', section: 'B', subject: 'Reading & Phonics' }
    ],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2018-06-20'
  },
  {
    id: 'tch-4',
    loginId: 'vikram.ai',
    password: 'teacher123',
    employeeId: 'PPS-FAC-041',
    name: 'Dr. Vikramaditya Sen',
    email: 'v.sen@paradiseschool.edu',
    phone: '+91 98311 98765',
    designation: 'Director of Junior Coding & Robotics',
    department: 'Computer Science',
    qualification: 'M.Tech / Ph.D. in Computer Science (IIT Delhi)',
    experienceYears: 10,
    assignedClasses: [
      { grade: 'Class 8', section: 'A', subject: 'Python Programming & Robotics' },
      { grade: 'Class 6', section: 'A', subject: 'Scratch Coding & Logical Games' }
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2021-04-10'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'CBSE Middle School Term 1 Assessment Timetable 2026-27',
    category: 'Examination',
    targetAudience: 'All',
    date: '2026-08-25',
    content: 'The comprehensive timetable for Classes 1 to 8 Term 1 CBSE Unit Assessments and Annual Science Exhibition has been finalized. Morning assessment sessions will commence at 08:30 AM sharp in the Junior Hall.',
    pdfUrl: '#',
    author: 'Academic Directorate',
    isPinned: true
  },
  {
    id: 'not-2',
    title: '32nd Annual Athletic Olympiad & Inter-House Sports Gala',
    category: 'Sports',
    targetAudience: 'All',
    date: '2026-08-20',
    content: 'We are delighted to announce the 32nd Annual Sports Gala scheduled for September 18-20, 2026 for all students from Nursery to Class 8. Events include Track & Field, Swimming, Gymnastics, and Fun Relays.',
    pdfUrl: '#',
    author: 'Director of Physical Education',
    isPinned: true
  },
  {
    id: 'not-3',
    title: 'Term 1 Parent-Teacher Meeting (PTM) Interaction Slots',
    category: 'Academic',
    targetAudience: 'Parents',
    date: '2026-08-15',
    content: 'Parent-Teacher interaction slots for individual academic progress review for Nursery to Class 8 are now open for booking through the Parent Portal.',
    pdfUrl: '#',
    author: 'Academic Dean',
    isPinned: false
  },
  {
    id: 'not-4',
    title: 'Dussehra & Autumn Vacation Campus Schedule',
    category: 'Holiday',
    targetAudience: 'All',
    date: '2026-08-10',
    content: 'The school will remain closed for the Dussehra and Autumn Vacation from October 12th to October 21st, 2026. The administrative and fee accounts office will operate between 10:00 AM and 02:00 PM on working days.',
    pdfUrl: '#',
    author: 'Principal Office',
    isPinned: false
  },
  {
    id: 'not-5',
    title: 'Notice: Transportation Bus Route 4 Schedule Adjustment',
    category: 'Urgent',
    targetAudience: 'Parents',
    date: '2026-08-05',
    content: 'Due to municipal road work on Outer Ring Road, Bus #04 will arrive 10 minutes earlier at all designated Rohini stops starting Monday morning.',
    pdfUrl: '#',
    author: 'Transport Directorate',
    isPinned: false
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-app-1',
    applicationNo: 'PPS-ADM-2026-0042',
    applicantName: 'Devansh Kulkarni',
    gradeApplying: 'Class 8',
    dob: '2012-12-14',
    gender: 'Male',
    parentName: 'Sanjay Kulkarni',
    parentEmail: 'sanjay.kulkarni@gmail.com',
    parentPhone: '+91 98200 45671',
    address: 'Flat 94, Crescent Heights, Sector 9, Rohini, New Delhi',
    previousSchool: 'Delhi Public School, Sector 24',
    submissionDate: '2026-08-24',
    status: 'Interview Scheduled',
    notes: 'Exceptional mathematics aptitude in preliminary test. Interaction scheduled for Sept 2nd.',
    testScore: 94
  },
  {
    id: 'adm-app-2',
    applicationNo: 'PPS-ADM-2026-0043',
    applicantName: 'Meera Iyer',
    gradeApplying: 'Class 4',
    dob: '2016-03-08',
    gender: 'Female',
    parentName: 'Ramesh Iyer',
    parentEmail: 'ramesh.iyer@fintech.in',
    parentPhone: '+91 98119 87654',
    address: '12, Oberoi Apartments, Civil Lines, New Delhi',
    previousSchool: 'St. Xavier Junior School',
    submissionDate: '2026-08-22',
    status: 'Under Review',
    notes: 'Candidate has outstanding creative arts and elocution awards.',
    testScore: 98
  },
  {
    id: 'adm-app-3',
    applicationNo: 'PPS-ADM-2026-0044',
    applicantName: 'Reyansh Malhotra',
    gradeApplying: 'Class 6',
    dob: '2014-05-19',
    gender: 'Male',
    parentName: 'Pooja Malhotra',
    parentEmail: 'pooja.malhotra@yahoo.com',
    parentPhone: '+91 98101 23456',
    address: '88, Shalimar Bagh, New Delhi',
    previousSchool: 'The Heritage Primary Academy',
    submissionDate: '2026-08-20',
    status: 'Accepted',
    notes: 'Admission granted. Awaiting document verification and fee payment.',
    testScore: 89
  },
  {
    id: 'adm-app-4',
    applicationNo: 'PPS-ADM-2026-0045',
    applicantName: 'Anvi Joshi',
    gradeApplying: 'Class 1',
    dob: '2019-10-11',
    gender: 'Female',
    parentName: 'Nitin Joshi',
    parentEmail: 'nitin.joshi@consultancy.in',
    parentPhone: '+91 99112 33445',
    address: '15, Ashok Vihar Phase 2, New Delhi',
    previousSchool: 'Little Millennium Pre-School',
    submissionDate: '2026-08-26',
    status: 'Pending',
    notes: 'Newly received application for Class 1 entrance.',
    testScore: undefined
  }
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'Plant & Animal Cell Structure & Microscopic Observation',
    subject: 'Science',
    grade: 'Class 8',
    section: 'A',
    teacherName: 'Mrs. Sunita Verma',
    assignedDate: '2026-08-22',
    dueDate: '2026-08-30',
    description: 'Observe microscopic slides of onion peel and cheek cells. Draw labeled diagrams and identify cellular organelles in your practical record.',
    maxPoints: 50,
    status: 'Active'
  },
  {
    id: 'hw-2',
    title: 'Linear Equations in One Variable - NCERT Exercise 3.2',
    subject: 'Mathematics',
    grade: 'Class 8',
    section: 'A',
    teacherName: 'Mr. Rajesh Iyer',
    assignedDate: '2026-08-24',
    dueDate: '2026-09-02',
    description: 'Solve NCERT exercise set 3.2 (Problems 1 through 20) on algebraic word problems, age relations, and perimeter equations.',
    maxPoints: 40,
    status: 'Active'
  },
  {
    id: 'hw-3',
    title: 'Descriptive Story Writing & Essay Composition',
    subject: 'English Literature',
    grade: 'Class 8',
    section: 'A',
    teacherName: 'Mrs. Anjali Sharma',
    assignedDate: '2026-08-18',
    dueDate: '2026-08-28',
    description: 'Write an imaginative narrative about discovering a hidden botanical garden behind campus. Focus on sensory imagery, metaphors, and rich vocabulary (500-700 words).',
    maxPoints: 100,
    status: 'Active'
  }
];

export const INITIAL_HOMEWORK_SUBMISSIONS: HomeworkSubmission[] = [];

export const INITIAL_ATTENDANCE_LOGS: AttendanceRecord[] = [
  { id: 'att-1', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-27', status: 'Present' },
  { id: 'att-2', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-26', status: 'Present' },
  { id: 'att-3', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-25', status: 'Present' },
  { id: 'att-4', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-22', status: 'Late', remarks: 'Arrived at 08:15 AM due to bus route delay' },
  { id: 'att-5', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-21', status: 'Present' },
  { id: 'att-6', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-20', status: 'Present' },
  { id: 'att-7', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-19', status: 'Present' },
  { id: 'att-8', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-18', status: 'Absent', remarks: 'Medical Leave - Viral Flu' },
  { id: 'att-9', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-15', status: 'Present' },
  { id: 'att-10', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Class 8', section: 'A', date: '2026-08-14', status: 'Present' },
];

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'lev-1',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Class 8-A',
    fromDate: '2026-09-10',
    toDate: '2026-09-12',
    reason: 'Representing Paradise Public School at the National Science Olympiad in New Delhi.',
    status: 'Approved',
    appliedDate: '2026-08-24'
  }
];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Class 8',
    section: 'A',
    examName: 'CBSE Term 1 Comprehensive Assessment 2026',
    academicYear: '2026-2027',
    subjects: [
      { subject: 'Science (Physics, Chem, Bio)', marksObtained: 96, maxMarks: 100, grade: 'A1', remarks: 'Distinction in lab practicals' },
      { subject: 'Mathematics', marksObtained: 98, maxMarks: 100, grade: 'A1', remarks: 'Flawless algebraic proofs' },
      { subject: 'English Language & Literature', marksObtained: 92, maxMarks: 100, grade: 'A1', remarks: 'High vocabulary and essay composition' },
      { subject: 'Social Science (Hist, Civ, Geo)', marksObtained: 90, maxMarks: 100, grade: 'A1', remarks: 'Good grasp of Indian constitution' },
      { subject: 'Computer Applications & AI', marksObtained: 99, maxMarks: 100, grade: 'A1', remarks: 'Top in class for Python coding' },
      { subject: 'Hindi / Second Language', marksObtained: 91, maxMarks: 100, grade: 'A1', remarks: 'Excellent grammar and literature' }
    ],
    totalMarks: 566,
    maxTotal: 600,
    percentage: 94.33,
    gpa: 3.92,
    rank: 2,
    overallGrade: 'A1 (Gold Honors)',
    teacherRemarks: 'Aryan exhibits profound academic discipline, intellectual curiosity, and exemplary peer leadership in Class 8.'
  }
];

export const INITIAL_FEES: FeeItem[] = [
  // Aryan Sharma (Class 8-A) - Tuition fee
  {
    id: 'fee-1',
    invoiceNo: 'INV-2026-Q3-018',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Class 8-A',
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    breakdown: {
      tuition: 35000
    },
    totalAmount: 35000,
    paidAmount: 0,
    status: 'Pending'
  },
  {
    id: 'fee-2',
    invoiceNo: 'INV-2026-Q2-018',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Class 8-A',
    term: 'Quarter 2 (Jul - Sep 2026)',
    dueDate: '2026-07-15',
    breakdown: {
      tuition: 35000
    },
    totalAmount: 35000,
    paidAmount: 35000,
    status: 'Paid',
    paymentDate: '2026-07-10',
    paymentMethod: 'UPI',
    transactionId: 'TXN-UPI-98321049'
  },
  {
    id: 'fee-3',
    invoiceNo: 'INV-2026-Q1-018',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Class 8-A',
    term: 'Quarter 1 (Apr - Jun 2026)',
    dueDate: '2026-04-15',
    breakdown: {
      tuition: 35000
    },
    totalAmount: 35000,
    paidAmount: 35000,
    status: 'Paid',
    paymentDate: '2026-04-08',
    paymentMethod: 'UPI',
    transactionId: 'TXN-UPI-77192034'
  },

  // Ananya Deshmukh (Class 8-A) - Tuition fee
  {
    id: 'fee-4',
    invoiceNo: 'INV-2026-Q3-004',
    studentId: 'std-2',
    studentName: 'Ananya Deshmukh',
    grade: 'Class 8-A',
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    breakdown: {
      tuition: 35000
    },
    totalAmount: 35000,
    paidAmount: 35000,
    status: 'Paid',
    paymentDate: '2026-09-01',
    paymentMethod: 'Net Banking',
    transactionId: 'TXN-HDFC-66281900'
  },

  // Aarav Gupta (Class 7-A) - Tuition fee
  {
    id: 'fee-5',
    invoiceNo: 'INV-2026-Q3-012',
    studentId: 'std-3',
    studentName: 'Aarav Gupta',
    grade: 'Class 7-A',
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    breakdown: {
      tuition: 30000
    },
    totalAmount: 30000,
    paidAmount: 30000,
    status: 'Paid',
    paymentDate: '2026-08-28',
    paymentMethod: 'UPI',
    transactionId: 'TXN-UPI-55219088'
  },

  // Ishaan Verma (Class 6-A) - Tuition fee
  {
    id: 'fee-6',
    invoiceNo: 'INV-2026-Q3-025',
    studentId: 'std-4',
    studentName: 'Ishaan Verma',
    grade: 'Class 6-A',
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    breakdown: {
      tuition: 28000
    },
    totalAmount: 28000,
    paidAmount: 28000,
    status: 'Paid',
    paymentDate: '2026-08-15',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-CARD-88129034'
  },

  // Riya Sen (Class 5-B) - Tuition fee (Overdue)
  {
    id: 'fee-7',
    invoiceNo: 'INV-2026-Q2-007',
    studentId: 'std-5',
    studentName: 'Riya Sen',
    grade: 'Class 5-B',
    term: 'Quarter 2 (Jul - Sep 2026)',
    dueDate: '2026-07-15',
    breakdown: {
      tuition: 25000
    },
    totalAmount: 25000,
    paidAmount: 0,
    status: 'Overdue'
  },

  // Kavya Singhania (Class 3-C) - Tuition fee
  {
    id: 'fee-8',
    invoiceNo: 'INV-2026-Q3-015',
    studentId: 'std-6',
    studentName: 'Kavya Singhania',
    grade: 'Class 3-C',
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    breakdown: {
      tuition: 22000
    },
    totalAmount: 22000,
    paidAmount: 22000,
    status: 'Paid',
    paymentDate: '2026-08-20',
    paymentMethod: 'UPI',
    transactionId: 'TXN-UPI-99441122'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
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
  },
  {
    id: 'evt-2',
    title: 'National Science Day & Junior Robotics Expo 2026',
    category: 'Exhibition',
    date: '2026-10-05',
    time: '10:00 AM - 04:00 PM',
    venue: 'Central Auditorium & Science Courtyard',
    description: 'Showcasing over 60 working science models, robotics rovers, and eco-friendly projects designed by scholars of Nursery through Class 8.',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    rsvpCount: 310,
    isUpcoming: true
  },
  {
    id: 'evt-3',
    title: 'Annual Cultural Mahotsav: Sur & Taal',
    category: 'Cultural',
    date: '2026-11-14',
    time: '05:30 PM - 08:30 PM',
    venue: 'Tagore Memorial Auditorium',
    description: 'A vibrant classical & folk music, dance, and theatrical celebration by the school junior orchestra and choir on Children’s Day.',
    coverImage: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=800',
    rsvpCount: 520,
    isUpcoming: true
  },
  {
    id: 'evt-4',
    title: 'Inter-School Junior Debate & Quiz Championship',
    category: 'Academic',
    date: '2026-12-02',
    time: '09:00 AM - 04:00 PM',
    venue: 'School Seminar Hall',
    description: 'Hosting 20 leading schools for Delhi NCR middle school GK quizzes, Hindi kavita path, and elocution contests.',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    rsvpCount: 190,
    isUpcoming: true
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Primary & Middle School Science Discovery Labs',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    description: 'Young scholars exploring plant biology, physics principles, and hands-on experiments.',
    date: '2026-08-12'
  },
  {
    id: 'gal-2',
    title: 'Rabindranath Tagore Memorial Library',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    description: 'Over 25,000 age-appropriate books, illustrated encyclopedia sets, and audio-visual reading pods.',
    date: '2026-07-28'
  },
  {
    id: 'gal-3',
    title: 'Swimming Pool & Sports Complex',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800',
    description: 'Certified swimming coaches teaching water safety, freestyle, and competitive relays.',
    date: '2026-07-15'
  },
  {
    id: 'gal-4',
    title: 'Junior Robotics & Computer Coding Studio',
    category: 'Academics',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    description: 'Equipped with block-coding modules, robot kits, and child-safe maker materials.',
    date: '2026-08-02'
  },
  {
    id: 'gal-5',
    title: 'Annual Musical & Cultural Celebration',
    category: 'Arts & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
    description: 'Vibrant cultural extravaganza celebrating Indian classical arts, drama, and dance.',
    date: '2026-06-20'
  },
  {
    id: 'gal-6',
    title: 'Investiture Ceremony: Student Prefect Council',
    category: 'Celebrations',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    description: 'Class 8 house captains and prefects taking the solemn oath of discipline and leadership.',
    date: '2026-07-05'
  }
];

export const INITIAL_SUBJECTS: SchoolSubject[] = [
  {
    id: 'sub-1',
    name: 'General & Physical Science',
    code: 'SCI-08',
    department: 'Physics & STEM Labs',
    category: 'STEM & Sciences',
    grades: ['Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 6,
    description: 'Experimental physics, basic chemistry reactions, plant and animal biology, and laboratory observations.',
    headTeacher: 'Mrs. Sunita Verma',
    status: 'Active'
  },
  {
    id: 'sub-2',
    name: 'Algebra, Geometry & Statistics',
    code: 'MATH-08',
    department: 'Mathematics & Computing',
    category: 'Core Academic',
    grades: ['Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 7,
    description: 'CBSE mathematics syllabus, algebraical proofs, linear equations, Euclidean geometry, and data interpretation.',
    headTeacher: 'Mr. Rajesh Iyer',
    status: 'Active'
  },
  {
    id: 'sub-3',
    name: 'English Literature & Rhetoric',
    code: 'ENG-08',
    department: 'English Literature & Rhetoric',
    category: 'Languages & Literature',
    grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 6,
    description: 'Classical & contemporary prose, poetry recitation, creative storytelling, formal essays, and elocution.',
    headTeacher: 'Mrs. Anjali Sharma',
    status: 'Active'
  },
  {
    id: 'sub-4',
    name: 'Python Programming & Junior Robotics',
    code: 'CS-08',
    department: 'Computer Science',
    category: 'Vocational & Tech',
    grades: ['Class 5', 'Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 4,
    description: 'Algorithmic reasoning, Scratch visual coding, Python scripting, sensor electronics, and junior maker robotics.',
    headTeacher: 'Dr. Vikramaditya Sen',
    status: 'Active'
  },
  {
    id: 'sub-5',
    name: 'Social Sciences & Heritage Studies',
    code: 'SST-08',
    department: 'Humanities & Social Sciences',
    category: 'Core Academic',
    grades: ['Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 5,
    description: 'Medieval and modern Indian history, civics and constitution, physical geography, and environmental stewardship.',
    headTeacher: 'Dr. Renu Gupta',
    status: 'Active'
  },
  {
    id: 'sub-6',
    name: 'Hindi Language & Sahitya',
    code: 'HIN-08',
    department: 'Languages & Literature',
    category: 'Languages & Literature',
    grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 5,
    description: 'Hindi grammar, kavita path, comprehension, rashtrabhasha literature, and creative composition.',
    headTeacher: 'Mrs. Anjali Sharma',
    status: 'Active'
  },
  {
    id: 'sub-7',
    name: 'Physical Education & Athletics',
    code: 'PED-08',
    department: 'Physical Education & Sports',
    category: 'Physical Education',
    grades: ['Nursery', 'Kindergarten', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 3,
    description: 'Track and field athletics, swimming drills, yoga postures, basketball, football, and sportsmanship.',
    headTeacher: 'Director of Physical Education',
    status: 'Active'
  },
  {
    id: 'sub-8',
    name: 'Visual Arts, Craft & Pottery',
    code: 'ART-08',
    department: 'Fine Arts & Culture',
    category: 'Arts & Culture',
    grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 2,
    description: 'Watercolor painting, origami, clay sculpting, sketching techniques, and inter-house exhibition showcase.',
    headTeacher: 'Fine Arts Faculty',
    status: 'Elective'
  }
];

export const INITIAL_TEACHER_PERIODS: TeacherPeriod[] = [
  // Sunita Verma (tch-1) - Permanent weekly periods
  {
    id: 'prd-1',
    teacherId: 'tch-1',
    teacherName: 'Mrs. Sunita Verma',
    periodNumber: '01',
    startTime: '08:30 AM',
    endTime: '09:20 AM',
    grade: 'Class 8',
    section: 'A',
    subject: 'General & Physical Science',
    room: 'Science Lab 1',
    topic: 'Force, Pressure & Atmospheric Dynamics',
    scheduleType: 'permanent',
    dayOfWeek: 'All Days',
    notes: 'Practical demonstration of barometer and manometer.'
  },
  {
    id: 'prd-2',
    teacherId: 'tch-1',
    teacherName: 'Mrs. Sunita Verma',
    periodNumber: '03',
    startTime: '10:30 AM',
    endTime: '11:20 AM',
    grade: 'Class 7',
    section: 'A',
    subject: 'Integrated Science & Discovery',
    room: 'Room 104',
    topic: 'Heat, Thermodynamics & Thermal Transfer',
    scheduleType: 'permanent',
    dayOfWeek: 'All Days',
    notes: 'Conduction and convection in liquids experiment.'
  },
  {
    id: 'prd-3',
    teacherId: 'tch-1',
    teacherName: 'Mrs. Sunita Verma',
    periodNumber: '05',
    startTime: '01:00 PM',
    endTime: '01:50 PM',
    grade: 'Class 6',
    section: 'A',
    subject: 'Environmental & Nature Science',
    room: 'Room 102',
    topic: 'Motion, Distances & Standard Measurements',
    scheduleType: 'permanent',
    dayOfWeek: 'All Days',
    notes: 'Vernier calliper and measuring tape introduction.'
  },
  // Day-Specific Lecture (Special Olympiad Workshop for Saturday / specific date)
  {
    id: 'prd-4',
    teacherId: 'tch-1',
    teacherName: 'Mrs. Sunita Verma',
    periodNumber: '06',
    startTime: '02:00 PM',
    endTime: '02:50 PM',
    grade: 'Class 8',
    section: 'A',
    subject: 'General & Physical Science',
    room: 'Junior STEM Studio',
    topic: 'National Science Olympiad Problem Solving',
    scheduleType: 'day_only',
    date: '2026-08-29',
    notes: 'Intensive mock questions for senior middle school science scholars.'
  },

  // Rajesh Iyer (tch-2) - Permanent weekly periods
  {
    id: 'prd-5',
    teacherId: 'tch-2',
    teacherName: 'Mr. Rajesh Iyer',
    periodNumber: '02',
    startTime: '09:30 AM',
    endTime: '10:20 AM',
    grade: 'Class 8',
    section: 'A',
    subject: 'Algebra, Geometry & Statistics',
    room: 'Room 108',
    topic: 'Linear Equations & Graphical Intersections',
    scheduleType: 'permanent',
    dayOfWeek: 'All Days',
    notes: 'Solving simultaneous balance equations.'
  },
  {
    id: 'prd-6',
    teacherId: 'tch-2',
    teacherName: 'Mr. Rajesh Iyer',
    periodNumber: '04',
    startTime: '11:30 AM',
    endTime: '12:20 PM',
    grade: 'Class 7',
    section: 'B',
    subject: 'Practical Mathematics',
    room: 'Room 106',
    topic: 'Fractions, Decimals & Rational Operations',
    scheduleType: 'permanent',
    dayOfWeek: 'All Days',
    notes: 'Group worksheet exercise.'
  }
];

