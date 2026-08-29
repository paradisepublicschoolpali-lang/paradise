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
  Clock
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AdminSubjects: React.FC = () => {
  const {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    periodSlots,
    addPeriodSlot,
    updatePeriodSlot,
    deletePeriodSlot
  } = useSchoolData();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'subjects' | 'periods'>('subjects');

  // Subjects Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Subject Modals & Form
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SchoolSubject | null>(null);
  const [subjectFormName, setSubjectFormName] = useState('');

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

  // Filtering subjects by name
  const filteredSubjects = subjects.filter(sub =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = subjectFormName.trim();
    if (!trimmed) {
      toast('Please enter a Subject Name', '', 'error');
      return;
    }

    addSubject({ name: trimmed });
    toast('Subject Added', `"${trimmed}" registered successfully`, 'success');
    setIsAddSubjectModalOpen(false);
    setSubjectFormName('');
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    const trimmed = editingSubject.name.trim();
    if (!trimmed) {
      toast('Subject Name is required', '', 'error');
      return;
    }

    updateSubject(editingSubject.id, { name: trimmed });
    toast('Subject Updated', `Saved changes for "${trimmed}"`, 'success');
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      deleteSubject(id);
      toast('Subject Removed', `"${name}" removed from curriculum`, 'info');
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
      toast('Period Timing Updated', `Saved schedule for ${slotForm.name}`, 'success');
      setEditingSlot(null);
    } else {
      addPeriodSlot(slotForm);
      toast('New Period Slot Added', `${slotForm.name} added to timetable`, 'success');
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
    if (window.confirm(`Remove ${name} from master period schedule?`)) {
      deletePeriodSlot(id);
      toast('Period Slot Removed', `${name} removed`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold font-cinzel text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Subjects & Timetable Directorate</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage school curriculum subjects and period timetable slots
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'subjects'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Subjects ({subjects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('periods')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'periods'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Period Slots ({periodSlots.length})</span>
            </button>
          </div>

          {activeTab === 'subjects' ? (
            <button
              onClick={() => {
                setSubjectFormName('');
                setIsAddSubjectModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
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
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CLEAN SUBJECTS MANAGEMENT */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          {/* Top Bar: Clean Search + Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search subject by name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Curriculum: <strong>{subjects.length} Subjects Registered</strong></span>
            </div>
          </div>

          {/* Clean Modern Subjects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSubjects.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 font-cinzel">No Subjects Found</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {searchQuery ? `No subject matches "${searchQuery}"` : 'No school subjects added yet.'}
                </p>
                <button
                  onClick={() => setIsAddSubjectModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase cursor-pointer"
                >
                  Add Subject
                </button>
              </div>
            ) : (
              filteredSubjects.map(sub => (
                <div
                  key={sub.id}
                  className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                        {sub.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">Curriculum Subject</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingSubject(sub)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer"
                      title="Edit Subject Name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(sub.id, sub.name)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors cursor-pointer"
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

      {/* TAB 2: MASTER PERIOD TIMINGS */}
      {activeTab === 'periods' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Master Period Timing Slots Configuration</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Configure school bell timings for all period slots (currently {periodSlots.length} slots)
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
                <span>Add Period Slot</span>
              </button>
            </div>

            {/* Period Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {periodSlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-blue-400 transition-all shadow-2xs space-y-3 flex flex-col justify-between"
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
        title="Add New Subject"
        subtitle="Enter the name of the subject to include in the school curriculum"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Subject Name *</label>
            <input
              type="text"
              required
              value={subjectFormName}
              onChange={e => setSubjectFormName(e.target.value)}
              placeholder="e.g. Mathematics, Science, Computer, Music"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-blue-500"
              autoFocus
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
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Add Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT SUBJECT MODAL */}
      <Modal
        isOpen={editingSubject !== null}
        onClose={() => setEditingSubject(null)}
        title="Edit Subject Name"
        subtitle={`Update subject name for ${editingSubject?.name}`}
        maxWidth="md"
      >
        {editingSubject && (
          <form onSubmit={handleUpdateSubject} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Subject Name *</label>
              <input
                type="text"
                required
                value={editingSubject.name}
                onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-semibold focus:outline-none focus:border-blue-500"
                autoFocus
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
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Save Subject Name
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
        title={editingSlot ? "Edit Period Timing Slot" : "Add New Period Slot"}
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
