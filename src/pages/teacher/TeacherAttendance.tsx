import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck,
  Check,
  Save,
  Download,
  Printer,
  FileSpreadsheet,
  Users,
  Filter,
  ShieldAlert,
  Crown,
  Lock,
  School
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
  const { students, teachers, markAttendanceBulk, leaves, updateLeaveStatus, attendanceLogs } = useSchoolData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const currentTeacher = teachers.find(t => t.id === currentUser?.id || t.loginId === currentUser?.loginId) || teachers[0];

  // Daily Roll Call is strictly restricted to designated Class Teachers
  const classTeacherAllocations = currentTeacher?.assignedClasses?.filter(ac => Boolean(ac.isClassTeacher)) || [];
  const isClassTeacher = classTeacherAllocations.length > 0;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classSection, setClassSection] = useState(
    classTeacherAllocations.length > 0
      ? `${classTeacherAllocations[0].grade}-${classTeacherAllocations[0].section}`
      : 'Class 8-A'
  );

  useEffect(() => {
    if (classTeacherAllocations.length > 0 && !classTeacherAllocations.some(ac => `${ac.grade}-${ac.section}` === classSection)) {
      setClassSection(`${classTeacherAllocations[0].grade}-${classTeacherAllocations[0].section}`);
    }
  }, [classTeacherAllocations]);

  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const [rollStates, setRollStates] = useState<Record<string, AttendanceRecord['status']>>({});

  // Normalize grade strings for matching
  const normalizeGrade = (g?: string) => (g || '').replace(/^(Class|Grade)\s+/i, '').trim().toLowerCase();
  const parts = classSection.split('-');
  const selectedGrade = parts[0]?.trim() || '';
  const selectedSection = parts[1]?.trim() || '';

  // Get scholars belonging exclusively to this Class Teacher's selected division
  const divisionStudents = students.filter(s => {
    const matchG = normalizeGrade(s.grade) === normalizeGrade(selectedGrade);
    const matchS = (s.section || '').trim().toLowerCase() === selectedSection.toLowerCase();
    return matchG && matchS;
  });

  const toggleStatus = (studentId: string) => {
    const current = rollStates[studentId] || 'Present';
    const next: AttendanceRecord['status'] = current === 'Present' ? 'Absent' : current === 'Absent' ? 'Late' : 'Present';
    setRollStates({ ...rollStates, [studentId]: next });
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceRecord['status']> = {};
    divisionStudents.forEach(s => { updated[s.id] = 'Present'; });
    setRollStates(updated);
    toast('All Scholars Marked Present', `Marked ${divisionStudents.length} scholars present`, 'info');
  };

  const handleSaveAttendance = () => {
    if (divisionStudents.length === 0) {
      toast('No Scholars to Record', `No enrolled scholars in ${classSection}`, 'error');
      return;
    }

    const records = divisionStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      grade: s.grade,
      section: s.section,
      status: rollStates[s.id] || 'Present'
    }));

    markAttendanceBulk(records);
    toast('Official Roll Call Saved!', `Committed morning roll for ${classSection} on ${date}`, 'success');
  };

  const handleQuickDownloadClassCSV = (range: AttendanceRangeType) => {
    const { startDate, endDate, label } = calculateDateRange(range, date);
    downloadClassAttendanceCSV(
      classSection,
      divisionStudents,
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

  // If the logged in teacher is NOT a Class Teacher, restrict access
  if (!isClassTeacher) {
    return (
      <div className="space-y-6 pb-12">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-cinzel text-slate-900">Daily Roll Call Restricted to Class Teachers</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              According to school safety and attendance regulations, the official morning Daily Roll Call register can <strong>only be recorded and submitted by the appointed Class Teacher</strong> for each respective section.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Logged-in Faculty:</span>
              <strong className="text-slate-900">{currentTeacher?.name}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-semibold">Faculty Role:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                {currentTeacher?.department} Subject Teacher
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block mb-1">Your Allocated Teaching Classes:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentTeacher?.assignedClasses && currentTeacher.assignedClasses.length > 0 ? (
                  currentTeacher.assignedClasses.map((ac, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-medium text-[11px]">
                      {ac.grade}-{ac.section} ({ac.subject})
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px]">No classes currently allocated</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            If you have been appointed as the Class Teacher for a division (e.g. 8th A), please contact the school administration to assign your Class Teacher role in the Admin Panel Faculty Directorate.
          </p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-1.5 mb-1">
              <label className="block text-slate-700 font-semibold">Select Division</label>
              <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5 text-amber-600" />
                <span>Class Teacher</span>
              </span>
            </div>
            <select
              value={classSection}
              onChange={e => setClassSection(e.target.value)}
              className="px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/50 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {classTeacherAllocations.map((ac, idx) => (
                <option key={idx} value={`${ac.grade}-${ac.section}`}>
                  {ac.grade}-{ac.section} ({ac.subject} • Class Teacher)
                </option>
              ))}
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
              {divisionStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <Users className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                    <span>No scholars found enrolled in {classSection} yet.</span>
                  </td>
                </tr>
              ) : (
                divisionStudents.map(student => {
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
                })
              )}
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
