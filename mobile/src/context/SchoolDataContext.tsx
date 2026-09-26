import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  SchoolConfig,
  Notice,
  SchoolEvent,
  GalleryItem,
  Facility,
  AdmissionApplication,
  Student,
  HomeworkTask,
  TimetableSlot,
  AttendanceRecord,
  ExamResult,
  FeeInvoice,
  LeaveRequest,
  ChatMessage
} from '../types';
import {
  SCHOOL_CONFIG,
  DEMO_STUDENTS,
  DEMO_HOMEWORK,
  DEMO_TIMETABLE,
  DEMO_ATTENDANCE,
  DEMO_RESULTS,
  DEMO_FEES,
  DEMO_MESSAGES,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  SCHOOL_FACILITIES
} from '../data/schoolData';
import { mobileApiService } from '../services/apiService';

interface SchoolDataContextType {
  config: SchoolConfig;
  notices: Notice[];
  events: SchoolEvent[];
  gallery: GalleryItem[];
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  submitAdmission: (data: Omit<AdmissionApplication, 'id' | 'applicationNo' | 'submissionDate' | 'status'>) => Promise<string>;
  rsvpEvent: (id: string) => void;

  // Multi-Child & ERP State
  students: Student[];
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeStudent: Student;
  homework: HomeworkTask[];
  timetable: TimetableSlot[];
  attendance: AttendanceRecord[];
  examResults: ExamResult[];
  fees: FeeInvoice[];
  leaveRequests: LeaveRequest[];
  messages: ChatMessage[];
  submitHomework: (homeworkId: string) => void;
  submitLeaveRequest: (fromDate: string, toDate: string, reason: string) => void;
  payFeeInvoice: (invoiceId: string, amount: number) => void;
  sendMessage: (content: string) => void;

  // Admin Customization & Operations
  updateConfig: (newConfig: Partial<SchoolConfig>) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  addEvent: (event: Omit<SchoolEvent, 'id' | 'rsvpCount'>) => void;
  deleteEvent: (id: string) => void;
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SchoolConfig>(SCHOOL_CONFIG);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [gallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [facilities] = useState<Facility[]>(SCHOOL_FACILITIES);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ERP State
  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [activeStudentId, setActiveStudentId] = useState<string>(DEMO_STUDENTS[0]?.id || 'std-1');
  const [allHomework, setAllHomework] = useState<Record<string, HomeworkTask[]>>(DEMO_HOMEWORK);
  const [allAttendance, setAllAttendance] = useState<Record<string, AttendanceRecord[]>>(DEMO_ATTENDANCE);
  const [allFees, setAllFees] = useState<Record<string, FeeInvoice[]>>(DEMO_FEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'leave-1',
      studentId: 'std-1',
      fromDate: '2026-08-18',
      toDate: '2026-08-18',
      reason: 'Viral fever and physician recommended rest',
      status: 'Approved',
      appliedDate: '2026-08-17'
    }
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);

  // Computed child data
  const activeStudent = useMemo(() => {
    return students.find(s => s.id === activeStudentId) || students[0];
  }, [students, activeStudentId]);

  const homework = useMemo(() => {
    return allHomework[activeStudentId] || [];
  }, [allHomework, activeStudentId]);

  const timetable = useMemo(() => {
    return DEMO_TIMETABLE[activeStudentId] || [];
  }, [activeStudentId]);

  const attendance = useMemo(() => {
    return allAttendance[activeStudentId] || [];
  }, [allAttendance, activeStudentId]);

  const examResults = useMemo(() => {
    return DEMO_RESULTS[activeStudentId] || [];
  }, [activeStudentId]);

