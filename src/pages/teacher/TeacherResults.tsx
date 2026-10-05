import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  GraduationCap,
  Save,
  ShieldAlert,
  Crown,
  School,
  Award,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export const TeacherResults: React.FC = () => {
  const { students, teachers, saveExamResult, updateStudent, results } = useSchoolData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const currentTeacher = teachers.find(t => t.id === currentUser?.id || t.loginId === currentUser?.loginId) || teachers[0];

  // Marks entry is strictly restricted to designated Class Teachers
  const classTeacherAllocations = currentTeacher?.assignedClasses?.filter(ac => Boolean(ac.isClassTeacher)) || [];
  const isClassTeacher = classTeacherAllocations.length > 0;

  const [examName, setExamName] = useState('Unit Test 2 (Quarterly Evaluation)');
  const [selectedClass, setSelectedClass] = useState(
    classTeacherAllocations.length > 0
      ? `${classTeacherAllocations[0].grade}-${classTeacherAllocations[0].section}`
      : 'Class 8-A'
  );

  useEffect(() => {
    if (classTeacherAllocations.length > 0 && !classTeacherAllocations.some(ac => `${ac.grade}-${ac.section}` === selectedClass)) {
      setSelectedClass(`${classTeacherAllocations[0].grade}-${classTeacherAllocations[0].section}`);
    }
  }, [classTeacherAllocations]);

  const [marks, setMarks] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  // Normalize grade strings for matching
  const normalizeGrade = (g?: string) => (g || '').replace(/^(Class|Grade)\s+/i, '').trim().toLowerCase();
  const parts = selectedClass.split('-');
  const selectedGrade = parts[0]?.trim() || '';
  const selectedSection = parts[1]?.trim() || '';

  // Get scholars belonging exclusively to this Class Teacher's selected division
  const divisionStudents = students.filter(s => {
    const matchG = normalizeGrade(s.grade) === normalizeGrade(selectedGrade);
    const matchS = (s.section || '').trim().toLowerCase() === selectedSection.toLowerCase();
    return matchG && matchS;
  });

  // Sync marks whenever selectedClass or exam changes
  useEffect(() => {
    const newMarks: Record<string, number> = {};
    const newRemarks: Record<string, string> = {};

    divisionStudents.forEach(student => {
      const existing = results.find(
        r => r.studentId === student.id && r.examName.toLowerCase() === examName.toLowerCase()
      );

      if (existing) {
        newMarks[student.id] = Math.round(existing.percentage);
        newRemarks[student.id] = existing.teacherRemarks || 'Consistent performance in assessments.';
      } else {
        const defaultScore = student.gpa ? Math.round(Math.min(99, Math.max(60, student.gpa * 9.8))) : 88;
        newMarks[student.id] = defaultScore;
        newRemarks[student.id] = defaultScore >= 90
          ? 'Outstanding academic mastery & lab aptitude'
          : defaultScore >= 80
          ? 'Good comprehension and classroom participation'
          : 'Consistent progress; needs regular revision';
      }
    });

    setMarks(prev => ({ ...newMarks, ...prev }));
    setRemarks(prev => ({ ...newRemarks, ...prev }));
  }, [selectedClass, examName]);

  const handleMarksChange = (studentId: string, val: number) => {
    const clamped = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
    setMarks(prev => ({ ...prev, [studentId]: clamped }));
  };

  const handleRemarkChange = (studentId: string, val: string) => {
    setRemarks(prev => ({ ...prev, [studentId]: val }));
  };

  const getGrade = (score: number) => {
    if (score >= 91) return 'A1';
    if (score >= 81) return 'A2';
    if (score >= 71) return 'B1';
    if (score >= 61) return 'B2';
    if (score >= 51) return 'C1';
    if (score >= 41) return 'C2';
    if (score >= 33) return 'D';
    return 'E';
  };

  const handleSaveMarks = () => {
    if (divisionStudents.length === 0) {
      toast('No Scholars in Division', `No students found enrolled in ${selectedClass}`, 'error');
      return;
    }

    divisionStudents.forEach((student, index) => {
      const studentScore = marks[student.id] !== undefined ? marks[student.id] : 88;
      const percentage = Math.min(100, Math.max(0, studentScore));
      const calculatedGpa = parseFloat((percentage / 9.5).toFixed(2));
      const studentRemark = remarks[student.id] || (
        percentage >= 90
          ? `Outstanding academic achievement in ${examName}. Demonstrates strong analytical leadership.`
          : `Good comprehension and consistent effort demonstrated in ${examName}.`
      );

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
          { subject: 'Hindi', marksObtained: Math.min(100, percentage + 1), maxMarks: 100, grade: getGrade(percentage + 1), remarks: 'Good grasp of language & grammar' },
          { subject: 'English', marksObtained: Math.max(35, percentage - 3), maxMarks: 100, grade: getGrade(percentage - 3), remarks: 'Expressive vocabulary & literature' },
          { subject: 'Maths', marksObtained: Math.min(100, percentage + 2), maxMarks: 100, grade: getGrade(percentage + 2), remarks: 'Strong algebraic reasoning & logic' },
          { subject: 'Science', marksObtained: percentage, maxMarks: 100, grade: getGrade(percentage), remarks: 'Outstanding analytical capability & lab work' },
          { subject: 'Social Science', marksObtained: Math.max(40, percentage - 2), maxMarks: 100, grade: getGrade(percentage - 2), remarks: 'Active classroom contributor in civics' },
          { subject: 'Computer', marksObtained: Math.min(100, percentage + 3), maxMarks: 100, grade: getGrade(percentage + 3), remarks: 'Innovative practical coding skills' },
          { subject: 'G.K', marksObtained: Math.min(100, percentage + 2), maxMarks: 100, grade: getGrade(percentage + 2), remarks: 'High awareness of current affairs' },
          { subject: 'Arts', marksObtained: Math.min(100, percentage + 4), maxMarks: 100, grade: getGrade(percentage + 4), remarks: 'Creative design & aesthetic skills' }
        ],
        totalMarks: percentage * 8,
        maxTotal: 800,
        percentage,
        gpa: calculatedGpa,
        rank: index + 1,
        overallGrade: getGrade(percentage),
        teacherRemarks: studentRemark
      });
    });

    toast(
      'Marks & Gradebook Committed!',
      `Official marks saved for ${divisionStudents.length} scholars in ${selectedClass} (${examName})`,
      'success'
    );
  };

  // RESTRICT ACCESS IF NOT A CLASS TEACHER
  if (!isClassTeacher) {
    return (
      <div className="space-y-6 pb-12">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs text-center max-w-2xl mx-auto my-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-cinzel text-slate-900">Marks Entry Restricted to Class Teachers</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              According to institutional academic policy and examination grading rules, official assessment marks entry and sealed report card submissions can <strong>only be recorded and committed by the appointed Class Teacher</strong> for their designated class division.
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

  // Calculate statistics for current division
  const currentScores = divisionStudents.map(s => marks[s.id] !== undefined ? marks[s.id] : 88);
  const avgScore = currentScores.length > 0
    ? (currentScores.reduce((acc, v) => acc + v, 0) / currentScores.length).toFixed(1)
    : '0.0';
  const distinctionCount = currentScores.filter(s => s >= 90).length;
  const passCount = currentScores.filter(s => s >= 33).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold font-cinzel text-slate-900">Academic Gradebook & Marks Entry</h3>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Class Teacher: {selectedClass}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Official evaluation register for {currentTeacher.name} • Strictly restricted to your Class Teacher divisions
          </p>
        </div>

        <button
          onClick={handleSaveMarks}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Commit Marks Registry</span>
        </button>
      </div>

      {/* Filter and Assessment Setup */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Your Class Teacher Division *</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 font-semibold text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {classTeacherAllocations.map(ac => (
              <option key={`${ac.grade}-${ac.section}`} value={`${ac.grade}-${ac.section}`}>
                {ac.grade} - Section {ac.section} ({ac.subject})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Assessment / Exam Name *</label>
          <input
            type="text"
            value={examName}
            onChange={e => setExamName(e.target.value)}
            placeholder="e.g. Unit Test 2, Mid-Term Exam"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs w-full flex items-center justify-between">
            <span className="font-semibold">Enrolled in {selectedClass}:</span>
            <strong className="font-mono text-sm text-blue-700">{divisionStudents.length} Scholars</strong>
          </div>
        </div>
      </div>

      {/* Division Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
          <span className="text-slate-500">Total Enrolled</span>
          <strong className="text-slate-900 font-mono text-sm">{divisionStudents.length}</strong>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between shadow-2xs">
          <span className="text-blue-700 font-semibold">Average Score</span>
          <strong className="text-blue-800 font-mono text-sm">{avgScore}%</strong>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-2xs">
          <span className="text-emerald-700 font-semibold">Distinctions (A1)</span>
          <strong className="text-emerald-800 font-mono text-sm">{distinctionCount}</strong>
        </div>
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between shadow-2xs">
          <span className="text-purple-700 font-semibold">Pass Rate</span>
          <strong className="text-purple-800 font-mono text-sm">
            {divisionStudents.length > 0 ? `${Math.round((passCount / divisionStudents.length) * 100)}%` : '100%'}
          </strong>
        </div>
      </div>

      {/* Marks Register Sheet */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Class Division Gradebook Register ({selectedClass})</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Scores auto-generate CBSE letter grades & GPA
          </span>
        </div>

        {divisionStudents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <School className="w-8 h-8 text-slate-400 mx-auto" />
            <h6 className="font-bold text-slate-700 text-sm">No Scholars Enrolled in {selectedClass}</h6>
            <p className="text-slate-500 text-xs">
              There are currently no students registered under this grade and section in the school database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs border border-slate-200 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Roll #</th>
                  <th className="py-3 px-4 font-semibold">Scholar Name</th>
                  <th className="py-3 px-4 font-semibold text-center">Score (Max 100)</th>
                  <th className="py-3 px-4 font-semibold text-center">CBSE Grade</th>
                  <th className="py-3 px-4 font-semibold">Teacher Evaluation Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {divisionStudents.map(student => {
                  const score = marks[student.id] !== undefined ? marks[student.id] : 88;
                  const grade = getGrade(score);
                  const remark = remarks[student.id] || '';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{student.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Adm: {student.admissionNo}</div>
                      </td>
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
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          grade === 'A1'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : grade === 'A2'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : grade === 'B1' || grade === 'B2'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={remark}
                          onChange={e => handleRemarkChange(student.id, e.target.value)}
                          placeholder="e.g. Excellent laboratory comprehension..."
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
