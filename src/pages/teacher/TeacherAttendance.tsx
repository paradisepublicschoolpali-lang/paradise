import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { CalendarCheck, Check, Save } from 'lucide-react';
import { AttendanceRecord } from '../../types';

export const TeacherAttendance: React.FC = () => {
  const { students, markAttendanceBulk } = useSchoolData();
  const { toast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classSection, setClassSection] = useState('Grade 8-A');
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

  return (
    <div className="space-y-6 pb-12">
      {/* Controls Bar */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
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
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Grade 8-A">Grade 8-A (General Science)</option>
              <option value="Grade 7-A">Grade 7-A (Integrated Science)</option>
              <option value="Grade 6-A">Grade 6-A (Nature Science)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Roll Sheet Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-emerald-600" />
          <span>Daily Roll Sheet Register</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Roll #</th>
                <th className="py-3 px-4 font-semibold">Scholar Name</th>
                <th className="py-3 px-4 font-semibold">Admission ID</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map(student => {
                const status = rollStates[student.id] || 'Present';

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">{student.rollNo}</td>
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
                      <button
                        onClick={() => toggleStatus(student.id)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-200"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
