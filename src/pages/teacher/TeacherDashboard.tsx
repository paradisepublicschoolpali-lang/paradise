import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, BookOpen, Users, Clock, Award, CheckCircle2, ArrowRight, GraduationCap } from 'lucide-react';

interface TeacherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveTab }) => {
  const { teachers, students, results } = useSchoolData();
  const { currentUser } = useAuth();
  const teacher = teachers.find(t => t.id === currentUser.id || t.loginId === currentUser.loginId) || teachers[0];

  const todayClasses = [
    { period: '01', time: '08:30 - 09:20', grade: 'Grade 8', section: 'A', subject: 'General Science', topic: 'Force, Pressure & Atmospheric Dynamics' },
    { period: '03', time: '10:30 - 11:20', grade: 'Grade 7', section: 'A', subject: 'Physical Science', topic: 'Heat, Thermodynamics & Transfer' },
    { period: '05', time: '01:00 - 01:50', grade: 'Grade 6', section: 'B', subject: 'Introduction to Physics', topic: 'Motion, Distances & Measurement' },
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Mark Class Roll Call</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Enter Unit Marks</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('classes')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs cursor-pointer space-y-1 text-center transition-all"
        >
          <span className="text-xs text-slate-500 font-semibold uppercase">Assigned Divisions</span>
          <div className="text-3xl font-bold font-cinzel text-slate-900">3 Classes</div>
          <span className="text-[11px] text-blue-600 font-medium">96 Total Scholars</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Today's Lectures</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">3 Periods</div>
          <span className="text-[11px] text-emerald-700">Next: Period 1 at 08:30 AM</span>
        </div>

        <div
          onClick={() => setActiveTab('results')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs cursor-pointer text-center space-y-1 transition-all"
        >
          <span className="text-xs text-slate-500 font-semibold uppercase">Published Marks</span>
          <div className="text-3xl font-bold font-cinzel text-blue-600">{results.length} Transcripts</div>
          <span className="text-[11px] text-blue-700">Unit Tests & Mid-Terms</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Department Batch GPA</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">3.88 / 4.0</div>
          <span className="text-[11px] text-emerald-700">Top in STEM Board</span>
        </div>
      </div>

      {/* Grid: Allocated Lectures & Allocated Class Syllabus */}
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

        {/* Assigned Division Rosters Shortcut */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Allocated Divisions</span>
            </h3>
            <button
              onClick={() => setActiveTab('classes')}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              View Roster →
            </button>
          </div>

          <div className="space-y-3">
            {(teacher?.assignedClasses || [
              { grade: 'Grade 8', section: 'A', subject: 'General Science' },
              { grade: 'Grade 7', section: 'A', subject: 'Physical Science' },
              { grade: 'Grade 6', section: 'B', subject: 'Nature Science' }
            ]).map((cls, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{cls.grade} - {cls.section}</div>
                  <div className="text-[11px] text-blue-600 font-semibold">{cls.subject}</div>
                </div>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px] uppercase cursor-pointer"
                >
                  Roll Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
