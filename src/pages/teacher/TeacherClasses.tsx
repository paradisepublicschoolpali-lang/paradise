import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { BookOpen, Users, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

export const TeacherClasses: React.FC = () => {
  const { students } = useSchoolData();
  const [selectedClass, setSelectedClass] = useState('Grade 8-A');

  const classes = [
    { id: '8-A', name: 'Grade 8-A', subject: 'General & Physical Science', room: 'Science Lab 1', count: 32, progress: 68 },
    { id: '7-A', name: 'Grade 7-A', subject: 'Integrated Science & Discovery', room: 'Room 104', count: 28, progress: 74 },
    { id: '6-A', name: 'Grade 6-A', subject: 'Nature & Environmental Science', room: 'Room 102', count: 30, progress: 80 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {classes.map(cls => (
          <div
            key={cls.id}
            onClick={() => setSelectedClass(cls.name)}
            className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
              selectedClass === cls.name
                ? 'bg-blue-50 border-blue-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                {cls.room}
              </span>
              <span className="text-xs text-slate-500">{cls.count} Scholars</span>
            </div>

            <div>
              <h3 className="text-lg font-bold font-cinzel text-slate-900">{cls.name}</h3>
              <p className="text-xs text-blue-600 font-semibold">{cls.subject}</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Syllabus Progress</span>
                <span className="font-bold text-slate-900">{cls.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${cls.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Roster for Selected Class */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Class Roster & Directory ({selectedClass})</span>
          </h3>
          <span className="text-xs text-slate-500">Academic Year 2026-27</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Scholar</th>
                <th className="py-3 px-4 font-semibold">Roll No</th>
                <th className="py-3 px-4 font-semibold">House</th>
                <th className="py-3 px-4 font-semibold text-center">Attendance</th>
                <th className="py-3 px-4 font-semibold text-center">GPA</th>
                <th className="py-3 px-4 font-semibold">Guardian Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{student.name}</td>
                  <td className="py-3 px-4 font-mono">{student.rollNo}</td>
                  <td className="py-3 px-4">
                    <span className="text-blue-600 font-medium">{student.house}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">{student.attendanceRate}%</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600">{student.gpa}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{student.guardianPhone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
