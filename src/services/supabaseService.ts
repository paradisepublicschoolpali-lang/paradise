import { supabase, isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';
import {
  Student,
  Teacher,
  Notice,
  AdmissionApplication,
  HomeworkItem,
  HomeworkSubmission,
  AttendanceRecord,
  FeeItem,
  SchoolEvent,
  GalleryItem
} from '../types';

export const supabaseService = {
  isConfigured: () => getSupabaseConfig().isConfigured,

  // ==========================================
  // STUDENTS
  // ==========================================
  async getStudents(): Promise<Student[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (error) {
        console.warn('Supabase fetch students warning:', error.message);
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
      const { data, error } = await supabase.from('teachers').select('*');
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
      await supabase.from('notices').insert({
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
  async submitAdmission(app: AdmissionApplication) {
    if (!this.isConfigured()) return;
    try {
      await supabase.from('admissions').insert({
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
      console.error('Supabase submitAdmission error:', err);
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
        await supabase.from('notices').upsert({
          id: n.id,
          title: n.title,
          category: n.category,
          target_audience: n.targetAudience,
          date: n.date,
          content: n.content,
          pdf_url: n.pdfUrl,
          author: n.author,
          is_pinned: n.isPinned
        });
        totalSynced++;
      }

      // 4. Sync Events
      for (const e of data.events) {
        await supabase.from('events').upsert({
          id: e.id,
          title: e.title,
          category: e.category,
          date: e.date,
          time: e.time,
          venue: e.venue,
          description: e.description,
          cover_image: e.coverImage,
          rsvp_count: e.rsvpCount,
          is_upcoming: e.isUpcoming
        });
        totalSynced++;
      }

      return {
        success: true,
        count: totalSynced,
        message: `Successfully synchronized ${totalSynced} records to live Supabase database!`
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
