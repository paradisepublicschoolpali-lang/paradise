import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck,
  GraduationCap,
  Bell,
  CreditCard,
  Clock,
  ArrowRight,
  Printer,
  Award,
  BookOpen
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { PaymentModal } from '../../components/common/PaymentModal';
import { ReportCardModal } from '../../components/common/ReportCardModal';
import { FeeItem, ExamResult } from '../../types';

interface ParentDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ setActiveTab }) => {
  const { students, results, fees, notices } = useSchoolData();
  const { currentUser } = useAuth();

  const [activePaymentModal, setActivePaymentModal] = useState<FeeItem | null>(null);
  const [activeReportModal, setActiveReportModal] = useState<ExamResult | null>(null);

  const student = students.find(s => s.id === currentUser.id || s.loginId === currentUser.loginId) || students[0];
  
  // Only get fees for this specific student
  const studentFees = fees.filter(f => f.studentId === student?.id || f.studentName === student?.name);
  const pendingFees = studentFees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  
  // Student's specific exam result
  const latestResult = results.find(r => r.studentId === student?.id || r.studentName === student?.name) || results[0];

  const todaySchedule = [
    { period: '01', time: '08:30 - 09:20', subject: 'General & Physical Science', teacher: 'Mrs. Sunita Verma', room: 'Science Lab 1' },
    { period: '02', time: '09:25 - 10:15', subject: 'Mathematics & Geometry', teacher: 'Mr. Rajesh Iyer', room: 'Room 104' },
    { period: '03', time: '10:30 - 11:20', subject: 'English Literature & Rhetoric', teacher: 'Mrs. Anjali Sharma', room: 'Room 108' },
    { period: '04', time: '11:25 - 12:15', subject: 'Social Science & Civics', teacher: 'Mr. David Vance', room: 'Room 102' },
    { period: '05', time: '01:00 - 01:50', subject: 'Junior Robotics & Coding', teacher: 'Dr. Vikramaditya Sen', room: 'Innovation Lab' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Student Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={student?.avatar || currentUser.avatar}
            alt={student?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-cinzel">{student?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {student?.house}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {student?.grade} • Section {student?.section} • Roll No: {student?.rollNo} • Admission: {student?.admissionNo}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Guardian: <strong className="text-slate-700">{student?.guardianName}</strong> ({student?.guardianPhone})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Apply for Leave</span>
          </button>

          {latestResult && (
            <button
              onClick={() => setActiveReportModal(latestResult)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Report Card</span>
            </button>
          )}

          {pendingFees.length > 0 && (
            <button
              onClick={() => setActivePaymentModal(pendingFees[0])}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Fees ({formatCurrency(pendingFees[0].totalAmount)})</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Attendance Rate</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-cinzel">{student?.attendanceRate}%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Regular presence recorded</span>
        </div>

        {/* GPA */}
        <div
          onClick={() => setActiveTab('results')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Academic Standing</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-cinzel">{student?.gpa} / 4.0</div>
          <span className="text-[11px] text-blue-600 font-medium">Rank {latestResult?.rank || 2} • {latestResult?.overallGrade || 'Distinction A1'}</span>
        </div>

        {/* Notices Count */}
        <div
          onClick={() => setActiveTab('notices')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">School Circulars</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-cinzel">{notices.length} Notices</div>
          <span className="text-[11px] text-purple-600 font-medium">PTM & CBSE updates</span>
        </div>

        {/* Fee Status */}
        <div
          onClick={() => setActiveTab('fees')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer space-y-2 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Tuition Ledger</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-cinzel">
            {pendingFees.length > 0 ? formatCurrency(pendingFees[0].totalAmount) : 'Settled'}
          </div>
          <span className={`text-[11px] font-medium ${pendingFees.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {pendingFees.length > 0 ? `${pendingFees[0].term} due ${formatDate(pendingFees[0].dueDate)}` : 'All term fees cleared'}
          </span>
        </div>
      </div>

      {/* Main Grid: Schedule & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Timetable */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Today's Academic Timetable</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">5 Periods</span>
          </div>

          <div className="space-y-2.5">
            {todaySchedule.map(period => (
              <div
                key={period.period}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold font-mono flex items-center justify-center text-xs">
                    {period.period}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900">{period.subject}</h4>
                    <span className="text-slate-500 text-[11px]">{period.teacher}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-slate-700 font-semibold">{period.time}</div>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">{period.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Circulars / Announcements */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Recent Circulars & Notices</span>
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map(n => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded">{n.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{formatDate(n.date)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('notices')}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All Official Circulars</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        feeItem={activePaymentModal}
        isOpen={activePaymentModal !== null}
        onClose={() => setActivePaymentModal(null)}
      />

      <ReportCardModal
        result={activeReportModal}
        isOpen={activeReportModal !== null}
        onClose={() => setActiveReportModal(null)}
      />
    </div>
  );
};
