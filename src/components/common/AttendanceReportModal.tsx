import React, { useState } from 'react';
import { Student, AttendanceRecord } from '../../types';
import {
  calculateDateRange,
  getStudentAttendanceRecords,
  downloadStudentAttendanceCSV,
  downloadClassAttendanceCSV,
  AttendanceRangeType
} from '../../utils/attendanceExport';
import {
  CalendarCheck,
  Download,
  Printer,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Logo } from './Logo';

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
  classSection?: string;
  allStudents?: Student[];
  existingLogs: AttendanceRecord[];
  isTeacherOrAdminView?: boolean;
}

export const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({
  isOpen,
  onClose,
  student,
  classSection,
  allStudents = [],
  existingLogs,
  isTeacherOrAdminView = false
}) => {
  const [rangeType, setRangeType] = useState<AttendanceRangeType>('30days');
  const [singleDate, setSingleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customFrom, setCustomFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [customTo, setCustomTo] = useState(() => new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const targetStudent = student || allStudents[0];
  const { startDate, endDate, label: rangeLabel } = calculateDateRange(
    rangeType,
    singleDate,
    customFrom,
    customTo
  );

  const { items, summary } = targetStudent
    ? getStudentAttendanceRecords(targetStudent, existingLogs, startDate, endDate)
    : { items: [], summary: { rangeLabel: '', startDate: '', endDate: '', totalWorkingDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, excusedDays: 0, attendanceRate: 0 } };

  const handleDownloadCSV = () => {
    if (isTeacherOrAdminView && classSection && allStudents.length > 0) {
      downloadClassAttendanceCSV(
        classSection,
        allStudents,
        existingLogs,
        startDate,
        endDate,
        rangeLabel
      );
    } else if (targetStudent) {
      downloadStudentAttendanceCSV(targetStudent, items, summary, rangeLabel);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-cinzel">
                {isTeacherOrAdminView ? `Class Register Export: ${classSection || 'Division'}` : `Attendance Dossier: ${targetStudent?.name}`}
              </h3>
              <p className="text-xs text-slate-300">
                Official Attendance Ledger • Select timeframe from 1 Day to Full Semester
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timeframe Selector Pill Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Select Duration:</span>
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: '1day', label: '1 Day (Single)' },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: 'term', label: 'Academic Term (90D)' },
                { id: 'semester', label: 'Whole Semester' },
                { id: 'custom', label: 'Custom Range' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRangeType(opt.id as AttendanceRangeType)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    rangeType === opt.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker Controls */}
          {rangeType === '1day' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium text-[11px]">Date:</span>
              <input
                type="date"
                value={singleDate}
                onChange={e => setSingleDate(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 bg-white"
              />
            </div>
          )}

          {rangeType === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 bg-white"
              />
              <span className="text-slate-400">→</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs text-slate-900 bg-white"
              />
            </div>
          )}
        </div>

        {/* Modal Printable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-900" id="printable-attendance-dossier">
          {/* Formal School Letterhead */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <div>
                <h2 className="text-xl font-bold font-cinzel text-slate-900">Paradise Public School</h2>
                <p className="text-xs text-slate-500">Official Directorate of Academic Attendance & Scholar Registry</p>
                <p className="text-[10px] text-slate-400 font-mono">Affiliation: PPS-CBSE-992140 / CAMBRIDGE-IB-884</p>
              </div>
            </div>

            <div className="text-right sm:text-right font-mono text-xs space-y-1">
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-block">
                Verified Ledger • {rangeLabel}
              </div>
              <p className="text-slate-500 text-[11px]">Window: {startDate} to {endDate}</p>
            </div>
          </div>

          {/* Scholar Biodata Card */}
          {targetStudent && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Scholar Name</span>
                <strong className="text-slate-900 text-sm font-semibold">{targetStudent.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
                <span className="text-slate-800 font-semibold">{targetStudent.grade} - {targetStudent.section}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Admission / Roll No</span>
                <span className="font-mono text-blue-700 font-bold">{targetStudent.admissionNo} • Roll: {targetStudent.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">House / Guardian</span>
                <span className="text-slate-800">{targetStudent.house} ({targetStudent.guardianName})</span>
              </div>
            </div>
          )}

          {/* Summary Metric Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Working Days</span>
              <div className="text-2xl font-bold font-cinzel text-slate-900">{summary.totalWorkingDays} Days</div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Present Count</span>
              <div className="text-2xl font-bold font-cinzel text-emerald-700">{summary.presentDays} Days</div>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
              <span className="text-[10px] uppercase font-bold text-red-700 block">Absences</span>
              <div className="text-2xl font-bold font-cinzel text-red-700">{summary.absentDays} Days</div>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Late / Excused</span>
              <div className="text-2xl font-bold font-cinzel text-amber-700">{summary.lateDays + summary.excusedDays} Days</div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Presence Percentage</span>
              <div className="text-2xl font-bold font-cinzel text-blue-700">{summary.attendanceRate}%</div>
            </div>
          </div>

          {/* Daily Attendance Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Daily Roll Breakdown Log ({items.length} School Days)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">Excluding School Weekends</span>
            </div>

            <div className="max-h-72 overflow-y-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Date</th>
                    <th className="py-2.5 px-4 font-semibold">Day</th>
                    <th className="py-2.5 px-4 font-semibold">Class</th>
                    <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                    <th className="py-2.5 px-4 font-semibold">Remarks & Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-4 font-mono font-semibold text-slate-900">{item.date}</td>
                      <td className="py-2 px-4 text-slate-600">{item.dayOfWeek}</td>
                      <td className="py-2 px-4 font-mono text-slate-500">{item.grade}-{item.section}</td>
                      <td className="py-2 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'Excused'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-slate-500 text-[11px]">{item.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formal Directorate Sign-off Block */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">Paradise Public School Directorate</p>
              <p className="text-[10px]">Generated electronically via School Information Network on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            </div>

            <div className="flex items-center gap-8 text-center">
              <div className="space-y-1">
                <div className="h-8 border-b border-slate-400 w-32 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Class Faculty Sign</span>
              </div>
              <div className="space-y-1">
                <div className="h-8 border-b border-slate-400 w-32 mx-auto" />
                <span className="text-[10px] uppercase font-bold text-slate-600 block">Principal Seal & Sign</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
