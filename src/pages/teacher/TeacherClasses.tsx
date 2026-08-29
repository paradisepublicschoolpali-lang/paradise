import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Student, TeacherPeriod, FeeItem } from '../../types';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Search,
  Key,
  CreditCard,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  MapPin,
  FileText
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const TeacherClasses: React.FC = () => {
  const {
    students,
    teachers,
    subjects,
    teacherPeriods,
    periodSlots,
    enrollStudentWithFee,
    addTeacherPeriod,
    updateTeacherPeriod,
    deleteTeacherPeriod
  } = useSchoolData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const currentTeacher = teachers.find(t => t.id === currentUser.id || t.loginId === currentUser.loginId) || teachers[0];

  const [activeTab, setActiveTab] = useState<'roster' | 'periods'>('roster');
  const [selectedClass, setSelectedClass] = useState('Class 8-A');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [periodDayFilter, setPeriodDayFilter] = useState('All');

  // Modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TeacherPeriod | null>(null);

  // New Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    loginId: '',
    password: 'password123',
    grade: 'Class 8',
    section: 'A',
    rollNo: '08A-99',
    admissionNo: `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    house: 'Phoenix Gold' as Student['house'],
    dob: '2012-06-15',
    gender: 'Male' as Student['gender'],
    bloodGroup: 'O+',
    guardianName: '',
    guardianPhone: '+91 ',
    guardianEmail: '',
    address: '',
    busRoute: 'Route 4 - Rohini & Pitampura Express',
    busNumber: 'DL-1PB-0418',
    lockerNumber: 'LK-08A-99',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
  });

  // Initial Tuition Fee Form when Enrolling Student
  const [initialFeeForm, setInitialFeeForm] = useState({
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    tuition: 35000,
    status: 'Pending' as FeeItem['status']
  });

  // Period Form State
  const [periodForm, setPeriodForm] = useState({
    periodNumber: '01',
    startTime: '08:30 AM',
    endTime: '09:20 AM',
    grade: 'Class 8',
    section: 'A',
    subject: subjects[0]?.name || 'Hindi',
    room: 'Science Lab 1',
    topic: '',
    scheduleType: 'permanent' as 'permanent' | 'day_only',
    dayOfWeek: 'All Days' as TeacherPeriod['dayOfWeek'],
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Filtered Periods for this teacher
  const teacherSpecificPeriods = teacherPeriods.filter(
    p => p.teacherId === currentTeacher?.id || p.teacherName === currentTeacher?.name
  );

  const filteredPeriods = teacherSpecificPeriods.filter(p => {
    if (periodDayFilter === 'All') return true;
    if (periodDayFilter === 'permanent') return p.scheduleType === 'permanent';
    if (periodDayFilter === 'day_only') return p.scheduleType === 'day_only';
    if (p.scheduleType === 'permanent') {
      return p.dayOfWeek === periodDayFilter || p.dayOfWeek === 'All Days';
    }
    return false;
  });

  // Enrolled Students for Selected Class
  const classStudents = students.filter(s => {
    const targetGrade = selectedClass.split('-')[0].trim();
    const targetSection = selectedClass.split('-')[1]?.trim();
    const gradeMatch = s.grade.toLowerCase().includes(targetGrade.toLowerCase().replace('class ', ''));
    const sectionMatch = !targetSection || s.section.toLowerCase() === targetSection.toLowerCase();
    const searchMatch = !studentSearchQuery ||
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      (s.loginId && s.loginId.toLowerCase().includes(studentSearchQuery.toLowerCase()));
    return gradeMatch && sectionMatch && searchMatch;
  });

  // Handle Create Student with Fee
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.guardianName || !studentForm.guardianPhone || !studentForm.guardianEmail) {
      toast('Please fill all mandatory fields including Guardian Email ID', '', 'error');
      return;
    }

    const assignedLoginId = studentForm.loginId || studentForm.name.toLowerCase().split(' ')[0] + Math.floor(10 + Math.random() * 90);

    const { student, fee } = enrollStudentWithFee(
      {
        ...studentForm,
        loginId: assignedLoginId,
        password: studentForm.password || 'password123'
      },
      initialFeeForm
    );

    toast(
      'Scholar Enrolled & Tuition Fee Configured!',
      `Login ID: ${assignedLoginId} | Initial Fee: ${formatCurrency(initialFeeForm.tuition)} (${initialFeeForm.status})`,
      'success'
    );
    setIsAddStudentModalOpen(false);

    // Reset Form
    setStudentForm({
      name: '',
      loginId: '',
      password: 'password123',
      grade: 'Class 8',
      section: 'A',
      rollNo: '08A-99',
      admissionNo: `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      house: 'Phoenix Gold',
      dob: '2012-06-15',
      gender: 'Male',
      bloodGroup: 'O+',
      guardianName: '',
      guardianPhone: '+91 ',
      guardianEmail: '',
      address: '',
      busRoute: 'Route 4 - Rohini & Pitampura Express',
      busNumber: 'DL-1PB-0418',
      lockerNumber: 'LK-08A-99',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
    });
    setInitialFeeForm({
      term: 'Quarter 3 (Oct - Dec 2026)',
      dueDate: '2026-10-15',
      tuition: 35000,
      status: 'Pending'
    });
  };

  // Handle Save / Edit Period
  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPeriod) {
      updateTeacherPeriod(editingPeriod.id, {
        ...periodForm,
        teacherId: currentTeacher?.id || 'tch-1',
        teacherName: currentTeacher?.name || 'Faculty Member'
      });
      toast('Period Updated', `Saved schedule for ${periodForm.grade}-${periodForm.section} (${periodForm.subject})`, 'success');
      setEditingPeriod(null);
    } else {
      addTeacherPeriod({
        ...periodForm,
        teacherId: currentTeacher?.id || 'tch-1',
        teacherName: currentTeacher?.name || 'Faculty Member'
      });
      const typeLabel = periodForm.scheduleType === 'permanent' ? 'Permanent Weekly Schedule' : `Day-Specific for ${periodForm.date}`;
      toast('Period Scheduled!', `Added Period ${periodForm.periodNumber} (${typeLabel})`, 'success');
      setIsPeriodModalOpen(false);
    }

    // Reset period form
    setPeriodForm({
      periodNumber: '01',
      startTime: '08:30 AM',
      endTime: '09:20 AM',
      grade: 'Class 8',
      section: 'A',
      subject: 'General & Physical Science',
      room: 'Science Lab 1',
      topic: '',
      scheduleType: 'permanent',
      dayOfWeek: 'All Days',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleDeletePeriod = (id: string, periodNumber: string) => {
    if (window.confirm(`Remove Period ${periodNumber} from your timetable?`)) {
      deleteTeacherPeriod(id);
      toast('Period Removed', 'Timetable slot archived', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Faculty Classes, Roster & Timetable Directorate</h3>
          <p className="text-xs text-slate-500">
            Educator: <strong className="text-slate-900">{currentTeacher?.name}</strong> • Enroll students with initial fees & schedule permanent or day-specific lecture periods
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'roster'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Class Rosters</span>
            </button>
            <button
              onClick={() => setActiveTab('periods')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'periods'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Periods & Timetable ({teacherSpecificPeriods.length})</span>
            </button>
          </div>

          {activeTab === 'roster' ? (
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll New Scholar</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingPeriod(null);
                setIsPeriodModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Period</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CLASS ROSTERS & STUDENT MANAGEMENT */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Class Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: '8-A', name: 'Class 8-A', subject: 'General & Physical Science', room: 'Science Lab 1', count: students.filter(s => s.grade.includes('8')).length, progress: 68 },
              { id: '7-A', name: 'Class 7-A', subject: 'Integrated Science & Discovery', room: 'Room 104', count: students.filter(s => s.grade.includes('7')).length, progress: 74 },
              { id: '6-A', name: 'Class 6-A', subject: 'Environmental Science', room: 'Room 102', count: students.filter(s => s.grade.includes('6')).length, progress: 80 }
            ].map(cls => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls.name)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedClass === cls.name
                    ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {cls.room}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{cls.count} Scholars</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-cinzel text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{cls.subject}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Syllabus Coverage</span>
                    <span className="font-bold text-slate-900">{cls.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cls.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Student Roster Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Class Roster & Directory ({selectedClass})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {classStudents.length} Scholars enrolled • Teacher authorized to add scholars & set initial fees
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={e => setStudentSearchQuery(e.target.value)}
                    placeholder="Search scholar name, roll #..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => setIsAddStudentModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 border border-blue-200 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Scholar</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Scholar Info</th>
                    <th className="py-3 px-4 font-semibold">Roll No</th>
                    <th className="py-3 px-4 font-semibold">Login ID</th>
                    <th className="py-3 px-4 font-semibold">House</th>
                    <th className="py-3 px-4 font-semibold text-center">Attendance</th>
                    <th className="py-3 px-4 font-semibold text-center">GPA</th>
                    <th className="py-3 px-4 font-semibold">Guardian Contact</th>
                    <th className="py-3 px-4 font-semibold text-center">Fee Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No scholars found matching this class or search query. Click "Enroll New Scholar" to add one.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'; }}
                          />
                          <div>
                            <div>{student.name}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{student.admissionNo}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold">{student.rollNo}</td>
                        <td className="py-3 px-4 font-mono text-blue-700 font-bold">{student.loginId || student.admissionNo}</td>
                        <td className="py-3 px-4">
                          <span className="text-blue-600 font-medium">{student.house}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600">{student.attendanceRate}%</td>
                        <td className="py-3 px-4 text-center font-bold text-blue-600">{student.gpa}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{student.guardianName}</div>
                          <div className="font-mono text-slate-500 text-[10px]">{student.guardianPhone}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {student.feeStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERIODS & TIMETABLE (PERMANENT & DAY-ONLY) */}
      {activeTab === 'periods' && (
        <div className="space-y-6">
          {/* Day Filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'All', label: 'All Periods' },
                { id: 'permanent', label: 'Permanent Weekly' },
                { id: 'day_only', label: 'Day-Specific' },
                { id: 'Monday', label: 'Mon' },
                { id: 'Tuesday', label: 'Tue' },
                { id: 'Wednesday', label: 'Wed' },
                { id: 'Thursday', label: 'Thu' },
                { id: 'Friday', label: 'Fri' },
                { id: 'Saturday', label: 'Sat' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setPeriodDayFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    periodDayFilter === f.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setEditingPeriod(null);
                setIsPeriodModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period (Permanent or For a Day)</span>
            </button>
          </div>

          {/* Periods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeriods.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <Clock className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 font-cinzel">No Scheduled Periods Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You have not scheduled any lectures under this filter. Click below to add a permanent weekly recurring period or a single day-specific lecture.
                </p>
                <button
                  onClick={() => setIsPeriodModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase"
                >
                  Schedule First Period
                </button>
              </div>
            ) : (
              filteredPeriods.map(prd => (
                <div
                  key={prd.id}
                  className={`p-5 rounded-2xl bg-white border transition-all shadow-xs space-y-3 flex flex-col justify-between ${
                    prd.scheduleType === 'permanent'
                      ? 'border-slate-200 hover:border-blue-400'
                      : 'border-amber-200 hover:border-amber-400 bg-amber-50/20'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
                          Period {prd.periodNumber}
                        </span>
                        <span className="text-xs text-slate-700 font-mono font-semibold">
                          {prd.startTime} - {prd.endTime}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          prd.scheduleType === 'permanent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {prd.scheduleType === 'permanent' ? `Permanent (${prd.dayOfWeek || 'All Days'})` : `For a Day: ${prd.date}`}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold font-cinzel text-slate-900">
                          {prd.grade} - {prd.section}
                        </h4>
                        <span className="text-xs text-blue-600 font-semibold truncate">
                          ({prd.subject})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prd.room}</span>
                      </div>
                    </div>

                    {prd.topic && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Topic / Lesson:</span>
                        <p className="text-slate-800 font-medium text-[11px] mt-0.5">{prd.topic}</p>
                      </div>
                    )}

                    {prd.notes && (
                      <div className="text-[11px] text-slate-500 italic">
                        Notes: {prd.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingPeriod(prd);
                        setPeriodForm({
                          periodNumber: prd.periodNumber,
                          startTime: prd.startTime,
                          endTime: prd.endTime,
                          grade: prd.grade,
                          section: prd.section,
                          subject: prd.subject,
                          room: prd.room,
                          topic: prd.topic || '',
                          scheduleType: prd.scheduleType,
                          dayOfWeek: prd.dayOfWeek || 'All Days',
                          date: prd.date || new Date().toISOString().split('T')[0],
                          notes: prd.notes || ''
                        });
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                      title="Edit Period Slot"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePeriod(prd.id, prd.periodNumber)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                      title="Delete Period"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ENROLL NEW SCHOLAR MODAL (WITH MANDATORY FEE SETTING) */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title="Faculty Student Enrollment Desk"
        subtitle="Enroll a new scholar into your division and configure initial tuition fee invoicing"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
          {/* Credentials Section */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Parent & Scholar Portal Login Credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student Login ID *</label>
                <input
                  type="text"
                  required
                  value={studentForm.loginId}
                  onChange={e => setStudentForm({ ...studentForm, loginId: e.target.value })}
                  placeholder="e.g. aryan10 or PPS-2026-0842"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-500">ID used by parent & student to log in</span>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Password *</label>
                <input
                  type="text"
                  required
                  value={studentForm.password}
                  onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                  placeholder="e.g. password123"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-500">Default password provided to student</span>
              </div>
            </div>
          </div>

          {/* Student Photo */}
          <ImageUploadInput
            label="Scholar Photograph / Avatar"
            value={studentForm.avatar}
            onChange={(val) => setStudentForm({ ...studentForm, avatar: val })}
            presets={[
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
            ]}
            shape="square"
            helperText="Upload student photo from device or choose portrait preset."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Scholar Full Name *</label>
              <input
                type="text"
                required
                value={studentForm.name}
                onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                placeholder="e.g. Aryan Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Admission Number</label>
              <input
                type="text"
                value={studentForm.admissionNo}
                onChange={e => setStudentForm({ ...studentForm, admissionNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Grade</label>
              <select
                value={studentForm.grade}
                onChange={e => setStudentForm({ ...studentForm, grade: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Nursery">Nursery</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8 (Senior)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Section</label>
              <input
                type="text"
                value={studentForm.section}
                onChange={e => setStudentForm({ ...studentForm, section: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Roll Number</label>
              <input
                type="text"
                value={studentForm.rollNo}
                onChange={e => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Guardian Name *</label>
              <input
                type="text"
                required
                value={studentForm.guardianName}
                onChange={e => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                placeholder="Vikram Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Guardian Phone *</label>
              <input
                type="tel"
                required
                value={studentForm.guardianPhone}
                onChange={e => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                placeholder="+91 98110 00000"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Guardian / Student Email ID *</label>
              <input
                type="email"
                required
                value={studentForm.guardianEmail}
                onChange={e => setStudentForm({ ...studentForm, guardianEmail: e.target.value })}
                placeholder="parent@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Initial Fee Structure Setup (Mandatory) */}
          <div className="p-4 bg-emerald-50/90 border-2 border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Initial Tuition Fee Invoicing (Mandatory Setup)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                Auto-Created With Scholar
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Every enrolled scholar is automatically assigned their initial tuition fee invoice in the school treasury upon creation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Term *</label>
                <input
                  type="text"
                  required
                  value={initialFeeForm.term}
                  onChange={e => setInitialFeeForm({ ...initialFeeForm, term: e.target.value })}
                  placeholder="e.g. Quarter 3 (Oct - Dec 2026)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fee Due Date *</label>
                <input
                  type="date"
                  required
                  value={initialFeeForm.dueDate}
                  onChange={e => setInitialFeeForm({ ...initialFeeForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tuition Fee Amount (₹) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={initialFeeForm.tuition}
                  onChange={e => setInitialFeeForm({ ...initialFeeForm, tuition: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Initial Payment Status</label>
              <select
                value={initialFeeForm.status}
                onChange={e => setInitialFeeForm({ ...initialFeeForm, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Pending">Pending (Awaiting Payment)</option>
                <option value="Paid">Paid (Pre-collected at Admission)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddStudentModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              Enroll Scholar & Set Fee
            </button>
          </div>
        </form>
      </Modal>

      {/* SCHEDULE PERIOD MODAL (PERMANENT & FOR A DAY) */}
      <Modal
        isOpen={isPeriodModalOpen || editingPeriod !== null}
        onClose={() => {
          setIsPeriodModalOpen(false);
          setEditingPeriod(null);
        }}
        title={editingPeriod ? "Edit Scheduled Period" : "Schedule Period (Permanent or For a Day)"}
        subtitle={`Teacher: ${currentTeacher?.name || 'Faculty Member'} • ${currentTeacher?.department}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSavePeriod} className="space-y-4 text-xs">
          {/* Schedule Type Switcher */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
            <label className="block text-blue-950 font-bold text-xs">Schedule Type (Permanent or Day-Specific) *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPeriodForm({ ...periodForm, scheduleType: 'permanent' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  periodForm.scheduleType === 'permanent'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Permanent Schedule</span>
                </div>
                <div className={`text-[10px] mt-0.5 ${periodForm.scheduleType === 'permanent' ? 'text-blue-100' : 'text-slate-500'}`}>
                  Recurring weekly on specified day
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPeriodForm({ ...periodForm, scheduleType: 'day_only' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  periodForm.scheduleType === 'day_only'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>For a Day Only</span>
                </div>
                <div className={`text-[10px] mt-0.5 ${periodForm.scheduleType === 'day_only' ? 'text-amber-100' : 'text-slate-500'}`}>
                  One-time lecture / substitution date
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Day or Date Selection */}
          {periodForm.scheduleType === 'permanent' ? (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Recurring Day of Week *</label>
              <select
                value={periodForm.dayOfWeek}
                onChange={e => setPeriodForm({ ...periodForm, dayOfWeek: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
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
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Period Details */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Period # *</label>
              <select
                value={periodForm.periodNumber}
                onChange={e => {
                  const selectedNum = e.target.value;
                  const matchedSlot = periodSlots.find(slot => slot.periodNumber === selectedNum);
                  setPeriodForm(prev => ({
                    ...prev,
                    periodNumber: selectedNum,
                    startTime: matchedSlot ? matchedSlot.startTime : prev.startTime,
                    endTime: matchedSlot ? matchedSlot.endTime : prev.endTime
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none"
              >
                {periodSlots.map(slot => (
                  <option key={slot.id} value={slot.periodNumber}>
                    {slot.name} ({slot.startTime} - {slot.endTime})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Time *</label>
              <input
                type="text"
                required
                value={periodForm.startTime}
                onChange={e => setPeriodForm({ ...periodForm, startTime: e.target.value })}
                placeholder="08:30 AM"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Time *</label>
              <input
                type="text"
                required
                value={periodForm.endTime}
                onChange={e => setPeriodForm({ ...periodForm, endTime: e.target.value })}
                placeholder="09:20 AM"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Grade *</label>
              <select
                value={periodForm.grade}
                onChange={e => setPeriodForm({ ...periodForm, grade: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
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
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Section *</label>
              <input
                type="text"
                required
                value={periodForm.section}
                onChange={e => setPeriodForm({ ...periodForm, section: e.target.value })}
                placeholder="A"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject Name *</label>
              <input
                type="text"
                required
                list="subjects-list"
                value={periodForm.subject}
                onChange={e => setPeriodForm({ ...periodForm, subject: e.target.value })}
                placeholder="e.g. General & Physical Science"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
              />
              <datalist id="subjects-list">
                {subjects.map(s => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Room / Lab *</label>
              <input
                type="text"
                required
                value={periodForm.room}
                onChange={e => setPeriodForm({ ...periodForm, room: e.target.value })}
                placeholder="Science Lab 1 or Room 104"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Lesson Topic / Lab Activity</label>
            <input
              type="text"
              value={periodForm.topic}
              onChange={e => setPeriodForm({ ...periodForm, topic: e.target.value })}
              placeholder="e.g. Force, Pressure & Atmospheric Dynamics"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Special Instructions / Remarks</label>
            <input
              type="text"
              value={periodForm.notes}
              onChange={e => setPeriodForm({ ...periodForm, notes: e.target.value })}
              placeholder="e.g. Bring physics practical journal"
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsPeriodModalOpen(false);
                setEditingPeriod(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              {editingPeriod ? 'Save Changes' : 'Schedule Period'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

