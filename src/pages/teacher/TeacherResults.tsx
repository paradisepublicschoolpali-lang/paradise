import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Save } from 'lucide-react';

export const TeacherResults: React.FC = () => {
  const { students } = useSchoolData();
  const { toast } = useToast();

  const [examName, setExamName] = useState('Unit Test 2 (Physics & STEM)');
  const [marks, setMarks] = useState<Record<string, number>>({
    'std-1': 96,
    'std-2': 98,
    'std-3': 88,
    'std-4': 92,
    'std-5': 84,
    'std-6': 99,
  });

  const handleMarksChange = (studentId: string, val: number) => {
    setMarks({ ...marks, [studentId]: val });
  };

  const handleSaveMarks = () => {
    toast('Marks Register Committed!', `Saved scores for ${students.length} scholars in ${examName}`, 'success');
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A1';
    if (score >= 80) return 'A2';
    if (score >= 70) return 'B1';
    return 'B2';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Assessment Assessment</label>
            <input
              type="text"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Class / Division</label>
            <span className="block px-3 py-2 rounded-xl bg-slate-100 font-semibold text-slate-800 border border-slate-200">
              Grade 10-A (Advanced Physics)
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveMarks}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Commit Marks Registry</span>
        </button>
      </div>

      {/* Marks Register Sheet */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Marks Entry Gradebook Register</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Roll #</th>
                <th className="py-3 px-4 font-semibold">Scholar Name</th>
                <th className="py-3 px-4 font-semibold text-center">Score (Max 100)</th>
                <th className="py-3 px-4 font-semibold text-center">Auto-Computed Grade</th>
                <th className="py-3 px-4 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map(student => {
                const score = marks[student.id] || 90;
                const grade = getGrade(score);

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold">{student.rollNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{student.name}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={score}
                        onChange={e => handleMarksChange(student.id, Number(e.target.value))}
                        className="w-20 px-2.5 py-1 text-center font-mono font-bold rounded-lg border border-slate-300 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                        {grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {score >= 90 ? 'Outstanding laboratory and theoretical mastery' : 'Good comprehension'}
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
