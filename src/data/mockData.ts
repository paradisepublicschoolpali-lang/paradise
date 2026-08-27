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
  UserProfile
} from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  guest: {
    id: 'guest-1',
    name: 'Guest Visitor',
    email: 'guest@paradise.edu',
    role: 'guest',
  },
  parent: {
    id: 'std-1',
    loginId: 'aryan10',
    name: 'Aryan Sharma (Parent: Vikram Sharma)',
    email: 'vikram.sharma@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    grade: 'Grade 8',
    section: 'A'
  },
  teacher: {
    id: 'tch-1',
    loginId: 'sarah.physics',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@paradiseschool.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    designation: 'Head of Department - Middle School Sciences'
  },
  admin: {
    id: 'adm-1',
    loginId: 'admin',
    name: 'Dr. Robert Vance (Principal)',
    email: 'principal@paradiseschool.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    designation: 'Principal & Head of School'
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
    grade: 'Grade 8',
    section: 'A',
    house: 'Phoenix Gold',
    dob: '2012-04-14',
    gender: 'Male',
    bloodGroup: 'O+',
    guardianName: 'Vikram Sharma',
    guardianPhone: '+1 (555) 392-8819',
    guardianEmail: 'vikram.sharma@gmail.com',
    address: '42 Golden Heights Blvd, North Campus Enclave',
    busRoute: 'Route 4 - Royal Palm Residency',
    busNumber: 'PPS-BUS-04',
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
    grade: 'Grade 8',
    section: 'A',
    house: 'Royal Gryphon',
    dob: '2012-08-22',
    gender: 'Female',
    bloodGroup: 'B+',
    guardianName: 'Dr. Rajesh Deshmukh',
    guardianPhone: '+1 (555) 482-9901',
    guardianEmail: 'rajesh.deshmukh@med.org',
    address: '18 Crestwood Avenue, Sector 5',
    busRoute: 'Route 2 - Lakeview Manor',
    busNumber: 'PPS-BUS-02',
    lockerNumber: 'LK-08A-04',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 98.2,
    gpa: 3.98,
    feeStatus: 'Paid'
  },
  {
    id: 'std-3',
    loginId: 'marcus10',
    password: 'password123',
    admissionNo: 'PPS-2023-0912',
    rollNo: '07A-12',
    name: 'Marcus Sterling',
    grade: 'Grade 7',
    section: 'A',
    house: 'Emerald Dragon',
    dob: '2013-01-19',
    gender: 'Male',
    bloodGroup: 'A+',
    guardianName: 'Eleanor Sterling',
    guardianPhone: '+1 (555) 773-1029',
    guardianEmail: 'eleanor.sterling@global.com',
    address: '77 Sovereign Park, Tower B',
    busRoute: 'Route 1 - Downtown Express',
    busNumber: 'PPS-BUS-01',
    lockerNumber: 'LK-07A-12',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 93.5,
    gpa: 3.75,
    feeStatus: 'Paid'
  },
  {
    id: 'std-4',
    loginId: 'zoya10',
    password: 'password123',
    admissionNo: 'PPS-2021-0624',
    rollNo: '06A-25',
    name: 'Zoya Al-Mansoor',
    grade: 'Grade 6',
    section: 'A',
    house: 'Solar Falcon',
    dob: '2014-11-05',
    gender: 'Female',
    bloodGroup: 'AB+',
    guardianName: 'Tariq Al-Mansoor',
    guardianPhone: '+1 (555) 819-3342',
    guardianEmail: 'tariq.mansoor@venture.ae',
    address: '105 Emerald Hills Drive',
    busRoute: 'Route 4 - Royal Palm Residency',
    busNumber: 'PPS-BUS-04',
    lockerNumber: 'LK-06A-25',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 97.0,
    gpa: 3.88,
    feeStatus: 'Paid'
  },
  {
    id: 'std-5',
    loginId: 'ethan11',
    password: 'password123',
    admissionNo: 'PPS-2023-1102',
    rollNo: '05B-07',
    name: 'Ethan Huntley',
    grade: 'Grade 5',
    section: 'B',
    house: 'Phoenix Gold',
    dob: '2015-06-17',
    gender: 'Male',
    bloodGroup: 'O-',
    guardianName: 'Christopher Huntley',
    guardianPhone: '+1 (555) 902-1144',
    guardianEmail: 'c.huntley@invest.org',
    address: '304 Cambridge Woods Estate',
    busRoute: 'Route 3 - Greenfield Terraces',
    busNumber: 'PPS-BUS-03',
    lockerNumber: 'LK-05B-07',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    attendanceRate: 91.8,
    gpa: 3.65,
    feeStatus: 'Overdue'
  },
  {
    id: 'std-6',
    loginId: 'kavya9',
    password: 'password123',
    admissionNo: 'PPS-2024-1290',
    rollNo: '03C-15',
    name: 'Kavya Singhania',
    grade: 'Grade 3',
    section: 'C',
    house: 'Royal Gryphon',
    dob: '2017-09-30',
    gender: 'Female',
    bloodGroup: 'A-',
    guardianName: 'Anita Singhania',
    guardianPhone: '+1 (555) 441-2900',
    guardianEmail: 'anita.singhania@corp.in',
    address: '9 Villa Grandeur, Hill View',
    busRoute: 'Route 2 - Lakeview Manor',
    busNumber: 'PPS-BUS-02',
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
    loginId: 'sarah.physics',
    password: 'teacher123',
    employeeId: 'PPS-FAC-014',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@paradiseschool.edu',
    phone: '+1 (555) 234-5678',
    designation: 'Head of Science & STEM Wing',
    department: 'Physics & STEM Labs',
    qualification: 'Ph.D. in Science Education (Oxford Univ)',
    experienceYears: 14,
    assignedClasses: [
      { grade: 'Grade 8', section: 'A', subject: 'General & Physical Science' },
      { grade: 'Grade 7', section: 'A', subject: 'Integrated Science & Discovery' },
      { grade: 'Grade 6', section: 'A', subject: 'Nature & Environmental Science' }
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2016-07-01'
  },
  {
    id: 'tch-2',
    loginId: 'alistair.math',
    password: 'teacher123',
    employeeId: 'PPS-FAC-022',
    name: 'Prof. Alistair Montgomery',
    email: 'a.montgomery@paradiseschool.edu',
    phone: '+1 (555) 876-5432',
    designation: 'Senior Faculty - Mathematics',
    department: 'Mathematics & Computing',
    qualification: 'M.Sc. Pure Mathematics (Cambridge Univ)',
    experienceYears: 18,
    assignedClasses: [
      { grade: 'Grade 8', section: 'A', subject: 'Algebra, Geometry & Statistics' },
      { grade: 'Grade 7', section: 'B', subject: 'Practical Mathematics' },
      { grade: 'Grade 6', section: 'A', subject: 'Foundational Numbers' }
    ],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2012-08-15'
  },
  {
    id: 'tch-3',
    loginId: 'evelyn.english',
    password: 'teacher123',
    employeeId: 'PPS-FAC-035',
    name: 'Mrs. Evelyn Thorne',
    email: 'e.thorne@paradiseschool.edu',
    phone: '+1 (555) 345-6789',
    designation: 'Head of Languages & Literature',
    department: 'English Literature & Rhetoric',
    qualification: 'M.A. English Literature (Columbia Univ)',
    experienceYears: 11,
    assignedClasses: [
      { grade: 'Grade 8', section: 'A', subject: 'English Literature & Public Speaking' },
      { grade: 'Grade 7', section: 'A', subject: 'Creative Writing & Grammar' },
      { grade: 'Grade 5', section: 'B', subject: 'Reading & Phonics' }
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
    phone: '+1 (555) 987-6543',
    designation: 'Director of Junior Coding & Robotics',
    department: 'Computer Science',
    qualification: 'M.Tech / Ph.D. in Computer Science',
    experienceYears: 9,
    assignedClasses: [
      { grade: 'Grade 8', section: 'A', subject: 'Python Programming & Robotics' },
      { grade: 'Grade 6', section: 'A', subject: 'Scratch Coding & Logical Games' }
    ],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    joiningDate: '2021-04-10'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Middle School Annual Assessment & Exhibition Schedule 2026',
    category: 'Examination',
    targetAudience: 'All',
    date: '2026-08-25',
    content: 'The comprehensive timetable for Grades 1 to 8 Annual Term Assessments and Junior Science Exhibition has been finalized. Morning sessions will commence at 08:30 AM sharp in the Junior Assembly Hall.',
    pdfUrl: '#',
    author: 'Academic Directorate',
    isPinned: true
  },
  {
    id: 'not-2',
    title: '32nd Annual Athletic Olympiad & Inter-House Sports Meet',
    category: 'Sports',
    targetAudience: 'All',
    date: '2026-08-20',
    content: 'We are delighted to announce the 32nd Annual Sports Gala scheduled for September 18-20, 2026 for all students from Kindergarten to Class 8. Events include Track & Field, Swimming, Gymnastics, and Fun Relays.',
    pdfUrl: '#',
    author: 'Director of Physical Education',
    isPinned: true
  },
  {
    id: 'not-3',
    title: 'Term 1 Parent-Teacher Conference (PTM) Booking Open',
    category: 'Academic',
    targetAudience: 'Parents',
    date: '2026-08-15',
    content: 'Parent-Teacher interaction slots for individual performance reviews for Nursery to Class 8 are now available for reservation through the Parent Portal.',
    pdfUrl: '#',
    author: 'Academic Dean',
    isPinned: false
  },
  {
    id: 'not-4',
    title: 'Autumn Break & Campus Maintenance Notice',
    category: 'Holiday',
    targetAudience: 'All',
    date: '2026-08-10',
    content: 'The school will remain closed for the Autumn Vacation from October 12th to October 21st, 2026. The administrative and admission offices will operate between 10:00 AM and 02:00 PM on working days.',
    pdfUrl: '#',
    author: 'Principal Office',
    isPinned: false
  },
  {
    id: 'not-5',
    title: 'Urgent: Transportation Route 4 Schedule Adjustment',
    category: 'Urgent',
    targetAudience: 'Parents',
    date: '2026-08-05',
    content: 'Due to municipal infrastructure work on North Boulevard, Bus #04 will arrive 10 minutes earlier at all designated stops starting Monday.',
    pdfUrl: '#',
    author: 'Transport Department',
    isPinned: false
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-app-1',
    applicationNo: 'PPS-ADM-2026-0042',
    applicantName: 'Devansh Kulkarni',
    gradeApplying: 'Grade 8',
    dob: '2012-12-14',
    gender: 'Male',
    parentName: 'Sanjay Kulkarni',
    parentEmail: 'sanjay.k@outlook.com',
    parentPhone: '+1 (555) 628-9104',
    address: '94 Highland Crescent, Suite 402',
    previousSchool: 'St. Xavier International Academy',
    submissionDate: '2026-08-24',
    status: 'Interview Scheduled',
    notes: 'Exceptional math aptitude in preliminary evaluation. Interaction scheduled for Sept 2nd.',
    testScore: 94
  },
  {
    id: 'adm-app-2',
    applicationNo: 'PPS-ADM-2026-0043',
    applicantName: 'Zara Elizabeth Vance',
    gradeApplying: 'Grade 4',
    dob: '2016-03-08',
    gender: 'Female',
    parentName: 'David Vance',
    parentEmail: 'dvance@biotech.co',
    parentPhone: '+1 (555) 714-2299',
    address: '12 Monarch Way, Golden Oaks',
    previousSchool: 'Bishop Cotton Junior School',
    submissionDate: '2026-08-22',
    status: 'Under Review',
    notes: 'Candidate has outstanding creative arts and storytelling skills.',
    testScore: 98
  },
  {
    id: 'adm-app-3',
    applicationNo: 'PPS-ADM-2026-0044',
    applicantName: 'Reyansh Malhotra',
    gradeApplying: 'Grade 6',
    dob: '2014-05-19',
    gender: 'Male',
    parentName: 'Pooja Malhotra',
    parentEmail: 'pooja.malhotra@yahoo.com',
    parentPhone: '+1 (555) 901-4455',
    address: '88 Whispering Pines Boulevard',
    previousSchool: 'The Heritage Valley Primary School',
    submissionDate: '2026-08-20',
    status: 'Accepted',
    notes: 'Admission granted. Awaiting document verification and fee payment.',
    testScore: 89
  },
  {
    id: 'adm-app-4',
    applicationNo: 'PPS-ADM-2026-0045',
    applicantName: 'Natasha Romanov-Lee',
    gradeApplying: 'Grade 1',
    dob: '2019-10-11',
    gender: 'Female',
    parentName: 'Victoria Lee',
    parentEmail: 'vlee@lawpartners.com',
    parentPhone: '+1 (555) 332-1100',
    address: '15 Aspen Court, Parklands',
    previousSchool: 'Montessori Bloom Pre-School',
    submissionDate: '2026-08-26',
    status: 'Pending',
    notes: 'Newly received application for Grade 1 entrance.',
    testScore: undefined
  }
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'Plant & Animal Cell Structure & Microorganism Lab Observation',
    subject: 'Science',
    grade: 'Grade 8',
    section: 'A',
    teacherName: 'Dr. Sarah Jenkins',
    assignedDate: '2026-08-22',
    dueDate: '2026-08-30',
    description: 'Observe microscopic slides of onion peel and cheek cells. Draw labeled diagrams and identify cellular organelles (nucleus, cell wall, mitochondria) in your practical journal.',
    maxPoints: 50,
    status: 'Active'
  },
  {
    id: 'hw-2',
    title: 'Linear Equations in One Variable & Word Problems',
    subject: 'Mathematics',
    grade: 'Grade 8',
    section: 'A',
    teacherName: 'Prof. Alistair Montgomery',
    assignedDate: '2026-08-24',
    dueDate: '2026-09-02',
    description: 'Solve exercise set 3.2 (Problems 1 through 20) on algebraic word problems, age relations, and perimeter equations.',
    maxPoints: 40,
    status: 'Active'
  },
  {
    id: 'hw-3',
    title: 'Character Sketch & Descriptive Story Writing',
    subject: 'English Literature',
    grade: 'Grade 8',
    section: 'A',
    teacherName: 'Mrs. Evelyn Thorne',
    assignedDate: '2026-08-18',
    dueDate: '2026-08-28',
    description: 'Write an imaginative narrative about discovering a hidden botanical garden behind your campus. Focus on sensory imagery, metaphors, and rich vocabulary (500-700 words).',
    maxPoints: 100,
    status: 'Active'
  },
  {
    id: 'hw-4',
    title: 'Junior Robotics: Ultrasonic Obstacle Avoidance Script',
    subject: 'Computer & Robotics',
    grade: 'Grade 8',
    section: 'A',
    teacherName: 'Dr. Vikramaditya Sen',
    assignedDate: '2026-08-10',
    dueDate: '2026-08-20',
    description: 'Write a Python / Scratch program to navigate a virtual robot around obstacle blocks using distance thresholds.',
    maxPoints: 50,
    status: 'Closed'
  }
];

