import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, BookOpen, Users, Clock, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

interface TeacherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveTab }) => {
  const { teachers, homework, submissions, gradeHomeworkSubmission } = useSchoolData();
  const { currentUser } = useAuth();
  const teacher = teachers[0];

  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [score, setScore] = useState(45);
  const [feedback, setFeedback] = useState('Excellent grasp of derivations.');

  const pendingSubmissions = submissions.filter(s => s.status === 'Submitted');

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    gradeHomeworkSubmission(selectedSub.id, score, feedback);
    setSelectedSub(null);
  };

  const todayClasses = [
    { period: '01', time: '08:30 - 09:20', grade: 'Grade 10', section: 'A', subject: 'Advanced Physics', topic: 'Electromagnetic Flux & Faraday Laws' },
    { period: '03', time: '10:30 - 11:20', grade: 'Grade 11', section: 'A', subject: 'Theoretical Physics', topic: 'Relativistic Velocity Addition' },
    { period: '05', time: '01:00 - 01:50', grade: 'Grade 12', section: 'A', subject: 'Quantum Concepts', topic: 'Photoelectric Work Functions' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Teacher Profile Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={teacher?.avatar || currentUser.avatar}
            alt={teacher?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-cinzel">{teacher?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {teacher?.designation}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Emp ID: <strong className="font-mono text-slate-700">{teacher?.employeeId}</strong> • {teacher?.department} • {teacher?.qualification}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('attendance')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Mark Class Roll Call</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 text-center">
          <span className="text-xs text-slate-500 font-semibold uppercase">Assigned Divisions</span>
          <div className="text-3xl font-bold font-cinzel text-slate-900">3 Classes</div>
          <span className="text-[11px] text-blue-600 font-medium">96 Total Scholars</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Today's Lectures</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">3 Periods</div>
          <span className="text-[11px] text-emerald-700">Next: Period 1 at 08:30 AM</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Pending Grading</span>
          <div className="text-3xl font-bold font-cinzel text-amber-600">{pendingSubmissions.length} Submissions</div>
          <span className="text-[11px] text-amber-700">Requires evaluation</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Department Batch GPA</span>
          <div className="text-3xl font-bold font-cinzel text-blue-600">3.88 / 4.0</div>
          <span className="text-[11px] text-blue-700">Top in STEM Board</span>
        </div>
      </div>

      {/* Grid: Schedule & Grading Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Today's Allocated Lectures</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">3 Batches</span>
          </div>

          <div className="space-y-3">
            {todayClasses.map(cls => (
              <div
                key={cls.period}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                      Period {cls.period}
                    </span>
                    <strong className="text-slate-900 text-sm">{cls.grade}-{cls.section}</strong>
                    <span className="text-blue-600 font-semibold">({cls.subject})</span>
                  </div>
                  <p className="text-slate-500 mt-1 text-[11px]">Topic: {cls.topic}</p>
                </div>
                <div className="font-mono text-slate-700 font-semibold shrink-0">{cls.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Grading Queue */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Pending Evaluations</span>
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              {pendingSubmissions.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingSubmissions.map(sub => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{sub.studentName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{sub.submissionDate}</span>
                </div>
                <div className="text-slate-500 font-mono text-[11px] truncate">{sub.fileName}</div>
                <button
                  onClick={() => setSelectedSub(sub)}
                  className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase transition-colors"
                >
                  Grade Submission
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Modal */}
      <Modal
        isOpen={selectedSub !== null}
        onClose={() => setSelectedSub(null)}
        title="Grade Assignment Solution"
        subtitle={selectedSub ? `Candidate: ${selectedSub.studentName} • ${selectedSub.fileName}` : ''}
        maxWidth="lg"
      >
        <form onSubmit={handleGrade} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Score / Marks (out of 50) *</label>
            <input
              type="number"
              required
              min={0}
              max={50}
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Faculty Feedback & Remarks</label>
            <textarea
              rows={3}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              Commit Grade
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
