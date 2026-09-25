import { Router, Request, Response } from 'express';
import { authenticate, requireRoles } from '../middleware/authMiddleware';
import { StudentService } from '../services/studentService';
import { AttendanceService } from '../services/attendanceService';
import { TimetableService } from '../services/timetableService';
import { HomeworkService } from '../services/homeworkService';
import { ExamService } from '../services/examService';
import { FeeService } from '../services/feeService';
import { NoticeService } from '../services/noticeService';
import { MessagingService } from '../services/messagingService';
import { AdmissionService } from '../services/admissionService';
import { ReportService } from '../services/reportService';
import { AuditService } from '../services/auditService';
import { db } from '../database';

export const apiRouter = Router();

// Apply authentication to all /api endpoints below
apiRouter.use(authenticate);

// ==========================================
// 1. STUDENTS MODULE
// ==========================================
apiRouter.get('/students', (req: Request, res: Response) => {
  const { grade, section, search } = req.query as { grade?: string; section?: string; search?: string };
  const students = StudentService.getAll({ grade, section, search });
  res.json({ success: true, students });
});

apiRouter.get('/students/:id', (req: Request, res: Response) => {
  try {
    const student = StudentService.getById(req.params.id);
    res.json({ success: true, student });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

apiRouter.post('/students', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req: Request, res: Response) => {
  try {
    const student = StudentService.create(req.body);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'STUDENT_CREATED', 'STUDENTS', `Created student ${student.name} (${student.admissionNo})`, student.id);
    res.status(201).json({ success: true, student });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. TEACHERS MODULE
// ==========================================
apiRouter.get('/teachers', (req: Request, res: Response) => {
  res.json({ success: true, teachers: db.teachers });
});

// ==========================================
// 3. ATTENDANCE MODULE
// ==========================================
apiRouter.get('/attendance', (req: Request, res: Response) => {
  const { grade, section, date, studentId } = req.query as { grade?: string; section?: string; date?: string; studentId?: string };

  if (studentId) {
    const records = AttendanceService.getForStudent(studentId);
    res.json({ success: true, records });
    return;
  }

  if (grade && section && date) {
    const records = AttendanceService.getForClass(grade, section, date);
    res.json({ success: true, records });
    return;
  }

  res.json({ success: true, records: db.attendance });
});

apiRouter.post('/attendance', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  try {
    const { grade, section, date, records } = req.body;
    if (!grade || !section || !date || !Array.isArray(records)) {
      res.status(400).json({ success: false, error: 'Missing grade, section, date, or records array' });
      return;
    }

    const updated = AttendanceService.markClassAttendance(grade, section, date, records, req.user!.name);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'ATTENDANCE_RECORDED', 'ATTENDANCE', `Marked attendance for ${grade}-${section} on ${date} (${records.length} scholars)`);
    res.json({ success: true, count: updated.length, records: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. TIMETABLE MODULE (With Conflict Detection)
// ==========================================
apiRouter.get('/timetable', (req: Request, res: Response) => {
  const { grade, section, teacherId } = req.query as { grade?: string; section?: string; teacherId?: string };

  if (grade && section) {
    res.json({ success: true, slots: TimetableService.getForClass(grade, section) });
    return;
  }
  if (teacherId) {
    res.json({ success: true, slots: TimetableService.getForTeacher(teacherId) });
    return;
  }

  res.json({ success: true, slots: db.timetable });
});

apiRouter.post('/timetable', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req: Request, res: Response) => {
  try {
    const newSlot = TimetableService.createSlot(req.body);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'TIMETABLE_SLOT_CREATED', 'TIMETABLE', `Scheduled ${newSlot.subject} for ${newSlot.grade}-${newSlot.section} (Period ${newSlot.periodNumber}, ${newSlot.dayOfWeek})`, newSlot.id);
    res.status(201).json({ success: true, slot: newSlot });
  } catch (err: any) {
    res.status(409).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/timetable/:id', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req: Request, res: Response) => {
  try {
    TimetableService.deleteSlot(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. HOMEWORK & ASSIGNMENTS
// ==========================================
apiRouter.get('/homework', (req: Request, res: Response) => {
  const { grade, section } = req.query as { grade?: string; section?: string };
  if (grade && section) {
    res.json({ success: true, homework: HomeworkService.getForClass(grade, section) });
    return;
  }
  res.json({ success: true, homework: db.homework });
});

apiRouter.post('/homework', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  try {
    const hw = HomeworkService.create({
      ...req.body,
      teacherId: req.user!.id,
      teacherName: req.user!.name
    });
    res.status(201).json({ success: true, homework: hw });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.post('/homework/:id/submit', requireRoles('STUDENT', 'PARENT'), (req: Request, res: Response) => {
  try {
    const { studentId, submissionUrl, notes } = req.body;
    const submission = HomeworkService.submitHomework(req.params.id, studentId, submissionUrl, notes);
    res.json({ success: true, submission });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. EXAMS & RESULTS (With Bounds Validation)
// ==========================================
apiRouter.get('/exams', (req: Request, res: Response) => {
  res.json({ success: true, exams: ExamService.getAllExams() });
});

apiRouter.get('/results', (req: Request, res: Response) => {
  const { studentId, examId } = req.query as { studentId?: string; examId?: string };
  if (studentId) {
    res.json({ success: true, results: ExamService.getResultsForStudent(studentId) });
    return;
  }
  if (examId) {
    res.json({ success: true, results: ExamService.getResultsForExam(examId) });
    return;
  }
  res.json({ success: true, results: db.results });
});

apiRouter.post('/exams/:id/marks', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  try {
    const { studentId, subjects, teacherRemarks } = req.body;
    const result = ExamService.enterStudentMarks(req.params.id, studentId, subjects, teacherRemarks);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'MARKS_ENTERED', 'EXAMS', `Recorded marks for student ${studentId} in exam ${req.params.id}`);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.post('/exams/:id/publish', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req: Request, res: Response) => {
  try {
    const pub = ExamService.publishResults(req.params.id);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'RESULTS_PUBLISHED', 'EXAMS', `Published exam results for exam ${req.params.id} (${pub.count} report cards)`);
    res.json(pub);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 7. FEES & TREASURY
// ==========================================
apiRouter.get('/fees/invoices', (req: Request, res: Response) => {
  const { studentId, grade, status } = req.query as { studentId?: string; grade?: string; status?: any };
  if (studentId) {
    res.json({ success: true, invoices: FeeService.getInvoicesForStudent(studentId) });
    return;
  }
  res.json({ success: true, invoices: FeeService.getAllInvoices({ grade, status }) });
});

apiRouter.get('/fees/summary', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'), (_req: Request, res: Response) => {
  res.json({ success: true, summary: FeeService.getSummary() });
});

apiRouter.post('/fees/invoices/:id/pay', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'PARENT'), (req: Request, res: Response) => {
  try {
    const { amount, method, transactionId } = req.body;
    const paymentResult = FeeService.recordPayment(req.params.id, amount, method, transactionId);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'FEE_PAYMENT_RECORDED', 'FEES', `Recorded payment of ₹${amount} for invoice ${req.params.id} via ${method}`);
    res.json(paymentResult);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. NOTICES & CIRCULARS
// ==========================================
apiRouter.get('/notices', (req: Request, res: Response) => {
  const { audience, grade } = req.query as { audience?: string; grade?: string };
  res.json({ success: true, notices: NoticeService.getAll(audience, grade) });
});

apiRouter.post('/notices', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  try {
    const notice = NoticeService.create(req.body);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'NOTICE_PUBLISHED', 'NOTICES', `Published circular: ${notice.title}`, notice.id);
    res.status(201).json({ success: true, notice });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 9. ADMISSIONS BUREAU
// ==========================================
apiRouter.get('/admissions', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req: Request, res: Response) => {
  const { status } = req.query as { status?: any };
  res.json({ success: true, admissions: AdmissionService.getAll(status) });
});

apiRouter.post('/admissions/apply', (req: Request, res: Response) => {
  try {
    const application = AdmissionService.submit(req.body);
    res.status(201).json({ success: true, application });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.post('/admissions/:id/enroll', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (req: Request, res: Response) => {
  try {
    const { rollNo, section } = req.body;
    const student = AdmissionService.convertToStudent(req.params.id, rollNo, section);
    AuditService.log(req.user!.id, req.user!.name, req.user!.role, 'ADMISSION_ENROLLED', 'ADMISSIONS', `Converted applicant into student ${student.name} (${student.admissionNo})`, student.id);
    res.json({ success: true, student });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 10. MESSAGES & COMMUNICATIONS
// ==========================================
apiRouter.get('/messages/:conversationId', (req: Request, res: Response) => {
  res.json({ success: true, messages: MessagingService.getMessages(req.params.conversationId) });
});

apiRouter.get('/conversations', (req: Request, res: Response) => {
  res.json({ success: true, conversations: MessagingService.getConversationsForUser(req.user!.id) });
});

apiRouter.post('/messages', (req: Request, res: Response) => {
  try {
    const msg = MessagingService.sendMessage({
      ...req.body,
      senderId: req.user!.id,
      senderName: req.user!.name,
      senderRole: req.user!.role
    });
    res.status(201).json({ success: true, message: msg });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 11. REPORTS MODULE
// ==========================================
apiRouter.get('/reports/attendance', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  const { grade } = req.query as { grade?: string };
  res.json({ success: true, report: ReportService.getAttendanceSummaryReport(grade) });
});

apiRouter.get('/reports/fees', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'), (_req: Request, res: Response) => {
  res.json({ success: true, report: ReportService.getFeeCollectionReport() });
});

apiRouter.get('/reports/students', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  const { grade, section } = req.query as { grade?: string; section?: string };
  res.json({ success: true, report: ReportService.getStudentRoster(grade, section) });
});

// ==========================================
// 12. AUDIT LOGS
// ==========================================
apiRouter.get('/audit-logs', requireRoles('SUPER_ADMIN', 'SCHOOL_ADMIN'), (_req: Request, res: Response) => {
  res.json({ success: true, logs: AuditService.getAll() });
});
