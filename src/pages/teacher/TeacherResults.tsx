import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { GraduationCap, Save } from 'lucide-react';

export const TeacherResults: React.FC = () => {
  const { students, saveExamResult, updateStudent } = useSchoolData();
  const { toast } = useToast();

  const [examName, setExamName] = useState('Unit Test 2 (Science & STEM)');
  const [selectedClass, setSelectedClass] = useState('Grade 8-A');
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
    // Commit exam results to context
    students.forEach((student, index) => {
      const studentScore = marks[student.id] || 90;
      const percentage = Math.round((studentScore / 100) * 100);
      const calculatedGpa = parseFloat(((percentage / 100) * 4.0).toFixed(2));

      // Update student GPA
      updateStudent(student.id, { gpa: calculatedGpa });

      // Save Exam Result for report card
      saveExamResult({
        id: `exam-${student.id}-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        grade: student.grade,
        section: student.section,
        examName,
        academicYear: '2026-2027',
        subjects: [
          { subject: 'Science & Discovery', marksObtained: studentScore, maxMarks: 100, grade: getGrade(studentScore), remarks: 'Outstanding analytical capability' },
          { subject: 'Mathematics & Logic', marksObtained: Math.min(100, studentScore + 2), maxMarks: 100, grade: getGrade(studentScore + 2), remarks: 'Strong algebraic reasoning' },
          { subject: 'English & Literature', marksObtained: Math.max(70, studentScore - 4), maxMarks: 100, grade: getGrade(studentScore - 4), remarks: 'Expressive vocabulary' },
          { subject: 'Social Studies & Civics', marksObtained: Math.max(75, studentScore - 3), maxMarks: 100, grade: getGrade(studentScore - 3), remarks: 'Active classroom contributor' },
          { subject: 'Robotics & Python Coding', marksObtained: Math.min(100, studentScore + 3), maxMarks: 100, grade: getGrade(studentScore + 3), remarks: 'Innovative practical projects' },
        ],
        totalMarks: studentScore * 5 - 2,
        maxTotal: 500,
        percentage,
        gpa: calculatedGpa,
        rank: index + 1,
        overallGrade: getGrade(percentage),
        teacherRemarks: `Remarkable academic performance in ${examName}. Demonstrates strong leadership and inquisitiveness.`
      });
    });

    toast('Marks & Report Cards Committed!', `Saved scores for ${students.length} scholars in ${examName}`, 'success');
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
            <label className="block text-slate-500 font-semibold mb-1">Assessment Name</label>
            <input
              type="text"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Class / Division</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Grade 8-A">Grade 8-A (General Science)</option>
              <option value="Grade 7-A">Grade 7-A (Physical Science)</option>
              <option value="Grade 6-A">Grade 6-A (Nature Science)</option>
            </select>
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
