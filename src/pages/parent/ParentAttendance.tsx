import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CalendarCheck, Send, CheckCircle2, AlertCircle, Plus, Clock, FileText } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const ParentAttendance: React.FC = () => {
  const { attendanceLogs, leaves, applyLeave, students } = useSchoolData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const student = students.find(s => s.id === currentUser.id || s.loginId === currentUser.loginId) || students[0];

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason) {
      toast('Please fill all leave fields', '', 'error');
      return;
    }

    applyLeave({
      studentId: student.id,
      studentName: student.name,
      grade: `${student.grade}-${student.section}`,
      fromDate,
      toDate,
      reason
    });

    toast('Leave Application Submitted Successfully!', 'Your leave request has been transmitted to the Academic Directorate for approval.', 'success');
    setFromDate('');
    setToDate('');
    setReason('');
    setIsLeaveModalOpen(false);
  };

  const presentCount = attendanceLogs.filter(a => a.status === 'Present').length;
  const lateCount = attendanceLogs.filter(a => a.status === 'Late').length;
  const absentCount = attendanceLogs.filter(a => a.status === 'Absent').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Apply Leave CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Attendance & Leave Management</h3>
          <p className="text-xs text-slate-500">
            Monitor daily classroom presence, attendance ledger, and submit formal leave requests
          </p>
        </div>

        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Present Days</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">{presentCount} Days</div>
          <span className="text-[11px] text-emerald-700">96.4% Regular Attendance</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Late Arrivals</span>
          <div className="text-3xl font-bold font-cinzel text-amber-600">{lateCount} Days</div>
          <span className="text-[11px] text-amber-700">Transit delay documented</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Medical Absences</span>
          <div className="text-3xl font-bold font-cinzel text-blue-600">{absentCount} Days</div>
          <span className="text-[11px] text-blue-700">Medical Slip Verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Leave Requests</span>
          <div className="text-3xl font-bold font-cinzel text-slate-900">{leaves.length} Filed</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {leaves.filter(l => l.status === 'Approved').length} Approved • {leaves.filter(l => l.status === 'Pending').length} Pending
          </span>
        </div>
      </div>

      {/* Leave Application Form Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Submit Student Leave Application</span>
          </h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            Parent / Student Portal
          </span>
        </div>

        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Leave From Date *</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Leave To Date *</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reason for Absence & Details *</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="State medical illness, family emergency, or external Olympiad / tournament..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Leave Applications History */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>My Leave Applications Status</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Applied Date</th>
                <th className="py-3 px-4 font-semibold">Leave Duration</th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No leave requests submitted yet.
                  </td>
                </tr>
              ) : (
                leaves.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{formatDate(l.appliedDate)}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {formatDate(l.fromDate)} → {formatDate(l.toDate)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{l.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Attendance History */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100">
          Daily Roll History Log
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Class / Division</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attendanceLogs.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium">{formatDate(record.date)}</td>
                  <td className="py-3 px-4">{record.grade}-{record.section}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        record.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.status === 'Late'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{record.remarks || 'Regular classroom presence'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Student Leave"
        subtitle={`Filing formal leave for ${student.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">From Date *</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">To Date *</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reason for Absence *</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="State medical illness, family emergency, or external Olympiad / tournament..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
            >
              Submit Leave
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
