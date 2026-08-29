import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Teacher, TeacherPeriod } from '../../types';
import { UserCheck, Plus, Trash2, Edit3, Mail, Phone, Key, Eye, EyeOff, BookOpen, Clock, Calendar, CalendarDays, MapPin } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

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
    subjects
  } = useSchoolData();
  const { toast } = useToast();

  const [selectedDept, setSelectedDept] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [managingPeriodsTeacher, setManagingPeriodsTeacher] = useState<Teacher | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
    designation: 'Senior Faculty',
    department: 'Physics & STEM Labs',
    qualification: 'M.Sc. / Ph.D. in Specialization',
    experienceYears: 8,
    assignedClasses: [
      { grade: 'Grade 10', section: 'A', subject: 'Advanced Physics' }
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const departments = ['All', 'Physics & STEM Labs', 'Mathematics & Computing', 'English Literature & Rhetoric', 'Computer Science'];

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
      designation: 'Senior Faculty',
      department: 'Physics & STEM Labs',
      qualification: 'M.Sc. / Ph.D. in Specialization',
      experienceYears: 8,
      assignedClasses: [
        { grade: 'Grade 10', section: 'A', subject: 'Advanced Physics' }
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

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedDept === dept
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {dept}
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
                    <span className="text-xs text-blue-600 font-semibold">{tch.designation}</span>
                    <div className="text-[10px] text-slate-500 font-mono">Emp ID: {tch.employeeId}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
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
                <div>Department: <strong className="text-slate-900">{tch.department}</strong></div>
                <div>Qualification: <span className="text-slate-600">{tch.qualification}</span></div>
                <div>Experience: <span className="text-slate-900 font-semibold">{tch.experienceYears} Years</span></div>
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

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Teaching Allocations</span>
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
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Appoint New Faculty Member & Assign ID"
        subtitle="Set educator credentials, department, and teaching allocation"
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option>Physics & STEM Labs</option>
                <option>Mathematics & Computing</option>
                <option>English Literature & Rhetoric</option>
                <option>Computer Science</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Academic Qualifications</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Experience (Years)</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
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
        subtitle={editingTeacher ? `${editingTeacher.name} • ${editingTeacher.department}` : ''}
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

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <select
                  value={editingTeacher.department}
                  onChange={e => setEditingTeacher({ ...editingTeacher, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option>Physics & STEM Labs</option>
                  <option>Mathematics & Computing</option>
                  <option>English Literature & Rhetoric</option>
                  <option>Computer Science</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={editingTeacher.designation}
                  onChange={e => setEditingTeacher({ ...editingTeacher, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Qualifications</label>
                <input
                  type="text"
                  value={editingTeacher.qualification}
                  onChange={e => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Experience Years</label>
                <input
                  type="number"
                  value={editingTeacher.experienceYears}
                  onChange={e => setEditingTeacher({ ...editingTeacher, experienceYears: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
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
        subtitle={`Teacher: ${managingPeriodsTeacher?.name} • ${managingPeriodsTeacher?.department}`}
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
                    {subjects.map(s => (
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
    </div>
  );
};
