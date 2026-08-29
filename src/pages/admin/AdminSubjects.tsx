import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { SchoolSubject } from '../../types';
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
  Info
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AdminSubjects: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, teachers } = useSchoolData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SchoolSubject | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Science & Research',
    category: 'Core Academic' as SchoolSubject['category'],
    grades: ['Class 6', 'Class 7', 'Class 8'],
    weeklyPeriods: 6,
    description: '',
    headTeacher: 'Dr. Alok Verma',
    status: 'Active' as SchoolSubject['status']
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

  // Filtering
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
    setFormData(prev => {
      const exists = prev.grades.includes(grade);
      return {
        ...prev,
        grades: exists ? prev.grades.filter(g => g !== grade) : [...prev.grades, grade]
      };
    });
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast('Please enter both Subject Name and Subject Code', '', 'error');
      return;
    }
    if (formData.grades.length === 0) {
      toast('Please select at least one applicable grade', '', 'error');
      return;
    }

    addSubject(formData);
    toast('Subject Added to Curriculum', `${formData.name} (${formData.code}) registered successfully`, 'success');
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      code: '',
      department: 'Science & Research',
      category: 'Core Academic',
      grades: ['Class 6', 'Class 7', 'Class 8'],
      weeklyPeriods: 6,
      description: '',
      headTeacher: 'Dr. Alok Verma',
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

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the school subject directory?`)) {
      deleteSubject(id);
      toast('Subject Removed', `${name} archived from curriculum`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>School Subjects & Curriculum Directorate</span>
          </h2>
          <p className="text-xs text-slate-500">
            Admin Directorate • Add, configure, and allocate CBSE subjects, lecture frequencies, and department leads
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

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
              placeholder="Search by subject name, code (e.g. MAT-08)..."
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
              No school subjects match the filter or search query. Click "Add New Subject" to add to the CBSE curriculum.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
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
                  onClick={() => handleDelete(sub.id, sub.name)}
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

      {/* ADD SUBJECT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mathematics & Applied Statistics"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MAT-08"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Science & Research">Science & Research</option>
                <option value="Mathematics & Calculus">Mathematics & Calculus</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Languages & Literature">Languages & Literature</option>
                <option value="Fine Arts & Performing">Fine Arts & Performing</option>
                <option value="Physical Education & Sports">Physical Education & Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Curriculum Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
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
                value={formData.weeklyPeriods}
                onChange={e => setFormData({ ...formData, weeklyPeriods: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department Lead / Head Teacher</label>
              <select
                value={formData.headTeacher}
                onChange={e => setFormData({ ...formData, headTeacher: e.target.value })}
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
                const isSelected = formData.grades.includes(grade);
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
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a brief summary of learning goals, textbooks, or practical lab requirements..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              Add Subject to School
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
    </div>
  );
};
