import {
  SchoolConfig,
  Notice,
  SchoolEvent,
  GalleryItem,
  Facility,
  Student,
  HomeworkTask,
  TimetableSlot,
  AttendanceRecord,
  ExamResult,
  FeeInvoice,
  LeaveRequest,
  ChatMessage
} from '../types';

export const SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'Paradise Public School',
  motto: 'Excellence • Integrity • Leadership',
  affiliationCode: 'CBSE Affiliation No: 2130842 / School Code: 71234',
  academicYear: '2026-2027',
  currentTerm: 'Term 1 (Mid-Session)',
  contactEmail: 'paradisepublicschool.pali@gmail.com',
  contactPhone: '+91 2932 224567',
  secondaryPhone: '+91 98290 12345',
  whatsappNumber: '+91 98290 12345',
  visitingHours: 'Monday to Friday: 08:30 AM - 04:30 PM\nSaturday: 09:00 AM - 01:00 PM',
  schoolTimings: 'Mon - Sat: 08:00 AM - 04:30 PM',
  establishedYear: '1994',
  address: 'Near New Bus Stand, Sumerpur Road, Pali, Rajasthan - 306401, India',
  websiteUrl: 'https://paradise-public-school.web.app',
  principalName: 'Dr. Renu Gupta',
  principalRole: 'Principal & Head of Institution',
  principalCredentials: 'Ph.D. Education (Rajasthan Univ), M.Sc. Physics, 28+ Yrs Leadership',
  principalPhoto: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=800',
  principalMessage: 'We prepare students not merely for examinations, but for life, character, and nation-building. Every child at Paradise is nurtured with individual care, rigorous thinking, and timeless values.',
  heroHeadline: 'Nurturing Young Minds (Nursery to Class 8)',
  heroSubtitle: 'Where timeless Indian values meet foundational academic excellence, junior STEM robotics, and holistic child development in Pali, Rajasthan.'
};

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'std-1',
    admissionNo: 'PPS-2022-0842',
    rollNo: '08A-18',
    name: 'Aryan Sharma',
    grade: 'Class 8',
    section: 'A',
    house: 'Ashoka House',
    dob: '2012-04-14',
    gender: 'Male',
    bloodGroup: 'O+',
    guardianName: 'Vikram Sharma',
    guardianPhone: '+91 98290 34567',
    guardianEmail: 'vikram.sharma@gmail.com',
    address: 'Flat 402, Golden Heights, Station Road, Pali, Rajasthan - 306401',
    busRoute: 'Route 1 - Sumerpur Road & Housing Board',
    busNumber: 'RJ-22-PA-0418',
    attendanceRate: 96.4,
    gpa: 9.8,
    feeStatus: 'Pending',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'std-2',
    admissionNo: 'PPS-2025-1104',
    rollNo: '01A-06',
    name: 'Anvi Sharma',
    grade: 'Class 1',
    section: 'A',
    house: 'Tagore House',
    dob: '2019-10-11',
    gender: 'Female',
    bloodGroup: 'B+',
    guardianName: 'Vikram Sharma',
    guardianPhone: '+91 98290 34567',
    guardianEmail: 'vikram.sharma@gmail.com',
    address: 'Flat 402, Golden Heights, Station Road, Pali, Rajasthan - 306401',
    busRoute: 'Route 1 - Sumerpur Road & Housing Board',
    busNumber: 'RJ-22-PA-0418',
    attendanceRate: 98.8,
    gpa: 10.0,
    feeStatus: 'Paid',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300'
  }
];

