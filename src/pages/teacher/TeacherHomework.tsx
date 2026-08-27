import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Plus, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const TeacherHomework: React.FC = () => {
  const { homework, addHomework, submissions, gradeHomeworkSubmission } = useSchoolData();
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [score, setScore] = useState(45);
  const [feedback, setFeedback] = useState('Excellent work.');

  // New Homework Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General Science');
  const [grade, setGrade] = useState('Grade 8');
  const [section, setSection] = useState('A');
  const [dueDate, setDueDate] = useState('2026-09-05');
  const [description, setDescription] = useState('');
  const [maxPoints, setMaxPoints] = useState(50);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast('Please enter title and description', '', 'error');
      return;
    }

    addHomework({
      title,
      subject,
      grade,
      section,
      teacherName: 'Dr. Sarah Jenkins',
      dueDate,
      description,
      maxPoints
    });

    toast('Homework Task Assigned!', `Dispatched to ${grade}-${section}`, 'success');
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    gradeHomeworkSubmission(selectedSub.id, score, feedback);
    toast('Grade Recorded', `Score ${score} committed for ${selectedSub.studentName}`, 'success');
    setSelectedSub(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Homework & Task Assigner</h3>
          <p className="text-xs text-slate-500">Publish problem sets and evaluate submissions</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Homework</span>
        </button>
      </div>

      {/* Active Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {homework.map(item => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                {item.subject}
              </span>
              <span className="text-xs text-slate-500 font-mono">Due: {formatDate(item.dueDate)}</span>
            </div>

            <h4 className="text-base font-bold font-cinzel text-slate-900">{item.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Target: <strong className="text-slate-800">{item.grade}-{item.section}</strong></span>
              <span className="font-mono">{item.maxPoints} Maximum Points</span>
            </div>
          </div>
        ))}
      </div>

      {/* Student Submissions */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100">
          Student Submission Review Center
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Scholar</th>
                <th className="py-3 px-4 font-semibold">Submitted File</th>
                <th className="py-3 px-4 font-semibold">Submission Date</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Score</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sub.studentName}</td>
                  <td className="py-3.5 px-4 font-mono text-blue-600">{sub.fileName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{sub.submissionDate}</td>
                  <td className="py-3.5 px-4 text-center">
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
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    {sub.score ? `${sub.score} pts` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        setScore(sub.score || 45);
                        setFeedback(sub.feedback || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-xs font-semibold"
                    >
                      {sub.status === 'Graded' ? 'Edit Grade' : 'Grade File'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Homework Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign New Homework"
        subtitle="Set task description, points, and deadline"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Electromagnetic Induction Lab Report"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Task Instructions & Questions *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide exact questions, chapter references, and submission rules..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              Publish Homework
            </button>
          </div>
        </form>
      </Modal>

      {/* Grade Modal */}
      <Modal
        isOpen={selectedSub !== null}
        onClose={() => setSelectedSub(null)}
        title="Grade Assignment Solution"
        subtitle={selectedSub ? `Scholar: ${selectedSub.studentName}` : ''}
        maxWidth="lg"
      >
        <form onSubmit={handleGrade} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Score (out of 50)</label>
            <input
              type="number"
              required
              min={0}
              max={50}
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Feedback</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedSub(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider"
            >
              Save Grade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
