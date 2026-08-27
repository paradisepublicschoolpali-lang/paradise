import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { HomeworkItem, HomeworkSubmission } from '../../types';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  FileCheck2,
  Paperclip,
  Save,
  Filter
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AdminHomework: React.FC = () => {
  const { homework, addHomework, updateHomework, deleteHomework, submissions, gradeHomeworkSubmission } = useSchoolData();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHw, setEditingHw] = useState<HomeworkItem | null>(null);
  const [gradingSub, setGradingSub] = useState<HomeworkSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState(45);
  const [gradeFeedback, setGradeFeedback] = useState('Exceptional work and clear problem analysis.');

  // New Homework Form State
  const [newHwData, setNewHwData] = useState({
    title: '',
    subject: 'Science & Physics',
    grade: 'Grade 8',
    section: 'A',
    teacherName: 'Academic Directorate',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    description: '',
    maxPoints: 50,
    attachments: ['https://example.com/curriculum-spec.pdf']
  });

  const grades = ['All', 'Nursery', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  const filteredHomework = homework.filter(h => {
    const matchesGrade = selectedGrade === 'All' || h.grade.toLowerCase() === selectedGrade.toLowerCase();
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleCreateHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwData.title || !newHwData.description) {
      toast('Please fill in title and description', '', 'error');
      return;
    }

    addHomework({
      title: newHwData.title,
      subject: newHwData.subject,
      grade: newHwData.grade,
      section: newHwData.section,
      teacherName: newHwData.teacherName,
      dueDate: newHwData.dueDate,
      description: newHwData.description,
      maxPoints: Number(newHwData.maxPoints),
      attachments: newHwData.attachments
    });

    toast('Homework Assignment Dispatched!', `Assigned "${newHwData.title}" to ${newHwData.grade}-${newHwData.section}`, 'success');
    setIsAddModalOpen(false);
    setNewHwData({
      title: '',
      subject: 'Science & Physics',
      grade: 'Grade 8',
      section: 'A',
      teacherName: 'Academic Directorate',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      description: '',
      maxPoints: 50,
      attachments: ['https://example.com/curriculum-spec.pdf']
    });
  };

  const handleUpdateHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHw) return;
    updateHomework(editingHw.id, editingHw);
    toast('Assignment Updated!', `Saved changes for ${editingHw.title}`, 'success');
    setEditingHw(null);
  };

  const handleDeleteHw = (id: string, title: string) => {
    if (window.confirm(`Delete assignment "${title}"?`)) {
      deleteHomework(id);
      toast('Assignment Deleted', `Removed from curriculum queue`, 'info');
    }
  };

  const handleGradeSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;
    gradeHomeworkSubmission(gradingSub.id, Number(gradeScore), gradeFeedback);
    toast('Submission Evaluated!', `Graded ${gradingSub.studentName}'s submission with score ${gradeScore}`, 'success');
    setGradingSub(null);
  };

  const activeCount = homework.filter(h => h.status === 'Active').length;
  const pendingSubs = submissions.filter(s => s.status === 'Submitted');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Homework & Curriculum Directorate</h3>
          <p className="text-xs text-slate-500">
            Central authority for assignments, academic problem sets, and student project submissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'assignments' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assignments ({homework.length})
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'submissions' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Submissions</span>
              {pendingSubs.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                  {pendingSubs.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Assignments</span>
          <div className="text-3xl font-bold font-cinzel text-slate-900">{homework.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">{activeCount} Active Current Tasks</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Turned-in Solutions</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">{submissions.length}</div>
          <span className="text-[11px] text-emerald-700">Digital Uploads Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Pending Evaluation</span>
          <div className="text-3xl font-bold font-cinzel text-amber-600">{pendingSubs.length}</div>
          <span className="text-[11px] text-amber-700">Awaiting Grade & Feedback</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Average Score</span>
          <div className="text-3xl font-bold font-cinzel text-purple-600">46.8 / 50</div>
          <span className="text-[11px] text-purple-700">93.6% Accuracy Rate</span>
        </div>
      </div>

      {activeTab === 'assignments' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedGrade === g
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search assignments, subjects..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHomework.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {item.grade} - {item.section} • {item.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">{item.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Due: {item.dueDate}</span>
                    </span>
                    <span>Max: {item.maxPoints} pts</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingHw({ ...item })}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                      title="Edit Assignment"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHw(item.id, item.title)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Submissions View */
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Student Turn-in Submissions Queue</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              Total Submissions: {submissions.length}
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Scholar Name</th>
                  <th className="py-3 px-4 font-semibold">Uploaded File</th>
                  <th className="py-3 px-4 font-semibold text-center">Submission Date</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-center">Score</th>
                  <th className="py-3 px-4 font-semibold">Feedback Remarks</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">{sub.studentName}</td>
                    <td className="py-3 px-4 font-mono text-blue-600">
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{sub.fileName || 'Solution_Submission.pdf'}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{sub.submissionDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'Graded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-700">
                      {sub.score !== undefined ? `${sub.score} pts` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[220px] truncate text-[11px]">
                      {sub.feedback || 'Pending evaluation'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setGradingSub(sub);
                          setGradeScore(sub.score || 45);
                          setGradeFeedback(sub.feedback || 'Excellent grasp of derivations.');
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase transition-colors cursor-pointer"
                      >
                        {sub.status === 'Graded' ? 'Re-evaluate' : 'Grade Solution'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Homework Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create & Assign New Homework / Task"
        subtitle="Broadcast problem set to all scholars in division"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateHw} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              value={newHwData.title}
              onChange={e => setNewHwData({ ...newHwData, title: e.target.value })}
              placeholder="e.g. Thermodynamics & Heat Flow Derivations"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Grade</label>
              <select
                value={newHwData.grade}
                onChange={e => setNewHwData({ ...newHwData, grade: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Section</label>
              <input
                type="text"
                value={newHwData.section}
                onChange={e => setNewHwData({ ...newHwData, section: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Max Points</label>
              <input
                type="number"
                value={newHwData.maxPoints}
                onChange={e => setNewHwData({ ...newHwData, maxPoints: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={newHwData.subject}
                onChange={e => setNewHwData({ ...newHwData, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Submission Due Date</label>
              <input
                type="date"
                value={newHwData.dueDate}
                onChange={e => setNewHwData({ ...newHwData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Instructions & Problem Description *</label>
            <textarea
              rows={3}
              required
              value={newHwData.description}
              onChange={e => setNewHwData({ ...newHwData, description: e.target.value })}
              placeholder="State chapter references, problem set guidelines..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
            >
              Dispatch Homework
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Homework Modal */}
      <Modal
        isOpen={editingHw !== null}
        onClose={() => setEditingHw(null)}
        title="Edit Assignment Details"
        subtitle={editingHw ? `${editingHw.title}` : ''}
        maxWidth="lg"
      >
        {editingHw && (
          <form onSubmit={handleUpdateHw} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assignment Title</label>
              <input
                type="text"
                required
                value={editingHw.title}
                onChange={e => setEditingHw({ ...editingHw, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  value={editingHw.dueDate}
                  onChange={e => setEditingHw({ ...editingHw, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={editingHw.status}
                  onChange={e => setEditingHw({ ...editingHw, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed / Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={editingHw.description}
                onChange={e => setEditingHw({ ...editingHw, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingHw(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        isOpen={gradingSub !== null}
        onClose={() => setGradingSub(null)}
        title="Evaluate Scholar Solution Submission"
        subtitle={gradingSub ? `${gradingSub.studentName} • ${gradingSub.fileName}` : ''}
        maxWidth="lg"
      >
        {gradingSub && (
          <form onSubmit={handleGradeSubmission} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Score / Marks (out of 50) *</label>
              <input
                type="number"
                min={0}
                max={50}
                required
                value={gradeScore}
                onChange={e => setGradeScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Directorate Feedback & Remarks</label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={e => setGradeFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGradingSub(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider"
              >
                Commit Score & Publish Feedback
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