  const fees = useMemo(() => {
    return allFees[activeStudentId] || [];
  }, [allFees, activeStudentId]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const isOnline = await mobileApiService.isBackendAvailable();
      if (isOnline) {
        try {
          const noticesRes = await mobileApiService.getNotices();
          if (noticesRes.success && noticesRes.notices?.length > 0) {
            setNotices(noticesRes.notices.map(n => ({
              id: n.id,
              title: n.title,
              category: n.category === 'EXAMINATION' ? 'Examination' : n.category === 'SPORTS' ? 'Sports' : n.category === 'ACADEMIC' ? 'Academic' : n.category === 'URGENT' ? 'Urgent' : 'General',
              targetAudience: n.targetAudience === 'ALL' ? 'All' : 'Parents',
              date: n.date,
              content: n.content,
              pdfUrl: n.pdfUrl,
              author: n.author,
              isPinned: n.isPinned
            })));
          }
        } catch {
          setNotices(INITIAL_NOTICES);
        }
      } else {
        setNotices(INITIAL_NOTICES);
        setEvents(INITIAL_EVENTS);
      }
      await new Promise(r => setTimeout(r, 400));
    } catch {
      setError('Unable to fetch latest school updates. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAdmission = useCallback(async (data: Omit<AdmissionApplication, 'id' | 'applicationNo' | 'submissionDate' | 'status'>): Promise<string> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const applicationNo = `PPS-ADM-2026-${randomNum}`;
    const newApp: AdmissionApplication = {
      ...data,
      id: `adm-${Date.now()}`,
      applicationNo,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setAdmissions(prev => [newApp, ...prev]);
    return applicationNo;
  }, []);

  const rsvpEvent = useCallback((id: string) => {
    setEvents(prev =>
      prev.map(evt => (evt.id === id ? { ...evt, rsvpCount: evt.rsvpCount + 1 } : evt))
    );
  }, []);

  const submitHomework = useCallback((homeworkId: string) => {
    setAllHomework(prev => ({
      ...prev,
      [activeStudentId]: (prev[activeStudentId] || []).map(hw =>
        hw.id === homeworkId ? { ...hw, isSubmitted: true } : hw
      )
    }));
  }, [activeStudentId]);

  const submitLeaveRequest = useCallback((fromDate: string, toDate: string, reason: string) => {
    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      studentId: activeStudentId,
      fromDate,
      toDate,
      reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
  }, [activeStudentId]);

  const payFeeInvoice = useCallback((invoiceId: string, amount: number) => {
    setAllFees(prev => ({
      ...prev,
      [activeStudentId]: (prev[activeStudentId] || []).map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amount;
          return {
            ...inv,
            paidAmount: newPaid,
            status: newPaid >= inv.amount ? 'Paid' : 'Pending',
            payments: [
              ...inv.payments,
              {
                id: `p-${Date.now()}`,
                amount,
                date: new Date().toISOString().split('T')[0],
                method: 'Online UPI (Verified)',
                receiptNo: `REC-${Date.now().toString().slice(-6)}`
              }
            ]
          };
        }
        return inv;
      })
    }));
  }, [activeStudentId]);

  const sendMessage = useCallback((content: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Mr. Vikram Sharma',
      senderRole: 'Parent',
      content,
      timestamp: 'Just now',
      isFromMe: true
    };
    setMessages(prev => [...prev, newMsg]);
  }, []);

  // Admin Customization Operations
  const updateConfig = useCallback((newConfig: Partial<SchoolConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);

  const addNotice = useCallback((noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);
  }, []);

  const deleteNotice = useCallback((id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  }, []);

  const addEvent = useCallback((eventData: Omit<SchoolEvent, 'id' | 'rsvpCount'>) => {
    const newEvent: SchoolEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      rsvpCount: 0
    };
    setEvents(prev => [newEvent, ...prev]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const addStudent = useCallback((studentData: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      attendanceRate: 100,
      gpa: 10.0,
      feeStatus: 'Paid'
    };
    setStudents(prev => [...prev, newStudent]);
  }, []);

  const updateStudent = useCallback((id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  }, []);

  return (
    <SchoolDataContext.Provider
      value={{
        config,
        notices,
        events,
        gallery,
        facilities,
        isLoading,
        error,
        refreshData,
        submitAdmission,
        rsvpEvent,
        students,
        activeStudentId,
        setActiveStudentId,
        activeStudent,
        homework,
        timetable,
        attendance,
        examResults,
        fees,
        leaveRequests,
        messages,
        submitHomework,
        submitLeaveRequest,
        payFeeInvoice,
        sendMessage,
        updateConfig,
        addNotice,
        deleteNotice,
        addEvent,
        deleteEvent,
        addStudent,
        updateStudent
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
