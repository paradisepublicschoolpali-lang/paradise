import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  SchoolConfig,
  TeacherPeriod,
  SchoolSubject
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_NOTICES,
  INITIAL_ADMISSIONS,
  INITIAL_HOMEWORK,
  INITIAL_HOMEWORK_SUBMISSIONS,
  INITIAL_ATTENDANCE_LOGS,
  INITIAL_LEAVES,
  INITIAL_EXAM_RESULTS,
  INITIAL_FEES,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_SUBJECTS,
  INITIAL_TEACHER_PERIODS
} from '../data/mockData';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

export const INITIAL_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'Paradise Public School',
  motto: 'Excellence • Integrity • Leadership',
  affiliationCode: 'CBSE Affiliation No: 2130842 / School Code: 71234',
  academicYear: '2026-2027',
  currentTerm: 'Term 1 (Mid-Session)',
  contactEmail: 'paradisepublicschool.pali@gmail.com',
  contactPhone: '+91 11 2765 4321',
  address: '42 Heritage Avenue, North Campus Enclave, New Delhi - 110007, India',
  principalName: 'Dr. Renu Gupta',
  principalPhoto: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=800',
  principalMessage: 'We prepare students not merely for examinations, but for life and nation-building.',
  heroHeadline: 'Shaping Leaders of Tomorrow',
  heroSubtitle: 'Where timeless cultural values meet academic excellence, STEM innovation, and holistic athletic development.',
  logoType: 'shield',
  logoLetter: 'P',
  logoShieldColor: '#1E40AF',
  logoAccentColor: '#2563EB',
  logoImageUrl: ''
};

interface SchoolDataContextType {
  students: Student[];
  teachers: Teacher[];
  notices: Notice[];
  admissions: AdmissionApplication[];
  homework: HomeworkItem[];
  submissions: HomeworkSubmission[];
  attendanceLogs: AttendanceRecord[];
  leaves: LeaveApplication[];
  results: ExamResult[];
  fees: FeeItem[];
  events: SchoolEvent[];
  gallery: GalleryItem[];
  schoolConfig: SchoolConfig;
  subjects: SchoolSubject[];
  teacherPeriods: TeacherPeriod[];