export const INITIAL_HOMEWORK_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-4',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    submissionDate: '2026-08-19',
    status: 'Graded',
    score: 48,
    feedback: 'Outstanding logic in distance thresholds! Excellent code modularity.',
    fileName: 'Aryan_Sharma_Robotics_PPS.py'
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-3',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    submissionDate: '2026-08-27',
    status: 'Submitted',
    score: undefined,
    feedback: undefined,
    fileName: 'Aryan_Sharma_DescriptiveStory.pdf'
  }
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceRecord[] = [
  { id: 'att-1', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-27', status: 'Present' },
  { id: 'att-2', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-26', status: 'Present' },
  { id: 'att-3', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-25', status: 'Present' },
  { id: 'att-4', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-22', status: 'Late', remarks: 'Arrived at 08:15 AM due to bus route delay' },
  { id: 'att-5', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-21', status: 'Present' },
  { id: 'att-6', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-20', status: 'Present' },
  { id: 'att-7', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-19', status: 'Present' },
  { id: 'att-8', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-18', status: 'Absent', remarks: 'Medical Leave - Viral Flu' },
  { id: 'att-9', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-15', status: 'Present' },
  { id: 'att-10', studentId: 'std-1', studentName: 'Aryan Sharma', grade: 'Grade 8', section: 'A', date: '2026-08-14', status: 'Present' },
];

export const INITIAL_LEAVES: LeaveApplication[] = [
  {
    id: 'lev-1',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 8-A',
    fromDate: '2026-09-10',
    toDate: '2026-09-12',
    reason: 'Representing Paradise Public School at the National Junior Science & Robotics Fair.',
    status: 'Approved',
    appliedDate: '2026-08-24'
  }
];

export const INITIAL_EXAM_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 8',
    section: 'A',
    examName: 'Mid-Term Comprehensive Assessment 2026',
    academicYear: '2026-2027',
    subjects: [
      { subject: 'General & Physical Science', marksObtained: 96, maxMarks: 100, grade: 'A1', remarks: 'Distinction in lab experiments' },
      { subject: 'Mathematics', marksObtained: 98, maxMarks: 100, grade: 'A1', remarks: 'Flawless algebraic proofs' },
      { subject: 'English Language & Literature', marksObtained: 92, maxMarks: 100, grade: 'A1', remarks: 'High vocabulary and essay structure' },
      { subject: 'Social Studies & Civics', marksObtained: 90, maxMarks: 100, grade: 'A1', remarks: 'Good grasp of history and geography' },
      { subject: 'Computer Coding & AI', marksObtained: 99, maxMarks: 100, grade: 'A1', remarks: 'Top in class for Python robotics' },
      { subject: 'Hindi / Second Language', marksObtained: 91, maxMarks: 100, grade: 'A1', remarks: 'Excellent grammar and literature' }
    ],
    totalMarks: 566,
    maxTotal: 600,
    percentage: 94.33,
    gpa: 3.92,
    rank: 2,
    overallGrade: 'A1 (Gold Honors)',
    teacherRemarks: 'Aryan exhibits profound academic discipline, intellectual curiosity, and exemplary peer leadership in Grade 8.'
  }
];

export const INITIAL_FEES: FeeItem[] = [
  {
    id: 'fee-1',
    invoiceNo: 'INV-2026-Q3-018',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 8-A',
    term: 'Quarter 3 (Sep - Nov 2026)',
    dueDate: '2026-09-15',
    breakdown: {
      tuition: 1650,
      transport: 350,
      labAndLibrary: 200,
      sportsAndActivities: 150,
      developmentFund: 150
    },
    totalAmount: 2500,
    paidAmount: 0,
    status: 'Pending'
  },
  {
    id: 'fee-2',
    invoiceNo: 'INV-2026-Q2-018',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 8-A',
    term: 'Quarter 2 (Jun - Aug 2026)',
    dueDate: '2026-06-15',
    breakdown: {
      tuition: 1650,
      transport: 350,
      labAndLibrary: 200,
      sportsAndActivities: 150,
      developmentFund: 150
    },
    totalAmount: 2500,
    paidAmount: 2500,
    status: 'Paid',
    paymentDate: '2026-06-10',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-GOLD-98321049'
  },
  {
    id: 'fee-3',
    invoiceNo: 'INV-2026-Q1-018',
    studentId: 'std-1',
    studentName: 'Aryan Sharma',
    grade: 'Grade 8-A',
    term: 'Quarter 1 (Apr - Jun 2026)',
    dueDate: '2026-04-15',
    breakdown: {
      tuition: 1650,
      transport: 350,
      labAndLibrary: 200,
      sportsAndActivities: 150,
      developmentFund: 150
    },
    totalAmount: 2500,
    paidAmount: 2500,
    status: 'Paid',
    paymentDate: '2026-04-08',
    paymentMethod: 'UPI',
    transactionId: 'TXN-UPI-77192034'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-1',
    title: '32nd Annual Junior Sports Gala & Torch Relay',
    category: 'Sports',
    date: '2026-09-18',
    time: '08:30 AM - 04:30 PM',
    venue: 'Campus Athletic Field & Sports Arena',
    description: 'Three days of inter-house athletic events, sprint races, swimming trials, and gymnastics for Nursery to Grade 8.',
    coverImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    rsvpCount: 428,
    isUpcoming: true
  },
  {
    id: 'evt-2',
    title: 'Junior Discovery Expo: STEM, Nature & Robotics 2026',
    category: 'Exhibition',
    date: '2026-10-05',
    time: '10:00 AM - 04:00 PM',
    venue: 'Central Amphitheatre & Science Courtyard',
    description: 'Showcasing over 60 science models, robotics rovers, and eco-sustainable crafts created by students of Nursery through Class 8.',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    rsvpCount: 310,
    isUpcoming: true
  },
  {
    id: 'evt-3',
    title: 'Annual Musical Gala: Symphony of Childhood',
    category: 'Cultural',
    date: '2026-11-14',
    time: '05:30 PM - 08:30 PM',
    venue: 'Royal Auditorium (1200 seats)',
    description: 'A musical and theatrical performance by the school junior choir, orchestra, and drama troupe.',
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
    description: 'Hosting 20 top schools for middle school general knowledge quizzes, spelling bees, and elocution contests.',
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
    title: 'Junior Readers Central Library & Storytelling Hub',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    description: 'Over 25,000 age-appropriate books, illustrated encyclopedia sets, and audio-visual reading pods.',
    date: '2026-07-28'
  },
  {
    id: 'gal-3',
    title: 'Swimming Pool & Junior Sports Complex',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800',
    description: 'Certified swimming instructors teaching water safety, freestyle, and competitive relays.',
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
    title: 'Annual Junior Musical Concert & Drama Night',
    category: 'Arts & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=800',
    description: 'Vibrant cultural extravaganza celebrating storytelling, music, and dance.',
    date: '2026-06-20'
  },
  {
    id: 'gal-6',
    title: 'Junior Investiture: Prefect Badge Conferral',
    category: 'Celebrations',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    description: 'Class 8 and primary student captains taking the oath of discipline, empathy, and honor.',
    date: '2026-07-05'
  }
];
