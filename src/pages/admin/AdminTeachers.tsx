import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Teacher, TeacherPeriod, Student } from '../../types';
import {
  UserCheck,
  Plus,
  Trash2,
  Edit3,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  Calendar,
  CalendarDays,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  X,
  Send,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';
import { formatCurrency } from '../../utils/helpers';
import { emailService } from '../../services/emailService';

export const AdminTeachers: React.FC = () => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    teacherPeriods,
    addTeacherPeriod,
    updateTeacherPeriod,
    deleteTeacherPeriod,
    subjects: curriculumSubjects,
    students,
    addStudent,
    updateStudent,
    deleteStudent
  } = useSchoolData();
  const { toast } = useToast();

  const [selectedDept, setSelectedDept] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [managingPeriodsTeacher, setManagingPeriodsTeacher] = useState<Teacher | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Class Students Management State for each Teacher
  const [managingStudentsTeacher, setManagingStudentsTeacher] = useState<Teacher | null>(null);
  const [selectedTeacherClass, setSelectedTeacherClass] = useState<string>('');
  const [classStudentSearch, setClassStudentSearch] = useState<string>('');
  const [isEnrollStudentOpen, setIsEnrollStudentOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddAllocationOpen, setIsAddAllocationOpen] = useState<boolean>(false);
  const [newAllocationForm, setNewAllocationForm] = useState({
    grade: 'Class 8',
    section: 'A',
    subject: 'Science'
  });

  // New Student Form for Teacher's Class
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    loginId: '',
    password: 'password123',
    grade: 'Class 8',
    section: 'A',
    rollNo: '',
    admissionNo: '',
    house: 'Ashoka House' as Student['house'],
    dob: '2013-05-15',
    gender: 'Male' as Student['gender'],
    bloodGroup: 'B+',
    guardianName: '',
    guardianPhone: '+91 ',
    guardianEmail: '',
    address: 'Pali, Rajasthan - 306401',
    busRoute: 'Route 1 - Sumerpur Road & Housing Board',
    busNumber: 'RJ-22-PA-0101',
    lockerNumber: '',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    feeStatus: 'Paid' as Student['feeStatus'],
    gpa: 9.5
  });

  // Admin Period Form State for Teacher
  const [periodForm, setPeriodForm] = useState({
    periodNumber: '01',
    startTime: '08:30 AM',
    endTime: '09:20 AM',
    grade: 'Class 8',
    section: 'A',
    subject: 'General & Physical Science',
    room: 'Science Lab 1',
    topic: '',
    scheduleType: 'permanent' as 'permanent' | 'day_only',
    dayOfWeek: 'All Days' as TeacherPeriod['dayOfWeek'],
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    loginId: '',
    password: 'teacher123',
    employeeId: `PPS-FAC-${Math.floor(100 + Math.random() * 900)}`,
    email: '',
    phone: '',
    designation: 'Teacher',
    department: 'Hindi',
    qualification: '',
    experienceYears: 0,
    assignedClasses: [
      { grade: 'Grade 10', section: 'A', subject: 'Hindi' }
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const teacherSubjects = ['All', 'Hindi', 'English', 'Maths', 'Science', 'Social Science', 'Computer', 'G.K', 'Arts'];
  const subjectList = ['Hindi', 'English', 'Maths', 'Science', 'Social Science', 'Computer', 'G.K', 'Arts'];

  const filteredTeachers = teachers.filter(t => {
    return selectedDept === 'All' || t.department.toLowerCase() === selectedDept.toLowerCase();
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast('Please complete all educator details', '', 'error');
      return;
    }

    const assignedLoginId = formData.loginId || formData.name.toLowerCase().split(' ')[0] + '.' + formData.department.toLowerCase().split(' ')[0];

    addTeacher({
      ...formData,
      designation: 'Teacher',
      qualification: '',
      experienceYears: 0,
      loginId: assignedLoginId,
      password: formData.password || 'teacher123'
    });

    toast('Faculty Appointed & ID Generated!', `Teacher ID: ${assignedLoginId} | Password: ${formData.password || 'teacher123'}`, 'success');
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      loginId: '',
      password: 'teacher123',
      employeeId: `PPS-FAC-${Math.floor(100 + Math.random() * 900)}`,
      email: '',
      phone: '',
      designation: 'Teacher',
      department: 'Hindi',
      qualification: '',
      experienceYears: 0,
      assignedClasses: [
        { grade: 'Grade 10', section: 'A', subject: 'Hindi' }
      ],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      joiningDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    updateTeacher(editingTeacher.id, editingTeacher);
    toast('Faculty Record Updated', `Saved profile & credentials for ${editingTeacher.name}`, 'success');
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from faculty staff?`)) {
      deleteTeacher(id);
      toast('Staff Record Removed', `${name} has been archived`, 'info');
    }
  };

  // Indian CBSE School standards
  const gradeOptions = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'];
  const sectionOptions = ['A', 'B', 'C'];
  const houseOptions = ['Ashoka House', 'Tagore House', 'Shivaji House', 'Raman House'];

  // Helper to normalize grade names: "Class 8", "Grade 8", "8" all match
  const normalizeGrade = (g?: string) => (g || '').replace(/^(Class|Grade)\s+/i, '').trim().toLowerCase();

  // Get all students enrolled in a teacher's allocated classes (or a specific class key)
  const getTeacherStudents = (teacher: Teacher, classKey?: string) => {
    if (!teacher.assignedClasses || teacher.assignedClasses.length === 0) return [];

    return students.filter(student => {
      return teacher.assignedClasses.some(ac => {
        const matchGrade = normalizeGrade(student.grade) === normalizeGrade(ac.grade);
        const matchSection = (student.section || '').trim().toLowerCase() === (ac.section || '').trim().toLowerCase();
        if (!matchGrade || !matchSection) return false;

        if (classKey) {
          const parts = classKey.split('-');
          const targetGrade = normalizeGrade(parts[0]);
          const targetSection = (parts[1] || '').trim().toLowerCase();
          const matchTargetGrade = normalizeGrade(student.grade) === targetGrade;
          const matchTargetSection = !targetSection || (student.section || '').trim().toLowerCase() === targetSection;
          return matchTargetGrade && matchTargetSection;
        }
        return true;
      });
    });
  };

  const openClassStudentsModal = (teacher: Teacher) => {
    setManagingStudentsTeacher(teacher);
    if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
      setSelectedTeacherClass(`${teacher.assignedClasses[0].grade}-${teacher.assignedClasses[0].section}`);
    } else {
      setSelectedTeacherClass('Class 8-A');
    }
    setClassStudentSearch('');
    setIsAddAllocationOpen(false);
    setIsEnrollStudentOpen(false);
  };

  const handleOpenEnrollModal = () => {
    const parts = selectedTeacherClass.split('-');
    const currentGrade = parts[0]?.trim() || 'Class 8';
    const currentSection = parts[1]?.trim() || 'A';
    const gradeNum = currentGrade.replace(/\D/g, '') || '08';
    const randRoll = Math.floor(10 + Math.random() * 89);

    setNewStudentForm({
      name: '',
      loginId: '',
      password: 'password123',
      grade: currentGrade,
      section: currentSection,
      rollNo: `${gradeNum.padStart(2, '0')}${currentSection}-${randRoll}`,
      admissionNo: `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      house: 'Ashoka House',
      dob: '2013-05-15',
      gender: 'Male',
      bloodGroup: 'B+',
      guardianName: '',
      guardianPhone: '+91 ',
      guardianEmail: '',
      address: 'Pali, Rajasthan - 306401',
      busRoute: 'Route 1 - Sumerpur Road & Housing Board',
      busNumber: 'RJ-22-PA-0101',
      lockerNumber: `LK-${gradeNum.padStart(2, '0')}${currentSection}-${randRoll}`,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      feeStatus: 'Paid',
      gpa: 9.5
    });
    setIsEnrollStudentOpen(true);
  };

  const handleCreateStudentForTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.guardianName || !newStudentForm.guardianPhone || !newStudentForm.guardianEmail) {
      toast('Please fill all required scholar & guardian details', '', 'error');
      return;
    }

    const assignedLoginId = newStudentForm.loginId ||
      newStudentForm.name.toLowerCase().split(' ')[0] + Math.floor(10 + Math.random() * 90);

    addStudent({
      ...newStudentForm,
      loginId: assignedLoginId
    });

    toast(
      'Scholar Enrolled in Class!',
      `Added ${newStudentForm.name} to ${newStudentForm.grade}-${newStudentForm.section} (ID: ${assignedLoginId})`,
      'success'
    );
    setIsEnrollStudentOpen(false);
  };

  const handleSaveEditedStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    toast('Scholar Record Updated', `Saved profile & academic details for ${editingStudent.name}`, 'success');
    setEditingStudent(null);
  };

  const handleDeleteStudentFromClass = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove scholar ${name} from this class?`)) {
      deleteStudent(id);
      toast('Scholar Removed', `${name} has been unenrolled from the class directory`, 'info');
    }
  };

  const handleAddClassAllocationToTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingStudentsTeacher) return;

    const exists = managingStudentsTeacher.assignedClasses.some(
      ac => normalizeGrade(ac.grade) === normalizeGrade(newAllocationForm.grade) &&
            ac.section.trim().toLowerCase() === newAllocationForm.section.trim().toLowerCase()
    );

    if (exists) {
      toast('Division Already Assigned', `This teacher is already allocated to ${newAllocationForm.grade}-${newAllocationForm.section}`, 'error');
      return;
    }

    const updatedClasses = [...managingStudentsTeacher.assignedClasses, { ...newAllocationForm }];
    updateTeacher(managingStudentsTeacher.id, { assignedClasses: updatedClasses });
    setManagingStudentsTeacher({ ...managingStudentsTeacher, assignedClasses: updatedClasses });
    setSelectedTeacherClass(`${newAllocationForm.grade}-${newAllocationForm.section}`);
    setIsAddAllocationOpen(false);
    toast('Class Allocation Assigned', `Allocated ${newAllocationForm.grade}-${newAllocationForm.section} (${newAllocationForm.subject}) to ${managingStudentsTeacher.name}`, 'success');
  };

  const handleRemoveClassAllocationFromTeacher = (grade: string, section: string) => {
    if (!managingStudentsTeacher) return;
    if (managingStudentsTeacher.assignedClasses.length <= 1) {
      toast('Minimum 1 Allocation Required', 'Each teacher must remain assigned to at least one class division', 'error');
      return;
    }

    if (window.confirm(`Remove teaching allocation ${grade}-${section} from ${managingStudentsTeacher.name}?`)) {
      const updatedClasses = managingStudentsTeacher.assignedClasses.filter(
        ac => !(normalizeGrade(ac.grade) === normalizeGrade(grade) && ac.section.trim().toLowerCase() === section.trim().toLowerCase())
      );
      updateTeacher(managingStudentsTeacher.id, { assignedClasses: updatedClasses });
      setManagingStudentsTeacher({ ...managingStudentsTeacher, assignedClasses: updatedClasses });
      if (selectedTeacherClass === `${grade}-${section}`) {
        setSelectedTeacherClass(`${updatedClasses[0]?.grade}-${updatedClasses[0]?.section}`);
      }
      toast('Allocation Removed', `Removed ${grade}-${section} from ${managingStudentsTeacher.name}`, 'info');
    }
  };

  const handleSendQuickStudentFeeNotice = async (student: Student) => {
    if (!student.guardianEmail) {
      toast('No Guardian Email', 'Scholar record does not have a guardian email on file', 'error');
      return;
    }

    if (student.feeStatus === 'Paid') {
      await emailService.autoDispatchFeeReceipt({
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: student.name,
        grade: `${student.grade}-${student.section}`,
        term: 'Quarter 3 (Oct - Dec 2026)',
        paidAmount: 35000,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI'
      }, {
        guardianEmail: student.guardianEmail,
        guardianName: student.guardianName,
        rollNo: student.rollNo
      });
      toast('Official Fee Receipt Dispatched', `Sent confirmation receipt to ${student.guardianEmail}`, 'success');
    } else {
      await emailService.autoDispatchFeeInvoice({
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: student.name,
        grade: `${student.grade}-${student.section}`,
        term: 'Quarter 3 (Oct - Dec 2026)',
        totalAmount: 35000,
        dueDate: '2026-10-15'
      }, {
        guardianEmail: student.guardianEmail,
        guardianName: student.guardianName,
        rollNo: student.rollNo
      });
      toast('Fee Dues Reminder Dispatched', `Sent fee payment circular to ${student.guardianEmail}`, 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Faculty & Teacher Credentials Directorate</h3>
          <p className="text-xs text-slate-500">
            Total Educators: {teachers.length} registered • Manage teacher profiles, assigned divisions & Teacher Login IDs
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Appoint New Faculty</span>
        </button>
      </div>

      {/* Subject Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {teacherSubjects.map(subj => (
          <button
            key={subj}
            onClick={() => setSelectedDept(subj)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedDept === subj
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTeachers.map(tch => (
          <div
            key={tch.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={tch.avatar}
                    alt={tch.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-bold font-cinzel text-slate-900">{tch.name}</h4>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">{tch.department}</span>
                    <div className="text-[10px] text-slate-500 font-mono">Emp ID: {tch.employeeId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openClassStudentsModal(tch)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 border border-emerald-200 cursor-pointer shadow-xs transition-all"
                    title="Manage Class Students & Division Allocations"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Class Students ({getTeacherStudents(tch).length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setManagingPeriodsTeacher(tch);
                      setPeriodForm({
                        periodNumber: '01',
                        startTime: '08:30 AM',
                        endTime: '09:20 AM',
                        grade: 'Class 8',
                        section: 'A',
                        subject: tch.assignedClasses[0]?.subject || 'General Science',
                        room: 'Room 101',
                        topic: '',
                        scheduleType: 'permanent',
                        dayOfWeek: 'All Days',
                        date: new Date().toISOString().split('T')[0],
                        notes: ''
                      });
                    }}
                    className="px-2 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 border border-blue-200 cursor-pointer"
                    title="Manage Timetable & Lecture Periods"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Timetable ({teacherPeriods.filter(p => p.teacherId === tch.id || p.teacherName === tch.name).length})</span>
                  </button>
                  <button
                    onClick={() => { setEditingTeacher({ ...tch }); setShowPassword(false); }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                    title="Edit Full Profile & Teacher Credentials"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTeacher(tch.id, tch.name)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                    title="Remove Faculty"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Teacher Login ID:</span>
                  <span className="font-mono font-bold text-emerald-800 text-xs">{tch.loginId || tch.employeeId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Password:</span>
                  <span className="font-mono text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    {tch.password || 'teacher123'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div>Subject: <strong className="text-slate-900">{tch.department}</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>{tch.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <span>{tch.phone}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Teaching Allocations</span>
                <div className="flex flex-wrap gap-1.5">
                  {tch.assignedClasses.map((ac, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-100"
                    >
                      {ac.grade}-{ac.section} ({ac.subject})
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => openClassStudentsModal(tch)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Edit Class Students →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Appoint New Faculty Member & Assign ID"
        subtitle="Set educator credentials, subject, and teaching allocation"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs">
          {/* Credentials */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Teacher Portal Login Credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teacher Login ID *</label>
                <input
                  type="text"
                  required
                  value={formData.loginId}
                  onChange={e => setFormData({ ...formData, loginId: e.target.value })}
                  placeholder="e.g. sarah.physics or PPS-FAC-014"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500">ID used by teacher to log in</span>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teacher Password *</label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="e.g. teacher123"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500">Initial password for this faculty</span>
              </div>
            </div>
          </div>

          {/* Faculty Photo Upload */}
          <ImageUploadInput
            label="Faculty Photograph / Portrait"
            value={formData.avatar}
            onChange={(val) => setFormData({ ...formData, avatar: val })}
            presets={[
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
            ]}
            shape="square"
            helperText="Upload educator photo from your device or choose a portrait preset."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Faculty Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Arthur Pendelton"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="a.pendelton@paradiseschool.edu"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject *</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                {subjectList.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
            >
              Appoint Faculty & Save ID
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={editingTeacher !== null}
        onClose={() => setEditingTeacher(null)}
        title="Edit Faculty Record & Teacher ID"
        subtitle={editingTeacher ? `${editingTeacher.name} • Subject: ${editingTeacher.department}` : ''}
        maxWidth="2xl"
      >
        {editingTeacher && (
          <form onSubmit={handleUpdateTeacher} className="space-y-4 text-xs">
            {/* Credentials Edit */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Teacher Login Credentials</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teacher Login ID</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.loginId || ''}
                    onChange={e => setEditingTeacher({ ...editingTeacher, loginId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500">Used by teacher to log in</span>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={editingTeacher.password || ''}
                      onChange={e => setEditingTeacher({ ...editingTeacher, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">Reset or customize password</span>
                </div>
              </div>
            </div>

            {/* Faculty Photo Upload in Edit Modal */}
            <ImageUploadInput
              label="Faculty Photograph / Portrait"
              value={editingTeacher.avatar}
              onChange={(val) => setEditingTeacher({ ...editingTeacher, avatar: val })}
              presets={[
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
              ]}
              shape="square"
              helperText="Upload educator photo from your device or choose a portrait preset."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Faculty Name</label>
                <input
                  type="text"
                  required
                  value={editingTeacher.name}
                  onChange={e => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={editingTeacher.email}
                  onChange={e => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <select
                  value={editingTeacher.department}
                  onChange={e => setEditingTeacher({ ...editingTeacher, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {subjectList.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={editingTeacher.phone}
                  onChange={e => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Save All Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MANAGE TEACHER PERIODS & TIMETABLE MODAL */}
      <Modal
        isOpen={managingPeriodsTeacher !== null}
        onClose={() => setManagingPeriodsTeacher(null)}
        title={`Faculty Timetable & Period Allocation`}
        subtitle={`Teacher: ${managingPeriodsTeacher?.name} • Subject: ${managingPeriodsTeacher?.department}`}
        maxWidth="2xl"
      >
        {managingPeriodsTeacher && (
          <div className="space-y-5 text-xs">
            {/* Add New Period Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Assign New Period Slot</span>
                </span>
                <span className="text-[10px] text-slate-500">Supports Permanent & For a Day schedules</span>
              </div>

              {/* Schedule Type Selection */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPeriodForm({ ...periodForm, scheduleType: 'permanent' })}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    periodForm.scheduleType === 'permanent'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Permanent Weekly</span>
                  </div>
                  <div className={`text-[10px] ${periodForm.scheduleType === 'permanent' ? 'text-blue-100' : 'text-slate-500'}`}>
                    Recurring weekly
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPeriodForm({ ...periodForm, scheduleType: 'day_only' })}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    periodForm.scheduleType === 'day_only'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>For a Day Only</span>
                  </div>
                  <div className={`text-[10px] ${periodForm.scheduleType === 'day_only' ? 'text-amber-100' : 'text-slate-500'}`}>
                    One-time lecture date
                  </div>
                </button>
              </div>

              {periodForm.scheduleType === 'permanent' ? (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Recurring Day of Week *</label>
                  <select
                    value={periodForm.dayOfWeek}
                    onChange={e => setPeriodForm({ ...periodForm, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                  >
                    <option value="All Days">All Days (Monday - Saturday)</option>
                    <option value="Monday">Every Monday</option>
                    <option value="Tuesday">Every Tuesday</option>
                    <option value="Wednesday">Every Wednesday</option>
                    <option value="Thursday">Every Thursday</option>
                    <option value="Friday">Every Friday</option>
                    <option value="Saturday">Every Saturday</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Specific Lecture Date *</label>
                  <input
                    type="date"
                    required
                    value={periodForm.date}
                    onChange={e => setPeriodForm({ ...periodForm, date: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Period # *</label>
                  <select
                    value={periodForm.periodNumber}
                    onChange={e => setPeriodForm({ ...periodForm, periodNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold"
                  >
                    <option value="01">Period 01</option>
                    <option value="02">Period 02</option>
                    <option value="03">Period 03</option>
                    <option value="04">Period 04</option>
                    <option value="05">Period 05</option>
                    <option value="06">Period 06</option>
                    <option value="07">Period 07</option>
                    <option value="08">Period 08</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={periodForm.startTime}
                    onChange={e => setPeriodForm({ ...periodForm, startTime: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Time</label>
                  <input
                    type="text"
                    value={periodForm.endTime}
                    onChange={e => setPeriodForm({ ...periodForm, endTime: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grade & Section *</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <select
                      value={periodForm.grade}
                      onChange={e => setPeriodForm({ ...periodForm, grade: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold"
                    >
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                    </select>
                    <input
                      type="text"
                      value={periodForm.section}
                      onChange={e => setPeriodForm({ ...periodForm, section: e.target.value })}
                      placeholder="Section A"
                      className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject *</label>
                  <input
                    type="text"
                    list="admin-subjects-list"
                    value={periodForm.subject}
                    onChange={e => setPeriodForm({ ...periodForm, subject: e.target.value })}
                    placeholder="Subject Name"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold"
                  />
                  <datalist id="admin-subjects-list">
                    {curriculumSubjects.map(s => (
                      <option key={s.id} value={s.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Room / Lab *</label>
                  <input
                    type="text"
                    value={periodForm.room}
                    onChange={e => setPeriodForm({ ...periodForm, room: e.target.value })}
                    placeholder="e.g. Science Lab 1 or Room 104"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lesson Topic / Lab</label>
                  <input
                    type="text"
                    value={periodForm.topic}
                    onChange={e => setPeriodForm({ ...periodForm, topic: e.target.value })}
                    placeholder="e.g. Optics & Light Refraction"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  addTeacherPeriod({
                    ...periodForm,
                    teacherId: managingPeriodsTeacher.id,
                    teacherName: managingPeriodsTeacher.name
                  });
                  toast('Period Allocated', `Assigned Period ${periodForm.periodNumber} to ${managingPeriodsTeacher.name}`, 'success');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-wider cursor-pointer"
              >
                + Add Period to Teacher Timetable
              </button>
            </div>

            {/* Existing Periods List */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 block">
                Currently Allocated Periods ({teacherPeriods.filter(p => p.teacherId === managingPeriodsTeacher.id || p.teacherName === managingPeriodsTeacher.name).length})
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {teacherPeriods.filter(p => p.teacherId === managingPeriodsTeacher.id || p.teacherName === managingPeriodsTeacher.name).length === 0 ? (
                  <div className="p-4 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
                    No periods allocated to this educator yet.
                  </div>
                ) : (
                  teacherPeriods
                    .filter(p => p.teacherId === managingPeriodsTeacher.id || p.teacherName === managingPeriodsTeacher.name)
                    .map(prd => (
                      <div
                        key={prd.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                              Period {prd.periodNumber}
                            </span>
                            <strong className="text-slate-900">{prd.grade}-{prd.section}</strong>
                            <span className="text-blue-600 font-medium">({prd.subject})</span>
                            <span className="text-[10px] text-slate-400 font-mono">[{prd.startTime} - {prd.endTime}]</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                            <span className={`px-1.5 py-0.2 rounded font-semibold ${prd.scheduleType === 'permanent' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'}`}>
                              {prd.scheduleType === 'permanent' ? `Permanent (${prd.dayOfWeek})` : `For Date: ${prd.date}`}
                            </span>
                            <span>Room: {prd.room}</span>
                            {prd.topic && <span>• Topic: {prd.topic}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            deleteTeacherPeriod(prd.id);
                            toast('Period Removed', 'Period deleted from timetable', 'info');
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 border border-slate-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setManagingPeriodsTeacher(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold cursor-pointer"
              >
                Close Directorate
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* TEACHER CLASS STUDENTS DIRECTORATE MODAL */}
      <Modal
        isOpen={managingStudentsTeacher !== null}
        onClose={() => setManagingStudentsTeacher(null)}
        title="Teacher Class Students Directorate"
        subtitle={managingStudentsTeacher ? `Educator: ${managingStudentsTeacher.name} • Subject: ${managingStudentsTeacher.department} • Emp ID: ${managingStudentsTeacher.employeeId}` : ''}
        maxWidth="4xl"
      >
        {managingStudentsTeacher && (() => {
          const currentClassStudents = getTeacherStudents(managingStudentsTeacher, selectedTeacherClass).filter(s => {
            if (!classStudentSearch) return true;
            const q = classStudentSearch.toLowerCase();
            return (
              s.name.toLowerCase().includes(q) ||
              s.rollNo.toLowerCase().includes(q) ||
              s.admissionNo.toLowerCase().includes(q) ||
              (s.loginId && s.loginId.toLowerCase().includes(q)) ||
              (s.guardianName && s.guardianName.toLowerCase().includes(q))
            );
          });

          const totalAssignedStudents = getTeacherStudents(managingStudentsTeacher).length;
          const paidCount = currentClassStudents.filter(s => s.feeStatus === 'Paid').length;
          const pendingCount = currentClassStudents.filter(s => s.feeStatus !== 'Paid').length;
          const avgCgpa = currentClassStudents.length > 0
            ? (currentClassStudents.reduce((acc, s) => acc + (s.gpa || 9.0), 0) / currentClassStudents.length).toFixed(1)
            : '0.0';

          return (
            <div className="space-y-5 text-xs">
              {/* Educator Quick Profile Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={managingStudentsTeacher.avatar}
                    alt={managingStudentsTeacher.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{managingStudentsTeacher.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {managingStudentsTeacher.department}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Login ID: <strong className="font-mono text-slate-800">{managingStudentsTeacher.loginId}</strong></span>
                      <span>•</span>
                      <span>Emp ID: <strong className="font-mono text-slate-800">{managingStudentsTeacher.employeeId}</strong></span>
                      <span>•</span>
                      <span>{managingStudentsTeacher.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Students</span>
                    <span className="text-base font-bold text-blue-600 font-mono">{totalAssignedStudents}</span>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Allocated Classes</span>
                    <span className="text-base font-bold text-emerald-600 font-mono">{managingStudentsTeacher.assignedClasses.length}</span>
                  </div>
                </div>
              </div>

              {/* Teaching Allocations (Class Divisions Selector) */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <School className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">Allocated Class Divisions for {managingStudentsTeacher.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddAllocationOpen(!isAddAllocationOpen)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center gap-1 border border-blue-200 cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddAllocationOpen ? 'Close Allocation Form' : 'Allocate New Class'}</span>
                  </button>
                </div>

                {/* Optional Inline Add Allocation Drawer */}
                {isAddAllocationOpen && (
                  <form onSubmit={handleAddClassAllocationToTeacher} className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                    <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Assign New Class Division to Educator</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Standard / Grade *</label>
                        <select
                          value={newAllocationForm.grade}
                          onChange={e => setNewAllocationForm({ ...newAllocationForm, grade: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                        >
                          {gradeOptions.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Section *</label>
                        <select
                          value={newAllocationForm.section}
                          onChange={e => setNewAllocationForm({ ...newAllocationForm, section: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                        >
                          {sectionOptions.map(s => (
                            <option key={s} value={s}>Section {s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Teaching Subject *</label>
                        <select
                          value={newAllocationForm.subject}
                          onChange={e => setNewAllocationForm({ ...newAllocationForm, subject: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                        >
                          {curriculumSubjects.length > 0
                            ? curriculumSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                            : subjectList.map(s => <option key={s} value={s}>{s}</option>)
                          }
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddAllocationOpen(false)}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                      >
                        Confirm Allocation
                      </button>
                    </div>
                  </form>
                )}

                {/* Class Division Selection Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {managingStudentsTeacher.assignedClasses.map((ac, idx) => {
                    const key = `${ac.grade}-${ac.section}`;
                    const count = getTeacherStudents(managingStudentsTeacher, key).length;
                    const isSelected = selectedTeacherClass === key || (
                      normalizeGrade(selectedTeacherClass.split('-')[0]) === normalizeGrade(ac.grade) &&
                      selectedTeacherClass.split('-')[1]?.trim() === ac.section.trim()
                    );

                    return (
                      <div
                        key={idx}
                        className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedTeacherClass(key)}
                      >
                        <span>{ac.grade}-{ac.section}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'}`}>
                          {ac.subject}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700'}`}>
                          {count} Scholars
                        </span>
                        {managingStudentsTeacher.assignedClasses.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveClassAllocationFromTeacher(ac.grade, ac.section);
                            }}
                            className={`p-0.5 rounded hover:bg-red-500 hover:text-white transition-colors cursor-pointer ${isSelected ? 'text-blue-200' : 'text-slate-400 opacity-60 group-hover:opacity-100'}`}
                            title="Remove division allocation"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Class Students Directorate Workspace */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                {/* Header & Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h5 className="text-sm font-bold font-cinzel text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Class Students Directory ({selectedTeacherClass})</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Educator oversees {currentClassStudents.length} enrolled scholars in this division
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={classStudentSearch}
                        onChange={e => setClassStudentSearch(e.target.value)}
                        placeholder="Search student or roll #..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenEnrollModal}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Enroll Student</span>
                    </button>
                  </div>
                </div>

                {/* Class Quick Metric Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Total Enrolled</span>
                    <strong className="text-slate-900 font-mono text-sm">{currentClassStudents.length}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-medium">Fees Paid</span>
                    <strong className="text-emerald-800 font-mono text-sm">{paidCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <span className="text-[11px] text-amber-700 font-medium">Pending Dues</span>
                    <strong className="text-amber-800 font-mono text-sm">{pendingCount}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <span className="text-[11px] text-blue-700 font-medium">Avg CGPA</span>
                    <strong className="text-blue-800 font-mono text-sm">{avgCgpa} / 10</strong>
                  </div>
                </div>

                {/* Students Table */}
                {currentClassStudents.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
                    <div>
                      <h6 className="font-bold text-slate-700 text-sm">No Scholars Found in {selectedTeacherClass}</h6>
                      <p className="text-slate-500 text-xs mt-1">
                        {classStudentSearch ? 'No students matched your search query.' : `No students have been enrolled into ${selectedTeacherClass} yet.`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenEnrollModal}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      + Enroll First Scholar in {selectedTeacherClass}
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                          <th className="py-2.5 px-3">Roll & Scholar</th>
                          <th className="py-2.5 px-3">Login ID & Pass</th>
                          <th className="py-2.5 px-3">House</th>
                          <th className="py-2.5 px-3">Guardian Contact</th>
                          <th className="py-2.5 px-3">Fee Status</th>
                          <th className="py-2.5 px-3 text-center">CGPA (10-Pt)</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentClassStudents.map(student => {
                          const houseBadgeClass =
                            student.house === 'Ashoka House' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            student.house === 'Tagore House' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            student.house === 'Shivaji House' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                            'bg-blue-50 text-blue-800 border-blue-200';

                          return (
                            <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                      <span>{student.name}</span>
                                      <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1 rounded font-bold">
                                        #{student.rollNo}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono block">
                                      Adm: {student.admissionNo}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="font-mono text-slate-800 font-bold">{student.loginId}</div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {student.password || 'password123'}
                                </div>
                              </td>

                              <td className="py-2.5 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${houseBadgeClass}`}>
                                  {student.house || 'Ashoka House'}
                                </span>
                              </td>

                              <td className="py-2.5 px-3">
                                <div className="text-slate-800 font-medium">{student.guardianName}</div>
                                <div className="text-[10px] text-slate-500">{student.guardianPhone}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{student.guardianEmail}</div>
                              </td>

                              <td className="py-2.5 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  student.feeStatus === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : student.feeStatus === 'Overdue'
                                    ? 'bg-red-100 text-red-800 border border-red-200'
                                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                                }`}>
                                  {student.feeStatus}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 text-center">
                                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                                  {student.gpa || 9.5}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleSendQuickStudentFeeNotice(student)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 border border-slate-200 cursor-pointer transition-colors"
                                    title={student.feeStatus === 'Paid' ? 'Send Fee Receipt Email to Guardian' : 'Send Fee Dues Notice Email to Guardian'}
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingStudent({ ...student })}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border border-slate-200 cursor-pointer transition-colors"
                                    title="Edit Scholar Details & Grade Division"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStudentFromClass(student.id, student.name)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 border border-slate-200 cursor-pointer transition-colors"
                                    title="Unenroll Scholar from Class"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Bottom Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">
                  Editing class students directory for faculty <strong className="text-slate-800">{managingStudentsTeacher.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setManagingStudentsTeacher(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer transition-all"
                >
                  Close Class Students Directorate
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ENROLL STUDENT MODAL */}
      <Modal
        isOpen={isEnrollStudentOpen}
        onClose={() => setIsEnrollStudentOpen(false)}
        title={`Enroll Scholar into ${selectedTeacherClass}`}
        subtitle={managingStudentsTeacher ? `Assign student directly to ${managingStudentsTeacher.name}'s classroom directory` : ''}
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateStudentForTeacher} className="space-y-4 text-xs">
          {/* Identity & Credentials */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Scholar Login & Division Identification</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Scholar Login ID</label>
                <input
                  type="text"
                  value={newStudentForm.loginId}
                  onChange={e => setNewStudentForm({ ...newStudentForm, loginId: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.rollNo}
                  onChange={e => setNewStudentForm({ ...newStudentForm, rollNo: e.target.value })}
                  placeholder="e.g. 08A-15"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Admission No *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.admissionNo}
                  onChange={e => setNewStudentForm({ ...newStudentForm, admissionNo: e.target.value })}
                  placeholder="PPS-2026-XXXX"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Student Name *</label>
              <input
                type="text"
                required
                value={newStudentForm.name}
                onChange={e => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">House (Indian Standards) *</label>
              <select
                value={newStudentForm.house}
                onChange={e => setNewStudentForm({ ...newStudentForm, house: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
              >
                {houseOptions.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                value={newStudentForm.dob}
                onChange={e => setNewStudentForm({ ...newStudentForm, dob: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select
                value={newStudentForm.gender}
                onChange={e => setNewStudentForm({ ...newStudentForm, gender: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Fee Status</label>
              <select
                value={newStudentForm.feeStatus}
                onChange={e => setNewStudentForm({ ...newStudentForm, feeStatus: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="font-bold text-slate-900 block">Guardian Contact Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.guardianName}
                  onChange={e => setNewStudentForm({ ...newStudentForm, guardianName: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Guardian Phone *</label>
                <input
                  type="tel"
                  required
                  value={newStudentForm.guardianPhone}
                  onChange={e => setNewStudentForm({ ...newStudentForm, guardianPhone: e.target.value })}
                  placeholder="+91 98290 12345"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Guardian Email *</label>
                <input
                  type="email"
                  required
                  value={newStudentForm.guardianEmail}
                  onChange={e => setNewStudentForm({ ...newStudentForm, guardianEmail: e.target.value })}
                  placeholder="parent@example.in"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEnrollStudentOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Enroll Scholar into {selectedTeacherClass}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT SCHOLAR MODAL */}
      <Modal
        isOpen={editingStudent !== null}
        onClose={() => setEditingStudent(null)}
        title="Edit Scholar Profile & Division"
        subtitle={editingStudent ? `Scholar: ${editingStudent.name} • Roll: ${editingStudent.rollNo} • Adm: ${editingStudent.admissionNo}` : ''}
        maxWidth="2xl"
      >
        {editingStudent && (
          <form onSubmit={handleSaveEditedStudent} className="space-y-4 text-xs">
            {/* Identity & Credentials */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Scholar Credentials & Roll Registry</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Login ID</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.loginId || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, loginId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.rollNo}
                    onChange={e => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.admissionNo}
                    onChange={e => setEditingStudent({ ...editingStudent, admissionNo: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 font-mono text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Scholar Full Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">House</label>
                <select
                  value={editingStudent.house}
                  onChange={e => setEditingStudent({ ...editingStudent, house: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  {houseOptions.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Division Transfer Option */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Standard / Grade</label>
                <select
                  value={editingStudent.grade}
                  onChange={e => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  {gradeOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Section</label>
                <select
                  value={editingStudent.section}
                  onChange={e => setEditingStudent({ ...editingStudent, section: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  {sectionOptions.map(s => (
                    <option key={s} value={s}>Section {s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fee Status</label>
                <select
                  value={editingStudent.feeStatus}
                  onChange={e => setEditingStudent({ ...editingStudent, feeStatus: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">CGPA (10-Pt)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={editingStudent.gpa}
                  onChange={e => setEditingStudent({ ...editingStudent, gpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="font-bold text-slate-900 block">Guardian Records</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.guardianName}
                    onChange={e => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingStudent.guardianPhone}
                    onChange={e => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Email</label>
                  <input
                    type="email"
                    required
                    value={editingStudent.guardianEmail}
                    onChange={e => setEditingStudent({ ...editingStudent, guardianEmail: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  value={editingStudent.address || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  placeholder="Plot / House No, Pali, Rajasthan"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Save Scholar Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
