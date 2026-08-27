import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck,
  Check,
  Save,
  Download,
  Printer,
  FileSpreadsheet,
  Users,
  Filter
} from 'lucide-react';
import { AttendanceRecord, Student } from '../../types';
import { AttendanceReportModal } from '../../components/common/AttendanceReportModal';
import {
  calculateDateRange,
  downloadClassAttendanceCSV,
  downloadStudentAttendanceCSV,
  getStudentAttendanceRecords,
  AttendanceRangeType
} from '../../utils/attendanceExport';

export const TeacherAttendance: React.FC = () => {
  const { students, markAttendanceBulk, leaves, updateLeaveStatus, attendanceLogs } = useSchoolData();
  const { toast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classSection, setClassSection] = useState('Grade 8-A');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const [rollStates, setRollStates] = useState<Record<string, AttendanceRecord['status']>>({
    'std-1': 'Present',
    'std-2': 'Present',
    'std-3': 'Present',
    'std-4': 'Present',
    'std-5': 'Absent',
    'std-6': 'Present',
  });

  const toggleStatus = (studentId: string) => {
    const current = rollStates[studentId] || 'Present';
    const next: AttendanceRecord['status'] = current === 'Present' ? 'Absent' : current === 'Absent' ? 'Late' : 'Present';
    setRollStates({ ...rollStates, [studentId]: next });
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceRecord['status']> = {};
    students.forEach(s => { updated[s.id] = 'Present'; });
    setRollStates(updated);
    toast('All Scholars Marked Present', '', 'info');
  };

  const handleSaveAttendance = () => {
    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      status: rollStates[s.id] || 'Present'
    }));

    markAttendanceBulk(records);
    toast('Attendance Roll Saved!', `Committed for ${classSection} on ${date}`, 'success');
  };

  const handleQuickDownloadClassCSV = (range: AttendanceRangeType) => {
    const { startDate, endDate, label } = calculateDateRange(range, date);
    downloadClassAttendanceCSV(
      classSection,
      students,
      attendanceLogs,
      startDate,
      endDate,
      label
    );
    toast('Division Attendance CSV Downloaded!', `Exported ${classSection} register for ${label}`, 'success');
  };

  const handleOpenStudentReport = (student: Student) => {
    setSelectedStudentForReport(student);
    setIsReportModalOpen(true);
  };

  const handleOpenDivisionReport = () => {
    setSelectedStudentForReport(null);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Select Division</label>
            <select
              value={classSection}
              onChange={e => setClassSection(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Grade 8-A">Grade 8-A (General Science)</option>
              <option value="Grade 7-A">Grade 7-A (Integrated Science)</option>
              <option value="Grade 6-A">Grade 6-A (Nature Science)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenDivisionReport}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download & Print Register</span>
          </button>

          <button
            onClick={handleMarkAllPresent}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSaveAttendance}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Roll Call</span>
          </button>
        </div>
      </div>

      {/* Quick Download Division Register Card (1 Day to Whole Semester) */}
      <div className="p-6 rounded-2xl bg-white border-2 border-emerald-100 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Download {classSection} Attendance Register (1 Day to Whole Semester)</span>
          </h4>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
            Faculty Roll Export
          </span>
        </div>

        <p className="text-slate-600">
          Export full division attendance logs for <strong>{classSection}</strong>. Choose from today's single-day roll call, 7-day weekly log, 30-day monthly register, or the full semester attendance ledger.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleQuickDownloadClassCSV('1day')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Today's Roll (1 Day CSV)</span>
            </button>

            <button
              onClick={() => handleQuickDownloadClassCSV('7days')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Last 7 Days (CSV)</span>
            </button>

            <button
              onClick={() => handleQuickDownloadClassCSV('30days')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Monthly Register (CSV)</span>
            </button>

            <button
              onClick={() => handleQuickDownloadClassCSV('semester')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Whole Semester Register (CSV)</span>
            </button>
          </div>

          <button
            onClick={handleOpenDivisionReport}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Formal Printable Register →</span>
          </button>
        </div>
      </div>

      {/* Roll Sheet Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Daily Roll Sheet Register ({classSection})</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Date: {date}</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Roll #</th>
                <th className="py-3 px-4 font-semibold">Scholar Name</th>
                <th className="py-3 px-4 font-semibold">Admission ID</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions & Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map(student => {
                const status = rollStates[student.id] || 'Present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{student.rollNo}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{student.name}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{student.admissionNo}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenStudentReport(student)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] flex items-center gap-1 border border-blue-200 cursor-pointer"
                          title="Download scholar attendance record from 1 day to whole semester"
                        >
                          <Download className="w-3 h-3" />
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => toggleStatus(student.id)}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                        >
                          Toggle Status
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Applications Queue (from Parents) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Scholar Leave Applications ({leaves.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Parent Requests & Medical Slips</span>
        </div>

        {leaves.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">No pending leave applications.</div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Scholar</th>
                  <th className="py-3 px-4 font-semibold">Division</th>
                  <th className="py-3 px-4 font-semibold">Leave Dates</th>
                  <th className="py-3 px-4 font-semibold">Reason</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{leave.studentName}</td>
                    <td className="py-3 px-4">{leave.grade}</td>
                    <td className="py-3 px-4 font-mono">{leave.fromDate} to {leave.toDate}</td>
                    <td className="py-3 px-4 text-slate-600">{leave.reason}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        leave.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {leave.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => {
                              updateLeaveStatus(leave.id, 'Approved');
                              toast('Leave Approved', `Approved leave for ${leave.studentName}`, 'success');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              updateLeaveStatus(leave.id, 'Rejected');
                              toast('Leave Rejected', `Rejected leave for ${leave.studentName}`, 'error');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold text-[11px] cursor-pointer border border-slate-200"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Decided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Report & Download Modal */}
      {isReportModalOpen && (
        <AttendanceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          student={selectedStudentForReport || undefined}
          classSection={classSection}
          allStudents={students}
          existingLogs={attendanceLogs}
          isTeacherOrAdminView={true}
        />
      )}
    </div>
  );
};
