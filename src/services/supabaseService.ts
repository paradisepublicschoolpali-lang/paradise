import { supabase, isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';
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

export const supabaseService = {
  isConfigured: () => getSupabaseConfig().isConfigured,

  // ==========================================
  // STUDENTS
  // ==========================================
  async getStudents(): Promise<Student[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('students').select('*').order('name');
      if (error) {
        console.warn('Supabase getStudents:', error.message);
        return null;
      }
      return data?.map(s => ({
        id: s.id,
        loginId: s.login_id,
        password: s.password,
        admissionNo: s.admission_no,
        rollNo: s.roll_no,
        name: s.name,
        grade: s.grade,
        section: s.section,
        house: s.house,
        dob: s.dob,
        gender: s.gender,
        bloodGroup: s.blood_group,
        guardianName: s.guardian_name,
        guardianPhone: s.guardian_phone,
        guardianEmail: s.guardian_email,
        address: s.address,
        busRoute: s.bus_route,
        busNumber: s.bus_number,
        lockerNumber: s.locker_number,
        avatar: s.avatar,
        attendanceRate: Number(s.attendance_rate || 96),
        gpa: Number(s.gpa || 3.9),
        feeStatus: s.fee_status
      })) as Student[];
    } catch {
      return null;
    }
  },

  async upsertStudent(student: Student) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('students').upsert({
        id: student.id,
        login_id: student.loginId,
        password: student.password || 'password123',
        admission_no: student.admissionNo,
        roll_no: student.rollNo,
        name: student.name,
        grade: student.grade,
        section: student.section,
        house: student.house,
        dob: student.dob,
        gender: student.gender,
        blood_group: student.bloodGroup,
        guardian_name: student.guardianName,
        guardian_phone: student.guardianPhone,
        guardian_email: student.guardianEmail,
        address: student.address,
        bus_route: student.busRoute,
        bus_number: student.busNumber,
        locker_number: student.lockerNumber,
        avatar: student.avatar,
        attendance_rate: student.attendanceRate,
        gpa: student.gpa,
        fee_status: student.feeStatus
      });
    } catch (err) {
      console.error('Supabase upsertStudent error:', err);
    }
  },

  async deleteStudent(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteStudent error:', err);
    }
  },

  // ==========================================
  // TEACHERS
  // ==========================================
  async getTeachers(): Promise<Teacher[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('teachers').select('*').order('name');
      if (error) return null;
      return data?.map(t => ({
        id: t.id,
        loginId: t.login_id,
        password: t.password,
        employeeId: t.employee_id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        designation: t.designation,
        department: t.department,
        qualification: t.qualification,
        experienceYears: Number(t.experience_years || 5),
        assignedClasses: t.assigned_classes || [],
        avatar: t.avatar,
        joiningDate: t.joining_date
      })) as Teacher[];
    } catch {
      return null;
    }
  },

  async upsertTeacher(teacher: Teacher) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('teachers').upsert({
        id: teacher.id,
        login_id: teacher.loginId,
        password: teacher.password || 'teacher123',
        employee_id: teacher.employeeId,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        designation: teacher.designation,
        department: teacher.department,
        qualification: teacher.qualification,
        experience_years: teacher.experienceYears,
        assigned_classes: teacher.assignedClasses,
        avatar: teacher.avatar,
        joining_date: teacher.joiningDate
      });
    } catch (err) {
      console.error('Supabase upsertTeacher error:', err);
    }
  },

  async deleteTeacher(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('teachers').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteTeacher error:', err);
    }
  },

  // ==========================================
  // NOTICES
  // ==========================================
  async getNotices(): Promise<Notice[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('notices').select('*').order('date', { ascending: false });
      if (error) return null;
      return data?.map(n => ({
        id: n.id,
        title: n.title,
        category: n.category,
        targetAudience: n.target_audience,
        date: n.date,
        content: n.content,
        pdfUrl: n.pdf_url,
        author: n.author,
        isPinned: n.is_pinned
      })) as Notice[];
    } catch {
      return null;
    }
  },

  async createNotice(notice: Notice) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('notices').upsert({
        id: notice.id,
        title: notice.title,
        category: notice.category,
        target_audience: notice.targetAudience,
        date: notice.date,
        content: notice.content,
        pdf_url: notice.pdfUrl,
        author: notice.author,
        is_pinned: notice.isPinned
      });
    } catch (err) {
      console.error('Supabase createNotice error:', err);
    }
  },

  async deleteNotice(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('notices').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteNotice error:', err);
    }
  },

  // ==========================================
  // ADMISSIONS
  // ==========================================
  async getAdmissions(): Promise<AdmissionApplication[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('admissions').select('*').order('submission_date', { ascending: false });
      if (error) return null;
      return data?.map(a => ({
        id: a.id,
        applicationNo: a.application_no,
        applicantName: a.applicant_name,
        gradeApplying: a.grade_applying,
        dob: a.dob,
        gender: a.gender,
        parentName: a.parent_name,
        parentEmail: a.parent_email,
        parentPhone: a.parent_phone,
        address: a.address,
        previousSchool: a.previous_school,
        submissionDate: a.submission_date,
        status: a.status,
        notes: a.notes,
        testScore: a.test_score
      })) as AdmissionApplication[];
    } catch {
      return null;
    }
  },

  async upsertAdmission(app: AdmissionApplication) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('admissions').upsert({
        id: app.id,
        application_no: app.applicationNo,
        applicant_name: app.applicantName,
        grade_applying: app.gradeApplying,
        dob: app.dob,
        gender: app.gender,
        parent_name: app.parentName,
        parent_email: app.parentEmail,
        parent_phone: app.parentPhone,
        address: app.address,
        previous_school: app.previousSchool,
        submission_date: app.submissionDate,
        status: app.status,
        notes: app.notes,
        test_score: app.testScore
      });
    } catch (err) {
      console.error('Supabase upsertAdmission error:', err);
    }
  },

  async deleteAdmission(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('admissions').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteAdmission error:', err);
    }
  },

  // ==========================================
  // HOMEWORK & SUBMISSIONS
  // ==========================================
  async getHomework(): Promise<HomeworkItem[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('homework').select('*').order('assigned_date', { ascending: false });
      if (error) return null;
      return data?.map(h => ({
        id: h.id,
        title: h.title,
        subject: h.subject,
        grade: h.grade,
        section: h.section,
        teacherName: h.teacher_name,
        assignedDate: h.assigned_date,
        dueDate: h.due_date,
        description: h.description,
        maxPoints: Number(h.max_points || 50),
        status: h.status
      })) as HomeworkItem[];
    } catch {
      return null;
    }
  },

  async upsertHomework(hw: HomeworkItem) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('homework').upsert({
        id: hw.id,
        title: hw.title,
        subject: hw.subject,
        grade: hw.grade,
        section: hw.section,
        teacher_name: hw.teacherName,
        assigned_date: hw.assignedDate,
        due_date: hw.dueDate,
        description: hw.description,
        max_points: hw.maxPoints,
        status: hw.status
      });
    } catch (err) {
      console.error('Supabase upsertHomework error:', err);
    }
  },

  async deleteHomework(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('homework').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteHomework error:', err);
    }
  },

  async getSubmissions(): Promise<HomeworkSubmission[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('homework_submissions').select('*').order('submission_date', { ascending: false });
      if (error) return null;
      return data?.map(s => ({
        id: s.id,
        homeworkId: s.homework_id,
        studentId: s.student_id,
        studentName: s.student_name,
        submissionDate: s.submission_date,
        status: s.status,
        score: s.score !== null ? Number(s.score) : undefined,
        feedback: s.feedback,
        fileName: s.file_name,
        fileUrl: s.file_url
      })) as HomeworkSubmission[];
    } catch {
      return null;
    }
  },

  async upsertSubmission(sub: HomeworkSubmission) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('homework_submissions').upsert({
        id: sub.id,
        homework_id: sub.homeworkId,
        student_id: sub.studentId,
        student_name: sub.studentName,
        submission_date: sub.submissionDate,
        status: sub.status,
        score: sub.score,
        feedback: sub.feedback,
        file_name: sub.fileName,
        file_url: sub.fileUrl
      });
    } catch (err) {
      console.error('Supabase upsertSubmission error:', err);
    }
  },

  // ==========================================
  // ATTENDANCE & LEAVES
  // ==========================================
  async getAttendance(): Promise<AttendanceRecord[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('attendance').select('*').order('date', { ascending: false });
      if (error) return null;
      return data?.map(a => ({
        id: a.id,
        studentId: a.student_id,
        studentName: a.student_name,
        grade: a.grade,
        section: a.section,
        date: a.date,
        status: a.status,
        remarks: a.remarks
      })) as AttendanceRecord[];
    } catch {
      return null;
    }
  },

  async upsertAttendanceBulk(records: AttendanceRecord[]) {
    if (!this.isConfigured() || records.length === 0) return;
    try {
      const payload = records.map(r => ({
        id: r.id,
        student_id: r.studentId,
        student_name: r.studentName,
        grade: r.grade,
        section: r.section,
        date: r.date,
        status: r.status,
        remarks: r.remarks || null
      }));
      await supabase.from('attendance').upsert(payload);
    } catch (err) {
      console.error('Supabase upsertAttendanceBulk error:', err);
    }
  },

  async getLeaves(): Promise<LeaveApplication[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('leaves').select('*').order('applied_date', { ascending: false });
      if (error) return null;
      return data?.map(l => ({
        id: l.id,
        studentId: l.student_id,
        studentName: l.student_name,
        grade: l.grade,
        fromDate: l.from_date,
        toDate: l.to_date,
        reason: l.reason,
        status: l.status,
        appliedDate: l.applied_date
      })) as LeaveApplication[];
    } catch {
      return null;
    }
  },

  async upsertLeave(leave: LeaveApplication) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('leaves').upsert({
        id: leave.id,
        student_id: leave.studentId,
        student_name: leave.studentName,
        grade: leave.grade,
        from_date: leave.fromDate,
        to_date: leave.toDate,
        reason: leave.reason,
        status: leave.status,
        applied_date: leave.appliedDate
      });
    } catch (err) {
      console.error('Supabase upsertLeave error:', err);
    }
  },

  // ==========================================
  // EXAM RESULTS
  // ==========================================
  async getExamResults(): Promise<ExamResult[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('exam_results').select('*');
      if (error) return null;
      return data?.map(r => ({
        id: r.id,
        studentId: r.student_id,
        studentName: r.student_name,
        grade: r.grade,
        section: r.section,
        examName: r.exam_name,
        academicYear: r.academic_year,
        subjects: r.subjects || [],
        totalMarks: Number(r.total_marks),
        maxTotal: Number(r.max_total),
        percentage: Number(r.percentage),
        gpa: Number(r.gpa),
        rank: Number(r.rank || 1),
        overallGrade: r.overall_grade,
        teacherRemarks: r.teacher_remarks
      })) as ExamResult[];
    } catch {
      return null;
    }
  },

  async upsertExamResult(result: ExamResult) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('exam_results').upsert({
        id: result.id,
        student_id: result.studentId,
        student_name: result.studentName,
        grade: result.grade,
        section: result.section,
        exam_name: result.examName,
        academic_year: result.academicYear,
        subjects: result.subjects,
        total_marks: result.totalMarks,
        max_total: result.maxTotal,
        percentage: result.percentage,
        gpa: result.gpa,
        rank: result.rank,
        overall_grade: result.overallGrade,
        teacher_remarks: result.teacherRemarks
      });
    } catch (err) {
      console.error('Supabase upsertExamResult error:', err);
    }
  },

  async deleteExamResult(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('exam_results').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteExamResult error:', err);
    }
  },

  // ==========================================
  // FEES
  // ==========================================
  async getFees(): Promise<FeeItem[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('fees').select('*');
      if (error) return null;
      return data?.map(f => ({
        id: f.id,
        invoiceNo: f.invoice_no,
        studentId: f.student_id,
        studentName: f.student_name,
        grade: f.grade,
        term: f.term,
        dueDate: f.due_date,
        breakdown: f.breakdown,
        totalAmount: Number(f.total_amount),
        paidAmount: Number(f.paid_amount || 0),
        status: f.status,
        paymentDate: f.payment_date,
        paymentMethod: f.payment_method,
        transactionId: f.transaction_id
      })) as FeeItem[];
    } catch {
      return null;
    }
  },

  async upsertFee(fee: FeeItem) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('fees').upsert({
        id: fee.id,
        invoice_no: fee.invoiceNo,
        student_id: fee.studentId,
        student_name: fee.studentName,
        grade: fee.grade,
        term: fee.term,
        due_date: fee.dueDate,
        breakdown: fee.breakdown,
        total_amount: fee.totalAmount,
        paid_amount: fee.paidAmount,
        status: fee.status,
        payment_date: fee.paymentDate,
        payment_method: fee.paymentMethod,
        transaction_id: fee.transactionId
      });
    } catch (err) {
      console.error('Supabase upsertFee error:', err);
    }
  },

  async deleteFee(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('fees').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteFee error:', err);
    }
  },

  // ==========================================
  // EVENTS & GALLERY
  // ==========================================
  async getEvents(): Promise<SchoolEvent[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
      if (error) return null;
      return data?.map(e => ({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date,
        time: e.time,
        venue: e.venue,
        description: e.description,
        coverImage: e.cover_image,
        rsvpCount: Number(e.rsvp_count || 0),
        isUpcoming: e.is_upcoming
      })) as SchoolEvent[];
    } catch {
      return null;
    }
  },

  async upsertEvent(evt: SchoolEvent) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('events').upsert({
        id: evt.id,
        title: evt.title,
        category: evt.category,
        date: evt.date,
        time: evt.time,
        venue: evt.venue,
        description: evt.description,
        cover_image: evt.coverImage,
        rsvp_count: evt.rsvpCount,
        is_upcoming: evt.isUpcoming
      });
    } catch (err) {
      console.error('Supabase upsertEvent error:', err);
    }
  },

  async deleteEvent(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('events').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteEvent error:', err);
    }
  },

  async getGallery(): Promise<GalleryItem[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('date', { ascending: false });
      if (error) return null;
      return data?.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category,
        imageUrl: g.image_url,
        description: g.description,
        date: g.date
      })) as GalleryItem[];
    } catch {
      return null;
    }
  },

  async upsertGalleryItem(item: GalleryItem) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('gallery').upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        image_url: item.imageUrl,
        description: item.description,
        date: item.date
      });
    } catch (err) {
      console.error('Supabase upsertGalleryItem error:', err);
    }
  },

  async deleteGalleryItem(id: string) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteGalleryItem error:', err);
    }
  },

  // ==========================================
  // SEED & SYNC ALL LOCAL DATA TO SUPABASE
  // ==========================================
  async syncLocalDataToSupabase(data: {
    students: Student[];
    teachers: Teacher[];
    notices: Notice[];
    admissions: AdmissionApplication[];
    events: SchoolEvent[];
    gallery: GalleryItem[];
    homework?: HomeworkItem[];
    submissions?: HomeworkSubmission[];
    attendance?: AttendanceRecord[];
    leaves?: LeaveApplication[];
    results?: ExamResult[];
    fees?: FeeItem[];
  }): Promise<{ success: boolean; count: number; message: string }> {
    if (!this.isConfigured()) {
      return { success: false, count: 0, message: 'Supabase is not configured yet.' };
    }

    try {
      let totalSynced = 0;

      // 1. Sync Students
      for (const s of data.students) {
        await this.upsertStudent(s);
        totalSynced++;
      }

      // 2. Sync Teachers
      for (const t of data.teachers) {
        await this.upsertTeacher(t);
        totalSynced++;
      }

      // 3. Sync Notices
      for (const n of data.notices) {
        await this.createNotice(n);
        totalSynced++;
      }

      // 4. Sync Admissions
      for (const a of data.admissions) {
        await this.upsertAdmission(a);
        totalSynced++;
      }

      // 5. Sync Events
      for (const e of data.events) {
        await this.upsertEvent(e);
        totalSynced++;
      }

      // 6. Sync Gallery
      for (const g of data.gallery) {
        await this.upsertGalleryItem(g);
        totalSynced++;
      }

      // 7. Sync Homework & Submissions
      if (data.homework) {
        for (const h of data.homework) {
          await this.upsertHomework(h);
          totalSynced++;
        }
      }
      if (data.submissions) {
        for (const sub of data.submissions) {
          await this.upsertSubmission(sub);
          totalSynced++;
        }
      }

      // 8. Sync Attendance & Leaves
      if (data.attendance && data.attendance.length > 0) {
        await this.upsertAttendanceBulk(data.attendance);
        totalSynced += data.attendance.length;
      }
      if (data.leaves) {
        for (const l of data.leaves) {
          await this.upsertLeave(l);
          totalSynced++;
        }
      }

      // 9. Sync Results & Fees
      if (data.results) {
        for (const r of data.results) {
          await this.upsertExamResult(r);
          totalSynced++;
        }
      }
      if (data.fees) {
        for (const f of data.fees) {
          await this.upsertFee(f);
          totalSynced++;
        }
      }

      return {
        success: true,
        count: totalSynced,
        message: `Successfully synchronized ${totalSynced} records to live Supabase cloud database!`
      };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        message: `Sync partially failed: ${err?.message || 'Check database schema & RLS policies'}`
      };
    }
  }
};
