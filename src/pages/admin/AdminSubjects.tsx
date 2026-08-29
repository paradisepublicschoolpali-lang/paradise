import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { SchoolSubject, PeriodSlot } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  User,
  Filter,
  Info,
  CalendarDays,
  Settings
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AdminSubjects: React.FC = () => {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    teachers,
    periodSlots,
    addPeriodSlot,
    updatePeriodSlot,
    deletePeriodSlot
  } = useSchoolData();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'subjects' | 'periods'>('subjects');

  // Subjects Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('All');

  // Subject Modals & Form
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SchoolSubject | null>(null);

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    department: 'Languages & Literature',
    category: 'Core Academic' as SchoolSubject['category'],
    grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 5,
    description: '',
    headTeacher: 'Mrs. Anjali Sharma',
    status: 'Active' as SchoolSubject['status']
  });

  // Period Slot Modals & Form
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<PeriodSlot | null>(null);

  const [slotForm, setSlotForm] = useState({
    periodNumber: '08',
    name: 'Period 08',
    startTime: '04:00 PM',
    endTime: '04:50 PM',
    type: 'lecture' as PeriodSlot['type']
  });

  const allGradesList = [
    'Nursery',
    'Kindergarten',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8'
  ];

  const categoriesList = [
    'All',
    'Core Academic',
    'STEM & Sciences',
    'Languages & Literature',
    'Arts & Culture',
    'Physical Education',
    'Vocational & Tech'
  ];

  // Filtering subjects
  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesGrade = selectedGradeFilter === 'All' || sub.grades.includes(selectedGradeFilter);
    return matchesSearch && matchesCat && matchesGrade;
  });

  // KPI calculations
  const totalWeeklyPeriods = subjects.reduce((sum, s) => sum + (s.weeklyPeriods || 0), 0);
  const coreSubjectsCount = subjects.filter(s => s.category === 'Core Academic').length;
  const stemCount = subjects.filter(s => s.category === 'STEM & Sciences' || s.department.includes('Science') || s.department.includes('Mathematics')).length;

  const handleToggleGrade = (grade: string) => {
    setSubjectForm(prev => {
      const exists = prev.grades.includes(grade);
      return {
        ...prev,
        grades: exists ? prev.grades.filter(g => g !== grade) : [...prev.grades, grade]
      };
    });
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code) {
      toast('Please enter both Subject Name and Subject Code', '', 'error');
      return;
    }
    if (subjectForm.grades.length === 0) {
      toast('Please select at least one applicable grade', '', 'error');
      return;
    }

    addSubject(subjectForm);
    toast('Subject Added to Curriculum', `${subjectForm.name} (${subjectForm.code}) registered successfully`, 'success');
    setIsAddSubjectModalOpen(false);
    setSubjectForm({
      name: '',
      code: '',
      department: 'Languages & Literature',
      category: 'Core Academic',
      grades: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'],
      weeklyPeriods: 5,
      description: '',
      headTeacher: teachers[0]?.name || 'Mrs. Anjali Sharma',
      status: 'Active'
    });
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    if (!editingSubject.name || !editingSubject.code) {
      toast('Subject Name and Code are mandatory', '', 'error');
      return;
    }

    updateSubject(editingSubject.id, editingSubject);
    toast('Subject Details Updated', `Saved changes for ${editingSubject.name}`, 'success');
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the school subject directory?`)) {
      deleteSubject(id);
      toast('Subject Removed', `${name} archived from curriculum`, 'info');
    }
  };

  // Period Slot Handlers
  const handleSavePeriodSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.periodNumber || !slotForm.startTime || !slotForm.endTime) {
      toast('Please fill all period timing details', '', 'error');
      return;
    }

    if (editingSlot) {
      updatePeriodSlot(editingSlot.id, slotForm);
      toast('Period Timing Updated', `Saved schedule for ${slotForm.name} (${slotForm.startTime} - ${slotForm.endTime})`, 'success');
      setEditingSlot(null);
    } else {
      addPeriodSlot(slotForm);
      toast('New Period Slot Added', `${slotForm.name} (${slotForm.startTime} - ${slotForm.endTime}) added to timetable master`, 'success');
      setIsAddSlotModalOpen(false);
    }

    const nextNum = String(periodSlots.length + 1).padStart(2, '0');
    setSlotForm({
      periodNumber: nextNum,
      name: `Period ${nextNum}`,
      startTime: '04:00 PM',
      endTime: '04:50 PM',
      type: 'lecture'
    });
  };

  const handleDeletePeriodSlot = (id: string, name: string) => {
    if (window.confirm(`Remove ${name} from the master period schedule?`)) {
      deletePeriodSlot(id);
      toast('Period Slot Removed', `${name} removed from master timings`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Curriculum & Period Timings Directorate</span>
          </h2>
          <p className="text-xs text-slate-500">
            Admin Directorate • Add subjects to curriculum & configure timing slots for all school periods
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'subjects'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>School Subjects ({subjects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('periods')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'periods'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Period Timings ({periodSlots.length} Slots)</span>
            </button>
          </div>

          {activeTab === 'subjects' ? (
            <button
              onClick={() => setIsAddSubjectModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Subject</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingSlot(null);
                const nextNum = String(periodSlots.length + 1).padStart(2, '0');
                setSlotForm({
                  periodNumber: nextNum,
                  name: `Period ${nextNum}`,
                  startTime: '04:00 PM',
                  endTime: '04:50 PM',
                  type: 'lecture'
                });
                setIsAddSlotModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SCHOOL SUBJECTS MANAGEMENT */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Subjects</span>
              <div className="text-3xl font-bold font-cinzel text-slate-900">{subjects.length} Subjects</div>
              <span className="text-[11px] text-blue-600 font-medium">Across Classes 1 - 8</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Core Academics</span>
              <div className="text-3xl font-bold font-cinzel text-emerald-600">{coreSubjectsCount} Courses</div>
              <span className="text-[11px] text-emerald-700">CBSE Mandatory Syllabus</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">STEM & Lab Sciences</span>
              <div className="text-3xl font-bold font-cinzel text-blue-600">{stemCount} Labs & Courses</div>
              <span className="text-[11px] text-blue-700">Practical & Research Wings</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Weekly Periods</span>
              <div className="text-3xl font-bold font-cinzel text-purple-600">{totalWeeklyPeriods} Periods</div>
              <span className="text-[11px] text-purple-700">Weekly Faculty Allocations</span>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by subject name, code (e.g. HIN-08)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Grade Filter:</span>
                </div>
                <select
                  value={selectedGradeFilter}
                  onChange={e => setSelectedGradeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="All">All Grades</option>
                  {allGradesList.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubjects.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 font-cinzel">No Subjects Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No school subjects match the filter or search query. Click "Add New Subject" to add to the school curriculum.
                </p>
                <button
                  onClick={() => setIsAddSubjectModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Add New Subject
                </button>
              </div>
            ) : (
              filteredSubjects.map(sub => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold text-xs border border-blue-200">
                        {sub.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {sub.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold font-cinzel text-slate-900">{sub.name}</h3>
                      <p className="text-xs text-blue-600 font-semibold">{sub.department}</p>
                    </div>

                    {sub.description && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {sub.description}
                      </p>
                    )}

                    {/* Grades Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Applicable Grades:</span>
                      <div className="flex flex-wrap gap-1">
                        {sub.grades.map(g => (
                          <span key={g} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-medium border border-slate-200">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>{sub.weeklyPeriods}</strong> Periods / Wk</span>
                      </div>
                      {sub.headTeacher && (
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700 truncate max-w-[130px]">{sub.headTeacher}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setEditingSubject(sub)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                      title="Edit Subject"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(sub.id, sub.name)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                      title="Delete Subject"
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

      {/* TAB 2: MASTER PERIOD TIMINGS & SCHEDULE DIRECTORATE */}
      {activeTab === 'periods' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Master Period Timing Slots Configuration</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Configure school bell timings for all periods (currently {periodSlots.length} slots). Set start & end times, add Period 8, 9 or zero periods.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingSlot(null);
                  const nextNum = String(periodSlots.length + 1).padStart(2, '0');
                  setSlotForm({
                    periodNumber: nextNum,
                    name: `Period ${nextNum}`,
                    startTime: '04:00 PM',
                    endTime: '04:50 PM',
                    type: 'lecture'
                  });
                  setIsAddSlotModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add More Period Slot</span>
              </button>
            </div>

            {/* Period Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {periodSlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 transition-all shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-mono font-bold text-xs border border-blue-200">
                        Slot #{index + 1} • Period {slot.periodNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          slot.type === 'break'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : slot.type === 'assembly'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {slot.type ? slot.type.toUpperCase() : 'LECTURE'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">{slot.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-blue-700 font-mono font-bold mt-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-slate-200/60">
                    <button
                      onClick={() => {
                        setEditingSlot(slot);
                        setSlotForm({
                          periodNumber: slot.periodNumber,
                          name: slot.name,
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                          type: slot.type || 'lecture'
                        });
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Timing</span>
                    </button>

                    <button
                      onClick={() => handleDeletePeriodSlot(slot.id, slot.name)}
                      className="p-1.5 rounded-lg bg-white hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer text-xs"
                      title="Delete Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      <Modal
        isOpen={isAddSubjectModalOpen}
        onClose={() => setIsAddSubjectModalOpen(false)}
        title="Add School Subject to Curriculum"
        subtitle="Configure academic syllabus, subject code, weekly periods and grade allocations"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject Name *</label>
              <input
                type="text"
                required
                value={subjectForm.name}
                onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                placeholder="e.g. Sanskrit or Computer Science"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={subjectForm.code}
                onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SKT-08"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department *</label>
              <select
                value={subjectForm.department}
                onChange={e => setSubjectForm({ ...subjectForm, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Languages & Literature">Languages & Literature</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Fine Arts & Performing">Fine Arts & Performing</option>
                <option value="Physical Education & Sports">Physical Education & Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Curriculum Category *</label>
              <select
                value={subjectForm.category}
                onChange={e => setSubjectForm({ ...subjectForm, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Core Academic">Core Academic</option>
                <option value="STEM & Sciences">STEM & Sciences</option>
                <option value="Languages & Literature">Languages & Literature</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Vocational & Tech">Vocational & Tech</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Weekly Periods *</label>
              <input
                type="number"
                min={1}
                max={15}
                required
                value={subjectForm.weeklyPeriods}
                onChange={e => setSubjectForm({ ...subjectForm, weeklyPeriods: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department Lead / Head Teacher</label>
              <select
                value={subjectForm.headTeacher}
                onChange={e => setSubjectForm({ ...subjectForm, headTeacher: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applicable Grades Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Applicable Grades (Click to toggle) *</label>
            <div className="flex flex-wrap gap-1.5">
              {allGradesList.map(grade => {
                const isSelected = subjectForm.grades.includes(grade);
                return (
                  <button
                    type="button"
                    key={grade}
                    onClick={() => handleToggleGrade(grade)}
                    className={`px-3 py-1 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Syllabus Overview & Description</label>
            <textarea
              rows={3}
              value={subjectForm.description}
              onChange={e => setSubjectForm({ ...subjectForm, description: e.target.value })}
              placeholder="Provide a brief summary of learning goals, textbooks, or practical requirements..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddSubjectModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              Add Subject to Curriculum
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT SUBJECT MODAL */}
      <Modal
        isOpen={editingSubject !== null}
        onClose={() => setEditingSubject(null)}
        title="Edit Subject Curriculum & Allocations"
        subtitle={`Updating details for ${editingSubject?.name} (${editingSubject?.code})`}
        maxWidth="lg"
      >
        {editingSubject && (
          <form onSubmit={handleUpdateSubject} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={editingSubject.code}
                  onChange={e => setEditingSubject({ ...editingSubject, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department *</label>
                <input
                  type="text"
                  required
                  value={editingSubject.department}
                  onChange={e => setEditingSubject({ ...editingSubject, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Curriculum Category *</label>
                <select
                  value={editingSubject.category}
                  onChange={e => setEditingSubject({ ...editingSubject, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  <option value="Core Academic">Core Academic</option>
                  <option value="STEM & Sciences">STEM & Sciences</option>
                  <option value="Languages & Literature">Languages & Literature</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Vocational & Tech">Vocational & Tech</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Weekly Periods *</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  required
                  value={editingSubject.weeklyPeriods}
                  onChange={e => setEditingSubject({ ...editingSubject, weeklyPeriods: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department Lead / Head Teacher</label>
                <select
                  value={editingSubject.headTeacher || ''}
                  onChange={e => setEditingSubject({ ...editingSubject, headTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Syllabus Overview & Description</label>
              <textarea
                rows={3}
                value={editingSubject.description || ''}
                onChange={e => setEditingSubject({ ...editingSubject, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ADD / EDIT PERIOD SLOT MODAL */}
      <Modal
        isOpen={isAddSlotModalOpen || editingSlot !== null}
        onClose={() => {
          setIsAddSlotModalOpen(false);
          setEditingSlot(null);
        }}
        title={editingSlot ? "Edit Period Timing Slot" : "Add New Period Slot to Master Schedule"}
        subtitle="Configure the period number, display title, start time, and end time"
        maxWidth="md"
      >
        <form onSubmit={handleSavePeriodSlot} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Period Number / Code *</label>
              <input
                type="text"
                required
                value={slotForm.periodNumber}
                onChange={e => setSlotForm({ ...slotForm, periodNumber: e.target.value })}
                placeholder="e.g. 08 or Zero"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Slot Display Name *</label>
              <input
                type="text"
                required
                value={slotForm.name}
                onChange={e => setSlotForm({ ...slotForm, name: e.target.value })}
                placeholder="e.g. Period 08 or Extra Remedial"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Time *</label>
              <input
                type="text"
                required
                value={slotForm.startTime}
                onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}
                placeholder="e.g. 04:00 PM"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Time *</label>
              <input
                type="text"
                required
                value={slotForm.endTime}
                onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })}
                placeholder="e.g. 04:50 PM"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Slot Category / Type</label>
            <select
              value={slotForm.type || 'lecture'}
              onChange={e => setSlotForm({ ...slotForm, type: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="lecture">Academic Lecture / Class</option>
              <option value="break">Recess / Lunch Break</option>
              <option value="assembly">Morning Assembly / Roll Call</option>
              <option value="remedial">Remedial / Extra Special Class</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAddSlotModalOpen(false);
                setEditingSlot(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              {editingSlot ? "Save Slot Timing" : "Add Period Slot"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
