import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserCheck,
  DollarSign,
  FileCheck2,
  Shield,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { students, teachers, admissions, fees, leaves, results, homework, updateAdmissionStatus } = useSchoolData();
  const { currentUser } = useAuth();

  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.paidAmount, 0) + 2450000;
  const pendingAdmissions = admissions.filter(a => a.status === 'Pending' || a.status === 'Under Review');
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  const handleQuickStatus = (id: string, status: any) => {
    updateAdmissionStatus(id, status);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Principal Directorate Welcome */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-cinzel">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                Supreme Directorate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Academic Session 2026-2027 • Central School Command Center
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('results')}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Gradebook Controller</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Attendance Master</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            Review Enrolment Queue
          </button>
        </div>
      </div>

      {/* Institutional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Enrolment</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-cinzel text-slate-900">{students.length} Scholars</div>
          <span className="text-[11px] text-emerald-600 font-medium">99.4% Active Attendance</span>
        </div>

        {/* Total Faculty */}
        <div
          onClick={() => setActiveTab('teachers')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Faculty Staff</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-cinzel text-slate-900">{teachers.length} Faculty</div>
          <span className="text-[11px] text-emerald-700">14:1 Scholar-Teacher Ratio</span>
        </div>

        {/* Academic Gradebook & Results */}
        <div
          onClick={() => setActiveTab('results')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Academic Gradebook</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-cinzel text-purple-700">{results.length} Transcripts</div>
          <span className="text-[11px] text-purple-700">3.88 Average GPA Score</span>
        </div>

        {/* Revenue Collections */}
        <div
          onClick={() => setActiveTab('fees')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Revenue Collections</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-cinzel text-blue-600">{formatCurrency(totalCollected)}</div>
          <span className="text-[11px] text-emerald-600 font-medium">96.2% On-Time Settlement</span>
        </div>
      </div>

      {/* Grid: Pending Leave Requests Alert + Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Leaves Alert Box */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              <span>Leave Applications Awaiting Review</span>
            </h3>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              View Full Register →
            </button>
          </div>

          {pendingLeaves.length > 0 ? (
            <div className="space-y-3">
              {pendingLeaves.map(leave => (
                <div
                  key={leave.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{leave.studentName} ({leave.grade})</div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{leave.reason}</p>
                    <span className="text-[10px] font-mono text-slate-400">Duration: {leave.fromDate} → {leave.toDate}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase shrink-0 cursor-pointer"
                  >
                    Review Leave
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <span>All student leave applications have been reviewed.</span>
            </div>
          )}
        </div>

        {/* Central Homework & Tasks Directorate Box */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Homework & Curriculum Central</span>
            </h3>
            <button
              onClick={() => setActiveTab('homework')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Manage Curriculum →
            </button>
          </div>

          <div className="space-y-3">
            {homework.slice(0, 3).map(hw => (
              <div
                key={hw.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{hw.title}</div>
                  <span className="text-[10px] font-mono text-blue-600 font-semibold">{hw.grade}-{hw.section} • {hw.subject}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">Due: {hw.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admissions Queue Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <span>Recent Online Admissions Submissions</span>
          </h3>
          <button
            onClick={() => setActiveTab('admissions')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            View Full Bureau
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Application #</th>
                <th className="py-3 px-4 font-semibold">Applicant Name</th>
                <th className="py-3 px-4 font-semibold">Grade Applying</th>
                <th className="py-3 px-4 font-semibold">Guardian Phone</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {admissions.slice(0, 4).map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{app.applicationNo}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{app.applicantName}</td>
                  <td className="py-3 px-4">{app.gradeApplying}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{app.parentPhone}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleQuickStatus(app.id, 'Interview Scheduled')}
                        className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold cursor-pointer"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleQuickStatus(app.id, 'Accepted')}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold cursor-pointer"
                      >
                        Accept
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