export const DEMO_HOMEWORK: Record<string, HomeworkTask[]> = {
  'std-1': [
    {
      id: 'hw-1',
      title: 'Plant & Animal Cell Structure & Microscope Practical',
      subject: 'Science',
      grade: 'Class 8',
      section: 'A',
      teacherName: 'Mrs. Sunita Verma',
      description: 'Observe microscopic slides of onion peel and cheek cells. Draw labeled diagrams and identify cellular organelles in your practical record book.',
      assignedDate: '2026-08-22',
      dueDate: '2026-08-30',
      attachmentUrl: 'https://paradise-public-school.web.app/docs/cells-worksheet.pdf',
      maxPoints: 50,
      isSubmitted: false
    },
    {
      id: 'hw-2',
      title: 'Linear Equations in One Variable - NCERT Exercise 3.2',
      subject: 'Maths',
      grade: 'Class 8',
      section: 'A',
      teacherName: 'Mr. Rajesh Iyer',
      description: 'Solve NCERT exercise set 3.2 (Problems 1 through 20) on algebraic word problems and perimeter balance equations.',
      assignedDate: '2026-08-24',
      dueDate: '2026-09-02',
      maxPoints: 40,
      isSubmitted: true
    },
    {
      id: 'hw-3',
      title: 'Descriptive Essay: The Forgotten Heritage of Rajasthan',
      subject: 'English',
      grade: 'Class 8',
      section: 'A',
      teacherName: 'Mrs. Anjali Sharma',
      description: 'Write a 400-500 word descriptive composition focusing on sensory details, metaphors, and historical relevance.',
      assignedDate: '2026-08-20',
      dueDate: '2026-08-28',
      maxPoints: 30,
      isSubmitted: true
    }
  ],
  'std-2': [
    {
      id: 'hw-4',
      title: 'Phonics & Sight Words Coloring Worksheet',
      subject: 'English',
      grade: 'Class 1',
      section: 'A',
      teacherName: 'Ms. Pooja Trivedi',
      description: 'Read the 10 sight words aloud and color the matching picture squares on page 24 of your English activity book.',
      assignedDate: '2026-08-26',
      dueDate: '2026-08-29',
      maxPoints: 20,
      isSubmitted: false
    },
    {
      id: 'hw-5',
      title: 'Counting by 5s & Number Line Jump Practice',
      subject: 'Maths',
      grade: 'Class 1',
      section: 'A',
      teacherName: 'Ms. Pooja Trivedi',
      description: 'Complete the number caterpillars by skip counting in steps of 5 up to 50.',
      assignedDate: '2026-08-25',
      dueDate: '2026-08-28',
      maxPoints: 20,
      isSubmitted: true
    }
  ]
};

