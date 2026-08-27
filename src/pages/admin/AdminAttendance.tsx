import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { AttendanceRecord, LeaveApplication, Student } from '../../types';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Users,
  FileText,
  Filter,
  Download,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';
import { AttendanceReportModal } from '../../components/common/AttendanceReportModal';
import {
  calculateDateRange,
  downloadClassAttendanceCSV,
  downloadStudentAttendanceCSV,
  AttendanceRangeType
} from '../../utils/attendanceExport';

export const AdminAttendance: React.FC = () => {
  const { students, attendanceLogs, markAttendanceBulk, leaves, updateLeaveStatus } = useSchoolData();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState<'daily' | 'leaves'>('daily');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Daily attendance state mapping (studentId -> status)
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceRecord['status']>>({});

  // Initialize or sync attendance state when date or grade changes
  React.useEffect(() => {
    const map: Record<string, AttendanceRecord['status']> = {};
    students.forEach(s => {
      const existing = attendanceLogs.find(l => l.studentId === s.id && l.date === selectedDate);
      map[s.id] = existing ? existing.status : 'Present';
    });
    setAttendanceState(map);
  }, [students, attendanceLogs, selectedDate]);

  const grades = ['All', 'Nursery', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  const filteredStudents = students.filter(s => {
    const matchesGrade = selectedGrade === 'All' || s.grade.toLowerCase() === selectedGrade.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.loginId && s.loginId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: AttendanceRecord['status']) => {
    const next: Record<string, AttendanceRecord['status']> = { ...attendanceState };
    filteredStudents.forEach(s => {
      next[s.id] = status;
    });
    setAttendanceState(next);
    toast(`Marked all ${filteredStudents.length} visible scholars as ${status}`, '', 'info');
  };

  const handleSaveAttendance = () => {
    const records = filteredStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      status: attendanceState[s.id] || 'Present'
    }));

    markAttendanceBulk(records);
    toast('Attendance Roll Saved!', `Successfully locked attendance for ${records.length} scholars on ${selectedDate}`, 'success');
  };

  const handleLeaveDecision = (leaveId: string, status: 'Approved' | 'Rejected') => {
    updateLeaveStatus(leaveId, status);
    toast(`Leave Application ${status}`, `Updated leave dossier`, status === 'Approved' ? 'success' : 'info');
  };

  const handleQuickDownloadCSV = (range: AttendanceRangeType) => {
    const { startDate, endDate, label } = calculateDateRange(range, selectedDate);
    downloadClassAttendanceCSV(
      selectedGrade === 'All' ? 'School-Wide Directory' : selectedGrade,
      filteredStudents,
      attendanceLogs,
      startDate,
      endDate,
      label
    );
    toast('Attendance Register CSV Downloaded!', `Exported register for ${label}`, 'success');
  };

  // Stats calculation
  const totalScholars = filteredStudents.length || 1;
  const presentCount = filteredStudents.filter(s => (attendanceState[s.id] || 'Present') === 'Present').length;
  const absentCount = filteredStudents.filter(s => attendanceState[s.id] === 'Absent').length;
  const lateCount = filteredStudents.filter(s => attendanceState[s.id] === 'Late').length;
  const presencePercentage = Math.round((presentCount / totalScholars) * 100);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Attendance Ledger & Leave Governance</h3>
          <p className="text-xs text-slate-500">
            School-wide daily attendance matrix, attendance override, 1-day to full semester download, and leave approval desk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveView('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'daily' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Register
            </button>
            <button
              onClick={() => setActiveView('leaves')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'leaves' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Leave Applications</span>
              {pendingLeaves.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                  {pendingLeaves.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeView === 'daily' ? (
        <>
          {/* Attendance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Daily Presence Rate</span>
              <div className="text-3xl font-bold font-cinzel text-emerald-600">{presencePercentage}%</div>
              <span className="text-[11px] text-emerald-700">{presentCount} Present in Campus</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Unexcused Absences</span>
              <div className="text-3xl font-bold font-cinzel text-red-600">{absentCount}</div>
              <span className="text-[11px] text-red-700">SMS Alerts Dispatched</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Late Arrivals</span>
              <div className="text-3xl font-bold font-cinzel text-amber-600">{lateCount}</div>
              <span className="text-[11px] text-amber-700">Recorded with Security Gate</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Pending Leaves</span>
              <div className="text-3xl font-bold font-cinzel text-blue-600">{pendingLeaves.length}</div>
              <span className="text-[11px] text-blue-700">Awaiting Admin Sign-off</span>
            </div>
          </div>

          {/* Quick Download Card (1 Day to Whole Semester) */}
          <div className="p-6 rounded-2xl bg-white border-2 border-blue-100 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>Export Attendance Register (1 Day to Whole Semester)</span>
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                Master Roll Export
              </span>
            </div>

            <p className="text-slate-600">
              Download institutional attendance registers for <strong>{selectedGrade === 'All' ? 'All Classes' : selectedGrade}</strong> across selectable timeframes from a single day to the whole semester.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleQuickDownloadCSV('1day')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Selected Date (CSV)</span>
                </button>

                <button
                  onClick={() => handleQuickDownloadCSV('7days')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Last 7 Days (CSV)</span>
                </button>

                <button
                  onClick={() => handleQuickDownloadCSV('30days')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Monthly Register (CSV)</span>
                </button>

                <button
                  onClick={() => handleQuickDownloadCSV('semester')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Whole Semester (CSV)</span>
                </button>
              </div>

              <button
                onClick={() => { setSelectedStudentForReport(null); setIsReportModalOpen(true); }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Formal Printable Register →</span>
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {grades.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Quick Actions</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMarkAll('Present')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 cursor-pointer"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('Absent')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 cursor-pointer"
                  >
                    All Absent
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>

          {/* Student Roll Register Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Roll #</th>
                    <th className="py-3 px-4 font-semibold">Scholar Name</th>
                    <th className="py-3 px-4 font-semibold">Class / House</th>
                    <th className="py-3 px-4 font-semibold text-center">Status Selection</th>
                    <th className="py-3 px-4 font-semibold text-center">Overall Attendance</th>
                    <th className="py-3 px-4 font-semibold text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.map(student => {
                    const status = attendanceState[student.id] || 'Present';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{student.rollNo}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {student.loginId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{student.grade} - {student.section}</div>
                          <div className="text-[10px] text-slate-500">{student.house}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                            {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceRecord['status'][]).map(st => {
                              const active = status === st;
                              const colors = {
                                Present: active ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-emerald-700',
                                Absent: active ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-red-700',
                                Late: active ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-amber-700',
                                Excused: active ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-blue-700',
                              };
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, st)}
                                  className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer ${colors[st]}`}
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-mono font-bold text-emerald-600 text-xs">
                            {student.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentForReport(student);
                              setIsReportModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] flex items-center gap-1 border border-blue-200 cursor-pointer ml-auto"
                            title="Download scholar attendance record from 1 day to whole semester"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Leaves Management View */
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Student Leave Applications Desk</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                Total Leaves Filed: {leaves.length}
              </span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Scholar Name</th>
                    <th className="py-3 px-4 font-semibold">Class</th>
                    <th className="py-3 px-4 font-semibold">Duration (From - To)</th>
                    <th className="py-3 px-4 font-semibold">Reason</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Directorate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaves.map(leave => (
                    <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">{leave.studentName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{leave.grade}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {leave.fromDate} → {leave.toDate}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-[280px]">
                        {leave.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            leave.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : leave.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {leave.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleLeaveDecision(leave.id, 'Approved')}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleLeaveDecision(leave.id, 'Rejected')}
                                className="px-2.5 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[10px] uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Signed off</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Report & Download Modal */}
      {isReportModalOpen && (
        <AttendanceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          student={selectedStudentForReport || undefined}
          classSection={selectedGrade === 'All' ? 'School-Wide Directory' : selectedGrade}
          allStudents={filteredStudents}
          existingLogs={attendanceLogs}
          isTeacherOrAdminView={selectedStudentForReport === null}
        />
      )}
    </div>
  );
};
