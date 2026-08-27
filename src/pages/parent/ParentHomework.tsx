import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Upload, CheckCircle2, Clock, FileText, Send } from 'lucide-react';
import { HomeworkItem } from '../../types';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const ParentHomework: React.FC = () => {
  const { homework, submitHomeworkSolution, submissions, students } = useSchoolData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [selectedHw, setSelectedHw] = useState<HomeworkItem | null>(null);
  const [solutionFile, setSolutionFile] = useState('Homework_Assignment_Solution.pdf');

  const student = students.find(s => s.id === currentUser.id || s.loginId === currentUser.loginId) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;

    submitHomeworkSolution({
      homeworkId: selectedHw.id,
      studentId: student.id,
      studentName: student.name,
      fileName: solutionFile
    });
    toast('Homework Solution Transmitted!', `Submitted for ${selectedHw.title}`, 'success');
    setSelectedHw(null);
  };

  const activeItems = homework.filter(h => h.status === 'Active');
  const closedItems = homework.filter(h => h.status === 'Closed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Homework & Academic Tasks</h3>
          <p className="text-xs text-slate-500">Daily assignments, problem sets, and solution uploads</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Active ({activeItems.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Archived ({closedItems.length})
          </button>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(activeTab === 'active' ? activeItems : closedItems).map(item => {
          const submission = submissions.find(s => s.homeworkId === item.id);

          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                    {item.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Max: {item.maxPoints} pts</span>
                </div>

                <h4 className="text-base font-bold font-cinzel text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Educator: <strong className="text-slate-800">{item.teacherName}</strong></span>
                  <span className="text-amber-700 font-mono font-medium">Due: {formatDate(item.dueDate)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                {submission ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Submitted ({submission.fileName})</span>
                    </div>
                    {submission.score && (
                      <span className="font-bold text-emerald-900 font-mono">{submission.score}/{item.maxPoints} pts</span>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedHw(item)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload & Submit Solution</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Solution Modal */}
      <Modal
        isOpen={selectedHw !== null}
        onClose={() => setSelectedHw(null)}
        title="Submit Assignment Solution"
        subtitle={selectedHw ? `${selectedHw.subject} • ${selectedHw.title}` : ''}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Attached Solution File</label>
            <input
              type="text"
              required
              value={solutionFile}
              onChange={e => setSolutionFile(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800">Submission Guidelines:</h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li>Formats supported: PDF, Python (.py), Word Document (.docx).</li>
              <li>Include your student name and roll number in header.</li>
              <li>Plagiarism threshold is strictly set at &lt; 5%.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSelectedHw(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm Submission</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