export const DEMO_TIMETABLE: Record<string, TimetableSlot[]> = {
  'std-1': [
    { id: 'tt-1', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:20 AM', grade: 'Class 8', section: 'A', subject: 'Science', teacherName: 'Mrs. Sunita Verma', room: 'Science Lab 1' },
    { id: 'tt-2', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:30 AM', endTime: '10:20 AM', grade: 'Class 8', section: 'A', subject: 'Maths', teacherName: 'Mr. Rajesh Iyer', room: 'Room 108' },
    { id: 'tt-3', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:30 AM', endTime: '11:20 AM', grade: 'Class 8', section: 'A', subject: 'English', teacherName: 'Mrs. Anjali Sharma', room: 'Room 108' },
    { id: 'tt-4', dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:30 AM', endTime: '12:20 PM', grade: 'Class 8', section: 'A', subject: 'Computer & AI', teacherName: 'Dr. Vikramaditya Sen', room: 'ATL Studio' },
    { id: 'tt-5', dayOfWeek: 'Monday', periodNumber: 5, startTime: '01:00 PM', endTime: '01:50 PM', grade: 'Class 8', section: 'A', subject: 'Social Science', teacherName: 'Mr. Arvind Joshi', room: 'Room 108' },
    { id: 'tt-6', dayOfWeek: 'Monday', periodNumber: 6, startTime: '02:00 PM', endTime: '02:50 PM', grade: 'Class 8', section: 'A', subject: 'Sports / Yoga', teacherName: 'Coach Surendra Singh', room: 'Athletic Arena' }
  ],
  'std-2': [
    { id: 'tt-7', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:20 AM', grade: 'Class 1', section: 'A', subject: 'Rhymes & Phonics', teacherName: 'Ms. Pooja Trivedi', room: 'Room 02' },
    { id: 'tt-8', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:30 AM', endTime: '10:20 AM', grade: 'Class 1', section: 'A', subject: 'Number Fun', teacherName: 'Ms. Pooja Trivedi', room: 'Room 02' },
    { id: 'tt-9', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:30 AM', endTime: '11:20 AM', grade: 'Class 1', section: 'A', subject: 'Drawing & Craft', teacherName: 'Mrs. Rekha Bhati', room: 'Junior Art Room' },
    { id: 'tt-10', dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:30 AM', endTime: '12:20 PM', grade: 'Class 1', section: 'A', subject: 'Free Play & Games', teacherName: 'Coach Surendra', room: 'Junior Play Court' }
  ]
};

export const DEMO_ATTENDANCE: Record<string, AttendanceRecord[]> = {
  'std-1': [
    { id: 'att-1', date: '2026-08-27', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-2', date: '2026-08-26', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-3', date: '2026-08-25', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-4', date: '2026-08-24', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-5', date: '2026-08-22', status: 'Late', remarks: 'Bus maintenance delay (arrived 08:15 AM)', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-6', date: '2026-08-21', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-7', date: '2026-08-20', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-8', date: '2026-08-19', status: 'Present', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-9', date: '2026-08-18', status: 'Absent', remarks: 'Medical Leave - Viral Flu', recordedBy: 'Mrs. Sunita Verma' },
    { id: 'att-10', date: '2026-08-15', status: 'Present', remarks: 'Independence Day Assembly', recordedBy: 'Mrs. Sunita Verma' }
  ],
  'std-2': [
    { id: 'att-11', date: '2026-08-27', status: 'Present', recordedBy: 'Ms. Pooja Trivedi' },
    { id: 'att-12', date: '2026-08-26', status: 'Present', recordedBy: 'Ms. Pooja Trivedi' },
    { id: 'att-13', date: '2026-08-25', status: 'Present', recordedBy: 'Ms. Pooja Trivedi' },
    { id: 'att-14', date: '2026-08-24', status: 'Present', recordedBy: 'Ms. Pooja Trivedi' },
    { id: 'att-15', date: '2026-08-22', status: 'Present', recordedBy: 'Ms. Pooja Trivedi' }
  ]
};

export const DEMO_RESULTS: Record<string, ExamResult[]> = {
  'std-1': [
    {
      id: 'res-1',
      examName: 'CBSE Term 1 Comprehensive Assessment 2026',
      subjects: [
        { subject: 'Mathematics', marksObtained: 98, maxMarks: 100, grade: 'A1', remarks: 'Flawless algebraic proofs' },
        { subject: 'General Science', marksObtained: 96, maxMarks: 100, grade: 'A1', remarks: 'Distinction in practicals' },
        { subject: 'English Language', marksObtained: 92, maxMarks: 100, grade: 'A1', remarks: 'Rich vocabulary & grammar' },
        { subject: 'Social Science', marksObtained: 90, maxMarks: 100, grade: 'A1', remarks: 'Good historical analysis' },
        { subject: 'Hindi Literature', marksObtained: 91, maxMarks: 100, grade: 'A1', remarks: 'Exemplary literature essay' },
        { subject: 'Computer & AI', marksObtained: 95, maxMarks: 100, grade: 'A1', remarks: 'Mastery of block coding' }
      ],
      totalMarks: 562,
      maxTotal: 600,
      percentage: 93.6,
      gpa: 9.8,
      rank: 1,
      overallGrade: 'A1 (Gold Honors)',
      teacherRemarks: 'Aryan exhibits profound academic discipline, intellectual curiosity, and exemplary peer leadership in Class 8-A.'
    }
  ],
  'std-2': [
    {
      id: 'res-2',
      examName: 'Foundational Stage Term 1 Evaluation 2026',
      subjects: [
        { subject: 'English Reading & Phonics', marksObtained: 48, maxMarks: 50, grade: 'A1', remarks: 'Fluent sentence reading' },
        { subject: 'Mathematics & Number Fun', marksObtained: 50, maxMarks: 50, grade: 'A1', remarks: 'Quick mental math' },
        { subject: 'Environmental Studies', marksObtained: 49, maxMarks: 50, grade: 'A1', remarks: 'Active classroom curiosity' },
        { subject: 'Arts & Creative Craft', marksObtained: 50, maxMarks: 50, grade: 'A1', remarks: 'Vibrant drawing skill' }
      ],
      totalMarks: 197,
      maxTotal: 200,
      percentage: 98.5,
      gpa: 10.0,
      rank: 1,
      overallGrade: 'A1+ (Star Scholar)',
      teacherRemarks: 'Anvi is an enthusiastic, cheerful, and extraordinarily sharp learner in Class 1-A.'
    }
  ]
};

export const DEMO_FEES: Record<string, FeeInvoice[]> = {
  'std-1': [
    {
      id: 'inv-1',
      invoiceNo: 'INV-2026-Q3-018',
      term: 'Quarter 3 (Oct - Dec 2026)',
      dueDate: '2026-10-15',
      amount: 35000,
      paidAmount: 0,
      status: 'Pending',
      breakdown: { tuition: 30000, laboratory: 3000, sports: 2000 },
      payments: []
    },
    {
      id: 'inv-2',
      invoiceNo: 'INV-2026-Q2-018',
      term: 'Quarter 2 (Jul - Sep 2026)',
      dueDate: '2026-07-15',
      amount: 35000,
      paidAmount: 35000,
      status: 'Paid',
      breakdown: { tuition: 30000, laboratory: 3000, sports: 2000 },
      payments: [
        { id: 'p-1', amount: 35000, date: '2026-07-10', method: 'UPI', receiptNo: 'REC-2026-0710-01' }
      ]
    }
  ],
  'std-2': [
    {
      id: 'inv-3',
      invoiceNo: 'INV-2026-Q3-104',
      term: 'Quarter 3 (Oct - Dec 2026)',
      dueDate: '2026-10-15',
      amount: 22000,
      paidAmount: 22000,
      status: 'Paid',
      breakdown: { tuition: 20000, sports: 2000 },
      payments: [
        { id: 'p-2', amount: 22000, date: '2026-08-20', method: 'UPI', receiptNo: 'REC-2026-0820-05' }
      ]
    }
  ]
};

export const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Mrs. Sunita Verma (Class Teacher)',
    senderRole: 'Teacher',
    content: 'Good morning Mr. Sharma. Aryan has been selected to represent our school at the Junior Science Olympiad in October.',
    timestamp: 'Yesterday at 03:30 PM',
    isFromMe: false
  },
  {
    id: 'msg-2',
    senderName: 'Mr. Vikram Sharma',
    senderRole: 'Parent',
    content: 'Thank you Mrs. Verma! That is wonderful news. Please let us know if any special reference materials are recommended.',
    timestamp: 'Yesterday at 04:00 PM',
    isFromMe: true
  },
  {
    id: 'msg-3',
    senderName: 'Mrs. Sunita Verma (Class Teacher)',
    senderRole: 'Teacher',
    content: 'I have uploaded the preparation problem sets directly into his Homework tab under Science. He can start practicing today.',
    timestamp: 'Today at 09:15 AM',
    isFromMe: false
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'CBSE Middle School Term 1 Assessment Timetable 2026-27',
    category: 'Examination',
    targetAudience: 'All',
    date: '2026-08-25',
    content: 'The comprehensive timetable for Classes 1 to 8 Term 1 CBSE Unit Assessments has been finalized. Morning assessment sessions will commence at 08:30 AM sharp in the Junior Examination Hall. Students are requested to bring necessary stationery.',
    pdfUrl: 'https://paradise-public-school.web.app/docs/term1-schedule.pdf',
    author: 'Academic Directorate',
    isPinned: true
  },
  {
    id: 'not-2',
    title: '32nd Annual Athletic Olympiad & Inter-House Sports Gala',
    category: 'Sports',
    targetAudience: 'All',
    date: '2026-08-20',
    content: 'We are delighted to announce the 32nd Annual Sports Gala scheduled for September 18-20, 2026 for all students from Nursery to Class 8. Events include Track & Field, Swimming, Gymnastics, and Fun Relays. Parents are cordially invited for the opening ceremony.',
    pdfUrl: 'https://paradise-public-school.web.app/docs/sports-schedule.pdf',
    author: 'Director of Physical Education',
    isPinned: true
  },
  {
    id: 'not-3',
    title: 'Term 1 Parent-Teacher Meeting (PTM) Interaction Slots',
    category: 'Academic',
    targetAudience: 'Parents',
    date: '2026-08-15',
    content: 'Parent-Teacher interaction slots for individual academic progress review for Nursery to Class 8 are now scheduled for Saturday between 09:00 AM and 01:30 PM. Grade reports and attendance records will be shared.',
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
    author: 'Principal Office',
    isPinned: false
  },
  {
    id: 'not-5',
    title: 'Notice: Transportation Bus Route 1 Schedule Adjustment',
    category: 'Urgent',
    targetAudience: 'Parents',
    date: '2026-08-05',
    content: 'Due to road maintenance work on Sumerpur Road, Bus #01 will arrive 10 minutes earlier at designated stops starting Monday morning. Please ensure your child is at the stop on time.',
    author: 'Transport Directorate',
    isPinned: false
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
  }
];

export const SCHOOL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    title: 'Atal Tinkering Jr. Robotics & STEM Studio',
    subtitle: 'Future-ready innovation lab',
    description: 'Dedicated innovation lab equipped with DIY electronics kits, 3D modelling, microcontrollers, and coding workstations for young learners.',
    iconName: 'hardware-chip-outline',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    features: ['Hands-on Robotics Kits', 'Visual Scratch & Python Coding', 'Science Olympiad Preparation', 'Dedicated Mentor Guidance']
  },
  {
    id: 'fac-2',
    title: 'Tagore Memorial Library & Reading Hub',
    subtitle: 'Over 25,000 titles & digital catalog',
    description: 'Rich collection of children’s encyclopedias, bilingual storybooks, reference journals, and quiet storytelling amphitheater.',
    iconName: 'book-outline',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    features: ['25,000+ Curated Books', 'Audio-Visual Corner', 'Digital E-Reader Tablets', 'Weekly Book Club']
  },
  {
    id: 'fac-3',
    title: 'Olympic-Standard Sports Arena & Pool',
    subtitle: 'Physical fitness & inter-house sports',
    description: 'Expansive natural-grass athletic track, temperature-regulated kids splash & swimming pool, basketball courts, and martial arts dojo.',
    iconName: 'football-outline',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800',
    features: ['Swimming Pool with Certified Coach', 'Synthetic Basketball Court', 'Cricket Nets & Football Field', 'Taekwondo & Yoga Sessions']
  },
  {
    id: 'fac-4',
    title: 'Smart Interactive Classrooms',
    subtitle: 'Interactive multimedia learning',
    description: 'Airy, ergonomically designed classrooms equipped with digital interactive flat panels, high-speed intranet, and multimedia learning modules.',
    iconName: 'desktop-outline',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800',
    features: ['75-inch Interactive Smart Boards', 'CCTV Monitored Safety', 'Child-Safe Ergonomic Furniture', 'Proper Natural Ventilation']
  },
  {
    id: 'fac-5',
    title: 'GPS Monitored Fleet Transport',
    subtitle: 'Safe, punctual, and air-conditioned',
    description: 'A fleet of verified school buses covering all major nodes in Pali and surrounding districts, with real-time GPS tracking and female attendants.',
    iconName: 'bus-outline',
    imageUrl: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=800',
    features: ['Real-Time GPS Location Tracking', 'Female Attendant on Every Route', 'Speed Governors & First-Aid Box', 'Direct Transport Coordinator Helpline']
  }
];

export const ADMISSION_STEPS = [
  { step: '1', title: 'Submit Application', desc: 'Fill out the online mobile application form or visit the admissions counter.' },
  { step: '2', title: 'Document Verification', desc: 'Submit birth certificate, previous report cards, and transfer certificate copies.' },
  { step: '3', title: 'Interaction & Assessment', desc: 'A friendly interaction with student and parents to understand learning aptitude.' },
  { step: '4', title: 'Enrollment & Welcome', desc: 'Complete fee clearance, receive school uniform, books, and orientation schedule.' }
];

export const REQUIRED_DOCUMENTS = [
  'Birth Certificate (issued by Municipal Authority)',
  'Transfer Certificate (Original) from previous school',
  'Previous Academic Report Card / Marksheet',
  '4 Recent Passport-sized Photographs of Candidate',
  '2 Photographs each of Mother & Father / Guardian',
  'Aadhar Card copy of Student and Parents',
  'Blood Group & Medical Fitness Certificate'
];