  // Cloud Sync
  refreshFromSupabase: () => Promise<void>;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>) => void;
  enrollStudentWithFee: (
    studentData: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>,
    feeData: { term: string; dueDate: string; tuition: number; status: FeeItem['status'] }
  ) => { student: Student; fee: FeeItem };
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Notice Actions
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  updateNotice: (id: string, updated: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;

  // Admission Actions
  submitAdmission: (app: Omit<AdmissionApplication, 'id' | 'applicationNo' | 'submissionDate' | 'status'>) => string;
  updateAdmissionStatus: (id: string, status: AdmissionApplication['status'], notes?: string) => void;
  updateAdmissionApplication: (id: string, updated: Partial<AdmissionApplication>) => void;
  deleteAdmissionApplication: (id: string) => void;
  convertApplicationToStudent: (appId: string, studentData: Partial<Student>) => void;

  // Homework Actions
  addHomework: (hw: Omit<HomeworkItem, 'id' | 'assignedDate' | 'status'>) => void;
  updateHomework: (id: string, updated: Partial<HomeworkItem>) => void;
  deleteHomework: (id: string) => void;
  submitHomeworkSolution: (submission: { homeworkId: string; studentId: string; studentName: string; fileName: string }) => void;
  gradeHomeworkSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Attendance & Leaves
  markAttendanceBulk: (records: { studentId: string; studentName: string; grade: string; section: string; status: AttendanceRecord['status'] }[]) => void;
  applyLeave: (leave: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => void;
  updateLeaveStatus: (id: string, status: LeaveApplication['status']) => void;

  // Exam Results
  saveExamResult: (result: ExamResult) => void;
  deleteExamResult: (id: string) => void;

  // Fees
  addFeeInvoice: (fee: Omit<FeeItem, 'id' | 'paidAmount' | 'paymentDate' | 'paymentMethod' | 'transactionId'>) => void;
  updateFeeInvoice: (id: string, updated: Partial<FeeItem>) => void;
  deleteFeeInvoice: (id: string) => void;
  payFeeInvoice: (invoiceId: string, paymentMethod: FeeItem['paymentMethod']) => void;

  // School Subjects (Admin Directorate)
  addSubject: (subject: Omit<SchoolSubject, 'id'>) => void;
  updateSubject: (id: string, updated: Partial<SchoolSubject>) => void;
  deleteSubject: (id: string) => void;

  // Teacher Periods / Timetable (Permanent & Day-Only)
  addTeacherPeriod: (period: Omit<TeacherPeriod, 'id'>) => void;
  updateTeacherPeriod: (id: string, updated: Partial<TeacherPeriod>) => void;
  deleteTeacherPeriod: (id: string) => void;

  // Events & Gallery
  addEvent: (event: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'isUpcoming'>) => void;
  updateEvent: (id: string, updated: Partial<SchoolEvent>) => void;
  deleteEvent: (id: string) => void;
  rsvpEvent: (eventId: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  updateGalleryItem: (id: string, updated: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // School Config
  updateSchoolConfig: (updated: Partial<SchoolConfig>) => void;

  // Reset
  resetAllData: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'pps_v1_';

function getStoredOrDefault<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => getStoredOrDefault('students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => getStoredOrDefault('teachers', INITIAL_TEACHERS));
  const [notices, setNotices] = useState<Notice[]>(() => getStoredOrDefault('notices', INITIAL_NOTICES));
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => getStoredOrDefault('admissions', INITIAL_ADMISSIONS));
  const [homework, setHomework] = useState<HomeworkItem[]>(() => getStoredOrDefault('homework', INITIAL_HOMEWORK));
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => getStoredOrDefault('submissions', INITIAL_HOMEWORK_SUBMISSIONS));
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(() => getStoredOrDefault('attendance', INITIAL_ATTENDANCE_LOGS));
  const [leaves, setLeaves] = useState<LeaveApplication[]>(() => getStoredOrDefault('leaves', INITIAL_LEAVES));
  const [results, setResults] = useState<ExamResult[]>(() => getStoredOrDefault('results', INITIAL_EXAM_RESULTS));
  const [fees, setFees] = useState<FeeItem[]>(() => getStoredOrDefault('fees', INITIAL_FEES));
  const [events, setEvents] = useState<SchoolEvent[]>(() => getStoredOrDefault('events', INITIAL_EVENTS));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => getStoredOrDefault('gallery', INITIAL_GALLERY));
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => getStoredOrDefault('config', INITIAL_SCHOOL_CONFIG));
  const [subjects, setSubjects] = useState<SchoolSubject[]>(() => getStoredOrDefault('subjects', INITIAL_SUBJECTS));
  const [teacherPeriods, setTeacherPeriods] = useState<TeacherPeriod[]>(() => getStoredOrDefault('periods', INITIAL_TEACHER_PERIODS));

  // Local storage persistence
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'admissions', JSON.stringify(admissions)); }, [admissions]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'homework', JSON.stringify(homework)); }, [homework]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'submissions', JSON.stringify(submissions)); }, [submissions]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(attendanceLogs)); }, [attendanceLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'results', JSON.stringify(results)); }, [results]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'fees', JSON.stringify(fees)); }, [fees]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'gallery', JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'config', JSON.stringify(schoolConfig)); }, [schoolConfig]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem(STORAGE_PREFIX + 'periods', JSON.stringify(teacherPeriods)); }, [teacherPeriods]);

  // Full Refresh from Supabase
  const refreshFromSupabase = useCallback(async () => {
    if (!supabaseService.isConfigured()) return;
    try {
      const [
        cloudStudents,
        cloudTeachers,
        cloudNotices,
        cloudAdmissions,
        cloudHomework,
        cloudSubmissions,
        cloudAttendance,
        cloudLeaves,
        cloudResults,
        cloudFees,
        cloudEvents,
        cloudGallery
      ] = await Promise.all([
        supabaseService.getStudents(),
        supabaseService.getTeachers(),
        supabaseService.getNotices(),
        supabaseService.getAdmissions(),
        supabaseService.getHomework(),
        supabaseService.getSubmissions(),
        supabaseService.getAttendance(),
        supabaseService.getLeaves(),
        supabaseService.getExamResults(),
        supabaseService.getFees(),
        supabaseService.getEvents(),
        supabaseService.getGallery()
      ]);

      if (cloudStudents && cloudStudents.length > 0) setStudents(cloudStudents);
      if (cloudTeachers && cloudTeachers.length > 0) setTeachers(cloudTeachers);
      if (cloudNotices && cloudNotices.length > 0) setNotices(cloudNotices);
      if (cloudAdmissions && cloudAdmissions.length > 0) setAdmissions(cloudAdmissions);
      if (cloudHomework && cloudHomework.length > 0) setHomework(cloudHomework);
      if (cloudSubmissions && cloudSubmissions.length > 0) setSubmissions(cloudSubmissions);
      if (cloudAttendance && cloudAttendance.length > 0) setAttendanceLogs(cloudAttendance);
      if (cloudLeaves && cloudLeaves.length > 0) setLeaves(cloudLeaves);
      if (cloudResults && cloudResults.length > 0) setResults(cloudResults);
      if (cloudFees && cloudFees.length > 0) setFees(cloudFees);
      if (cloudEvents && cloudEvents.length > 0) setEvents(cloudEvents);
      if (cloudGallery && cloudGallery.length > 0) setGallery(cloudGallery);
    } catch (err) {
      console.warn('Supabase pull error:', err);
    }
  }, []);

  // Initial cloud fetch & realtime listeners
  useEffect(() => {
    refreshFromSupabase();

    // Supabase Realtime channel setup
    if (supabaseService.isConfigured()) {
      const channel = supabase
        .channel('pps_realtime_sync')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          refreshFromSupabase();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refreshFromSupabase]);

  // ==========================================
  // STUDENT ACTIONS
  // ==========================================
  const addStudent = (studentData: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      attendanceRate: 100,
      gpa: 4.0,
      feeStatus: 'Paid'
    };
    setStudents(prev => [newStudent, ...prev]);
    supabaseService.upsertStudent(newStudent);
  };

  const enrollStudentWithFee = (
    studentData: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>,
    feeData: { term: string; dueDate: string; tuition: number; status: FeeItem['status'] }
  ) => {
    const studentId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: studentId,
      attendanceRate: 100,
      gpa: 4.0,
      feeStatus: feeData.status === 'Paid' ? 'Paid' : 'Pending'
    };

    const tuitionAmount = Number(feeData.tuition);
    const newFee: FeeItem = {
      id: `fee-${Date.now()}`,
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: studentId,
      studentName: studentData.name,
      grade: `${studentData.grade}-${studentData.section}`,
      term: feeData.term || 'Quarter 3 (Oct - Dec 2026)',
      dueDate: feeData.dueDate || new Date().toISOString().split('T')[0],
      breakdown: {
        tuition: tuitionAmount
      },
      totalAmount: tuitionAmount,
      paidAmount: feeData.status === 'Paid' ? tuitionAmount : 0,
      status: feeData.status || 'Pending',
      paymentDate: feeData.status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined,
      paymentMethod: feeData.status === 'Paid' ? 'UPI' : undefined
    };

    setStudents(prev => [newStudent, ...prev]);
    supabaseService.upsertStudent(newStudent);
    setFees(prev => [newFee, ...prev]);
    supabaseService.upsertFee(newFee);

    return { student: newStudent, fee: newFee };
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => {
      const next = prev.map(s => (s.id === id ? { ...s, ...updated } : s));
      const target = next.find(s => s.id === id);
      if (target) supabaseService.upsertStudent(target);
      return next;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    supabaseService.deleteStudent(id);
  };

  // ==========================================
  // TEACHER ACTIONS
  // ==========================================
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`
    };
    setTeachers(prev => [newTeacher, ...prev]);
    supabaseService.upsertTeacher(newTeacher);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...updated } : t));
      const target = next.find(t => t.id === id);
      if (target) supabaseService.upsertTeacher(target);
      return next;
    });
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    supabaseService.deleteTeacher(id);
  };

  // ==========================================
  // NOTICE ACTIONS
  // ==========================================
  const addNotice = (noticeData: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
    supabaseService.createNotice(newNotice);
  };

  const updateNotice = (id: string, updated: Partial<Notice>) => {
    setNotices(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, ...updated } : n));
      const target = next.find(n => n.id === id);
      if (target) supabaseService.createNotice(target);
      return next;
    });
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    supabaseService.deleteNotice(id);
  };

  // ==========================================
  // ADMISSION ACTIONS
  // ==========================================
  const submitAdmission = (appData: Omit<AdmissionApplication, 'id' | 'applicationNo' | 'submissionDate' | 'status'>) => {
    const appNo = `PPS-ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: AdmissionApplication = {
      ...appData,
      id: `adm-app-${Date.now()}`,
      applicationNo: appNo,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setAdmissions(prev => [newApp, ...prev]);
    supabaseService.upsertAdmission(newApp);
    return appNo;
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status'], notes?: string) => {
    setAdmissions(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, status, notes: notes !== undefined ? notes : a.notes } : a));
      const target = next.find(a => a.id === id);
      if (target) supabaseService.upsertAdmission(target);
      return next;
    });
  };

  const updateAdmissionApplication = (id: string, updated: Partial<AdmissionApplication>) => {
    setAdmissions(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...updated } : a));
      const target = next.find(a => a.id === id);
      if (target) supabaseService.upsertAdmission(target);
      return next;
    });
  };

  const deleteAdmissionApplication = (id: string) => {
    setAdmissions(prev => prev.filter(a => a.id !== id));
    supabaseService.deleteAdmission(id);
  };

  const convertApplicationToStudent = (appId: string, customStudentData: Partial<Student>) => {
    const app = admissions.find(a => a.id === appId);
    if (!app) return;

    const baseName = app.applicantName.toLowerCase().split(' ')[0];
    const generatedLoginId = customStudentData.loginId || `${baseName}${Math.floor(10 + Math.random() * 90)}`;
    const generatedPassword = customStudentData.password || 'password123';

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      loginId: generatedLoginId,
      password: generatedPassword,
      admissionNo: `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo: customStudentData.rollNo || '08A-99',
      name: app.applicantName,
      grade: customStudentData.grade || app.gradeApplying || 'Grade 8',
      section: customStudentData.section || 'A',
      house: (customStudentData.house || 'Phoenix Gold') as any,
      dob: app.dob || '2010-06-15',
      gender: app.gender || 'Male',
      bloodGroup: customStudentData.bloodGroup || 'O+',
      guardianName: app.parentName,
      guardianPhone: app.parentPhone,
      guardianEmail: app.parentEmail,
      address: app.address || '',
      busRoute: customStudentData.busRoute || 'Route 4 - Central Campus',
      busNumber: customStudentData.busNumber || 'PPS-BUS-04',
      lockerNumber: customStudentData.lockerNumber || 'LK-01',
      avatar: customStudentData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      attendanceRate: 100,
      gpa: 4.0,
      feeStatus: 'Paid'
    };

    setStudents(prev => [newStudent, ...prev]);
    supabaseService.upsertStudent(newStudent);
    updateAdmissionStatus(appId, 'Accepted', `Enrolled as student with Login ID: ${generatedLoginId}`);
  };

  // ==========================================
  // HOMEWORK ACTIONS
  // ==========================================
  const addHomework = (hwData: Omit<HomeworkItem, 'id' | 'assignedDate' | 'status'>) => {
    const newHw: HomeworkItem = {
      ...hwData,
      id: `hw-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setHomework(prev => [newHw, ...prev]);
    supabaseService.upsertHomework(newHw);
  };

  const updateHomework = (id: string, updated: Partial<HomeworkItem>) => {
    setHomework(prev => {
      const next = prev.map(h => (h.id === id ? { ...h, ...updated } : h));
      const target = next.find(h => h.id === id);
      if (target) supabaseService.upsertHomework(target);
      return next;
    });
  };

  const deleteHomework = (id: string) => {
    setHomework(prev => prev.filter(h => h.id !== id));
    supabaseService.deleteHomework(id);
  };

  const submitHomeworkSolution = ({ homeworkId, studentId, studentName, fileName }: { homeworkId: string; studentId: string; studentName: string; fileName: string }) => {
    const existing = submissions.find(s => s.homeworkId === homeworkId && s.studentId === studentId);
    if (existing) {
      const updatedSub: HomeworkSubmission = {
        ...existing,
        submissionDate: new Date().toISOString().split('T')[0],
        fileName,
        status: 'Submitted'
      };
      setSubmissions(prev => prev.map(s => s.id === existing.id ? updatedSub : s));
      supabaseService.upsertSubmission(updatedSub);
    } else {
      const newSub: HomeworkSubmission = {
        id: `sub-${Date.now()}`,
        homeworkId,
        studentId,
        studentName,
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        fileName
      };
      setSubmissions(prev => [newSub, ...prev]);
      supabaseService.upsertSubmission(newSub);
    }
  };

  const gradeHomeworkSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev => {
      const next = prev.map(s => s.id === submissionId ? { ...s, score, feedback, status: 'Graded' as const } : s);
      const target = next.find(s => s.id === submissionId);
      if (target) supabaseService.upsertSubmission(target);
      return next;
    });
  };

  // ==========================================
  // ATTENDANCE & LEAVES
  // ==========================================
  const markAttendanceBulk = (records: { studentId: string; studentName: string; grade: string; section: string; status: AttendanceRecord['status'] }[]) => {
    const today = new Date().toISOString().split('T')[0];
    const newLogs: AttendanceRecord[] = records.map(r => ({
      id: `att-${Date.now()}-${r.studentId}`,
      studentId: r.studentId,
      studentName: r.studentName,
      grade: r.grade,
      section: r.section,
      date: today,
      status: r.status
    }));

    const studentIds = new Set(records.map(r => r.studentId));
    setAttendanceLogs(prev => {
      const filtered = prev.filter(l => !(l.date === today && studentIds.has(l.studentId)));
      return [...newLogs, ...filtered];
    });

    supabaseService.upsertAttendanceBulk(newLogs);
  };

  const applyLeave = (leaveData: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveApplication = {
      ...leaveData,
      id: `lev-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaves(prev => [newLeave, ...prev]);
    supabaseService.upsertLeave(newLeave);
  };

  const updateLeaveStatus = (id: string, status: LeaveApplication['status']) => {
    setLeaves(prev => {
      const next = prev.map(l => (l.id === id ? { ...l, status } : l));
      const target = next.find(l => l.id === id);
      if (target) supabaseService.upsertLeave(target);
      return next;
    });
  };

  // ==========================================
  // EXAM RESULTS
  // ==========================================
  const saveExamResult = (result: ExamResult) => {
    setResults(prev => {
      const idx = prev.findIndex(r => r.id === result.id || (r.studentId === result.studentId && r.examName === result.examName));
      let next: ExamResult[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = result;
      } else {
        next = [result, ...prev];
      }
      return next;
    });
    supabaseService.upsertExamResult(result);
  };

  const deleteExamResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
    supabaseService.deleteExamResult(id);
  };

  // ==========================================
  // FEES
  // ==========================================
  const addFeeInvoice = (feeData: Omit<FeeItem, 'id' | 'paidAmount' | 'paymentDate' | 'paymentMethod' | 'transactionId'>) => {
    const newFee: FeeItem = {
      ...feeData,
      id: `fee-${Date.now()}`,
      paidAmount: feeData.status === 'Paid' ? feeData.totalAmount : 0,
      paymentDate: feeData.status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined
    };
    setFees(prev => [newFee, ...prev]);
    supabaseService.upsertFee(newFee);
  };

  const updateFeeInvoice = (id: string, updated: Partial<FeeItem>) => {
    setFees(prev => {
      const next = prev.map(f => (f.id === id ? { ...f, ...updated } : f));
      const target = next.find(f => f.id === id);
      if (target) supabaseService.upsertFee(target);
      return next;
    });
  };

  const deleteFeeInvoice = (id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
    supabaseService.deleteFee(id);
  };

  const payFeeInvoice = (invoiceId: string, paymentMethod: FeeItem['paymentMethod']) => {
    setFees(prev => {
      const next = prev.map(f => {
        if (f.id === invoiceId) {
          const updated: FeeItem = {
            ...f,
            status: 'Paid',
            paidAmount: f.totalAmount,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod,
            transactionId: `TXN-PARADISE-${Math.floor(10000000 + Math.random() * 90000000)}`
          };
          supabaseService.upsertFee(updated);
          return updated;
        }
        return f;
      });
      return next;
    });
  };

  // ==========================================
  // EVENTS & GALLERY
  // ==========================================
  const addEvent = (evtData: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'isUpcoming'>) => {
    const newEvt: SchoolEvent = {
      ...evtData,
      id: `evt-${Date.now()}`,
      rsvpCount: 1,
      isUpcoming: true
    };
    setEvents(prev => [newEvt, ...prev]);
    supabaseService.upsertEvent(newEvt);
  };

  const updateEvent = (id: string, updated: Partial<SchoolEvent>) => {
    setEvents(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, ...updated } : e));
      const target = next.find(e => e.id === id);
      if (target) supabaseService.upsertEvent(target);
      return next;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    supabaseService.deleteEvent(id);
  };

  const rsvpEvent = (eventId: string) => {
    setEvents(prev => {
      const next = prev.map(e => (e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e));
      const target = next.find(e => e.id === eventId);
      if (target) supabaseService.upsertEvent(target);
      return next;
    });
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'date'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGallery(prev => [newItem, ...prev]);
    supabaseService.upsertGalleryItem(newItem);
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => {
      const next = prev.map(g => (g.id === id ? { ...g, ...updated } : g));
      const target = next.find(g => g.id === id);
      if (target) supabaseService.upsertGalleryItem(target);
      return next;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    supabaseService.deleteGalleryItem(id);
  };

  // ==========================================
  // SCHOOL SUBJECTS (ADMIN DIRECTORATE)
  // ==========================================
  const addSubject = (subData: Omit<SchoolSubject, 'id'>) => {
    const newSub: SchoolSubject = {
      ...subData,
      id: `sub-${Date.now()}`
    };
    setSubjects(prev => [newSub, ...prev]);
  };

  const updateSubject = (id: string, updated: Partial<SchoolSubject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // ==========================================
  // TEACHER PERIODS & TIMETABLE (PERMANENT & DAY-ONLY)
  // ==========================================
  const addTeacherPeriod = (periodData: Omit<TeacherPeriod, 'id'>) => {
    const newPeriod: TeacherPeriod = {
      ...periodData,
      id: `prd-${Date.now()}`
    };
    setTeacherPeriods(prev => [newPeriod, ...prev]);
  };

  const updateTeacherPeriod = (id: string, updated: Partial<TeacherPeriod>) => {
    setTeacherPeriods(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteTeacherPeriod = (id: string) => {
    setTeacherPeriods(prev => prev.filter(p => p.id !== id));
  };

  // ==========================================
  // CONFIG
  // ==========================================
  const updateSchoolConfig = (updated: Partial<SchoolConfig>) => {
    setSchoolConfig(prev => ({ ...prev, ...updated }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setNotices(INITIAL_NOTICES);
    setAdmissions(INITIAL_ADMISSIONS);
    setHomework(INITIAL_HOMEWORK);
    setSubmissions(INITIAL_HOMEWORK_SUBMISSIONS);
    setAttendanceLogs(INITIAL_ATTENDANCE_LOGS);
    setLeaves(INITIAL_LEAVES);
    setResults(INITIAL_EXAM_RESULTS);
    setFees(INITIAL_FEES);
    setEvents(INITIAL_EVENTS);
    setGallery(INITIAL_GALLERY);
    setSchoolConfig(INITIAL_SCHOOL_CONFIG);
    setSubjects(INITIAL_SUBJECTS);
    setTeacherPeriods(INITIAL_TEACHER_PERIODS);
  };

  return (
    <SchoolDataContext.Provider
      value={{
        students,
        teachers,
        notices,
        admissions,
        homework,
        submissions,
        attendanceLogs,
        leaves,
        results,
        fees,
        events,
        gallery,
        schoolConfig,
        subjects,
        teacherPeriods,
        refreshFromSupabase,
        addStudent,
        enrollStudentWithFee,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addNotice,
        updateNotice,
        deleteNotice,
        submitAdmission,
        updateAdmissionStatus,
        updateAdmissionApplication,
        deleteAdmissionApplication,
        convertApplicationToStudent,
        addHomework,
        updateHomework,
        deleteHomework,
        submitHomeworkSolution,
        gradeHomeworkSubmission,
        markAttendanceBulk,
        applyLeave,
        updateLeaveStatus,
        saveExamResult,
        deleteExamResult,
        addFeeInvoice,
        updateFeeInvoice,
        deleteFeeInvoice,
        payFeeInvoice,
        addSubject,
        updateSubject,
        deleteSubject,
        addTeacherPeriod,
        updateTeacherPeriod,
        deleteTeacherPeriod,
        addEvent,
        updateEvent,
        deleteEvent,
        rsvpEvent,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        updateSchoolConfig,
        resetAllData
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};
