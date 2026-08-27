import React, { createContext, useContext, useState, useEffect } from 'react';
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
  SchoolConfig
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
  INITIAL_GALLERY
} from '../data/mockData';
import { supabaseService } from '../services/supabaseService';

export const INITIAL_SCHOOL_CONFIG: SchoolConfig = {
  schoolName: 'Paradise Public School',
  motto: 'Excellence • Integrity • Leadership',
  affiliationCode: 'PPS-CBSE-992140 / CAMBRIDGE-IB-884',
  academicYear: '2026-2027',
  currentTerm: 'Term 1 (Mid-Session)',
  contactEmail: 'admissions@paradiseschool.edu',
  contactPhone: '+1 (800) 842-PARADISE',
  address: '42 Heritage Avenue, North Campus Enclave, New Delhi, India',
  principalName: 'Dr. Robert Vance',
  principalPhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
  principalMessage: 'We prepare students not merely for exams, but for life itself.',
  heroHeadline: 'Shaping Global Leaders of Tomorrow',
  heroSubtitle: 'Where timeless traditional values meet futuristic academic excellence, STEM leadership, and world-class athletic facilities.',
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

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>) => void;
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

  // Initial cloud fetch if Supabase is connected
  useEffect(() => {
    const fetchCloudData = async () => {
      if (supabaseService.isConfigured()) {
        try {
          const cloudStudents = await supabaseService.getStudents();
          if (cloudStudents && cloudStudents.length > 0) {
            setStudents(cloudStudents);
          }
          const cloudTeachers = await supabaseService.getTeachers();
          if (cloudTeachers && cloudTeachers.length > 0) {
            setTeachers(cloudTeachers);
          }
          const cloudNotices = await supabaseService.getNotices();
          if (cloudNotices && cloudNotices.length > 0) {
            setNotices(cloudNotices);
          }
        } catch (err) {
          console.warn('Initial Supabase sync skipped:', err);
        }
      }
    };
    fetchCloudData();
  }, []);

  // Student methods
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

  // Teacher methods
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

  // Notice methods
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

  // Admission methods
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
    return appNo;
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status'], notes?: string) => {
    setAdmissions(prev =>
      prev.map(a => (a.id === id ? { ...a, status, notes: notes !== undefined ? notes : a.notes } : a))
    );
  };

  const updateAdmissionApplication = (id: string, updated: Partial<AdmissionApplication>) => {
    setAdmissions(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAdmissionApplication = (id: string) => {
    setAdmissions(prev => prev.filter(a => a.id !== id));
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
    updateAdmissionStatus(appId, 'Accepted', `Enrolled as student with Login ID: ${generatedLoginId}`);
  };

  // Homework methods
  const addHomework = (hwData: Omit<HomeworkItem, 'id' | 'assignedDate' | 'status'>) => {
    const newHw: HomeworkItem = {
      ...hwData,
      id: `hw-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setHomework(prev => [newHw, ...prev]);
  };

  const updateHomework = (id: string, updated: Partial<HomeworkItem>) => {
    setHomework(prev => prev.map(h => (h.id === id ? { ...h, ...updated } : h)));
  };

  const deleteHomework = (id: string) => {
    setHomework(prev => prev.filter(h => h.id !== id));
  };

  const submitHomeworkSolution = ({ homeworkId, studentId, studentName, fileName }: { homeworkId: string; studentId: string; studentName: string; fileName: string }) => {
    const existing = submissions.find(s => s.homeworkId === homeworkId && s.studentId === studentId);
    if (existing) {
      setSubmissions(prev =>
        prev.map(s =>
          s.id === existing.id
            ? { ...s, submissionDate: new Date().toISOString().split('T')[0], fileName, status: 'Submitted' }
            : s
        )
      );
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
    }
  };

  const gradeHomeworkSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId ? { ...s, score, feedback, status: 'Graded' } : s
      )
    );
  };

  // Attendance & Leaves
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
    setAttendanceLogs(prev => [
      ...newLogs,
      ...prev.filter(l => !(l.date === today && studentIds.has(l.studentId)))
    ]);
  };

  const applyLeave = (leaveData: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newLeave: LeaveApplication = {
      ...leaveData,
      id: `lev-${Date.now()}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: LeaveApplication['status']) => {
    setLeaves(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  // Results
  const saveExamResult = (result: ExamResult) => {
    setResults(prev => {
      const idx = prev.findIndex(r => r.id === result.id || (r.studentId === result.studentId && r.examName === result.examName));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = result;
        return copy;
      }
      return [result, ...prev];
    });
  };

  const deleteExamResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
  };

  // Fees
  const addFeeInvoice = (feeData: Omit<FeeItem, 'id' | 'paidAmount' | 'paymentDate' | 'paymentMethod' | 'transactionId'>) => {
    const newFee: FeeItem = {
      ...feeData,
      id: `fee-${Date.now()}`,
      paidAmount: feeData.status === 'Paid' ? feeData.totalAmount : 0,
      paymentDate: feeData.status === 'Paid' ? new Date().toISOString().split('T')[0] : undefined
    };
    setFees(prev => [newFee, ...prev]);
  };

  const updateFeeInvoice = (id: string, updated: Partial<FeeItem>) => {
    setFees(prev => prev.map(f => (f.id === id ? { ...f, ...updated } : f)));
  };

  const deleteFeeInvoice = (id: string) => {
    setFees(prev => prev.filter(f => f.id !== id));
  };

  const payFeeInvoice = (invoiceId: string, paymentMethod: FeeItem['paymentMethod']) => {
    setFees(prev =>
      prev.map(f => {
        if (f.id === invoiceId) {
          return {
            ...f,
            status: 'Paid',
            paidAmount: f.totalAmount,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod,
            transactionId: `TXN-PARADISE-${Math.floor(10000000 + Math.random() * 90000000)}`
          };
        }
        return f;
      })
    );
  };

  // Events & Gallery
  const addEvent = (evtData: Omit<SchoolEvent, 'id' | 'rsvpCount' | 'isUpcoming'>) => {
    const newEvt: SchoolEvent = {
      ...evtData,
      id: `evt-${Date.now()}`,
      rsvpCount: 1,
      isUpcoming: true
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  const updateEvent = (id: string, updated: Partial<SchoolEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const rsvpEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e))
    );
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'date'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const updateGalleryItem = (id: string, updated: Partial<GalleryItem>) => {
    setGallery(prev => prev.map(g => (g.id === id ? { ...g, ...updated } : g)));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  // Config
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
        addStudent,
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
