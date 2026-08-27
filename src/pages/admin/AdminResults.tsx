import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { ExamResult, Student } from '../../types';
import {
  GraduationCap,
  Search,
  Plus,
  Trash2,
  Edit3,
  Award,
  FileText,
  TrendingUp,
  Save,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ReportCardModal } from '../../components/common/ReportCardModal';

export const AdminResults: React.FC = () => {
  const { students, results, saveExamResult, deleteExamResult, updateStudent, schoolConfig } = useSchoolData();
  const { toast } = useToast();

  const [selectedExam, setSelectedExam] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddExamModalOpen, setIsAddExamModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);
  const [reportCardResult, setReportCardResult] = useState<ExamResult | null>(null);

  // New Exam Form State
  const [newExamData, setNewExamData] = useState({
    studentId: students[0]?.id || '',
    examName: 'Mid-Term Examination 2026',
    academicYear: schoolConfig.academicYear || '2026-2027',
    scienceMarks: 92,
    mathMarks: 95,
    englishMarks: 88,
    socialMarks: 90,
    codingMarks: 96,
    teacherRemarks: 'Exemplary academic dedication, strong problem-solving skills, and active participation.'
  });

  const examNames = ['All', 'Unit Test 1', 'Mid-Term Examination 2026', 'Unit Test 2 (Science & STEM)', 'Annual Comprehensive Examination 2026'];
  const grades = ['All', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  const filteredResults = results.filter(r => {
    const matchesExam = selectedExam === 'All' || r.examName.toLowerCase() === selectedExam.toLowerCase();
    const matchesGrade = selectedGrade === 'All' || r.grade.toLowerCase() === selectedGrade.toLowerCase();
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.grade && r.grade.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesExam && matchesGrade && matchesSearch;
  });

  const calculateGradeFromScore = (score: number) => {
    if (score >= 90) return 'A1';
    if (score >= 80) return 'A2';
    if (score >= 70) return 'B1';
    if (score >= 60) return 'B2';
    if (score >= 50) return 'C1';
    return 'D';
  };

  const handleCreateExamResult = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newExamData.studentId);
    if (!student) {
      toast('Please select a student', '', 'error');
      return;
    }

    const subjects = [
      { subject: 'Science & Discovery', marksObtained: Number(newExamData.scienceMarks), maxMarks: 100, grade: calculateGradeFromScore(Number(newExamData.scienceMarks)), remarks: 'Strong analytical skills' },
      { subject: 'Mathematics & Logic', marksObtained: Number(newExamData.mathMarks), maxMarks: 100, grade: calculateGradeFromScore(Number(newExamData.mathMarks)), remarks: 'Excellent calculation accuracy' },
      { subject: 'English & Literature', marksObtained: Number(newExamData.englishMarks), maxMarks: 100, grade: calculateGradeFromScore(Number(newExamData.englishMarks)), remarks: 'Expressive vocabulary' },
      { subject: 'Social Studies & Civics', marksObtained: Number(newExamData.socialMarks), maxMarks: 100, grade: calculateGradeFromScore(Number(newExamData.socialMarks)), remarks: 'Good grasp of concepts' },
      { subject: 'Robotics & Python Coding', marksObtained: Number(newExamData.codingMarks), maxMarks: 100, grade: calculateGradeFromScore(Number(newExamData.codingMarks)), remarks: 'Innovative practical implementation' }
    ];

    const totalMarks = subjects.reduce((acc, curr) => acc + curr.marksObtained, 0);
    const maxTotal = subjects.length * 100;
    const percentage = Math.round((totalMarks / maxTotal) * 100);
    const gpa = parseFloat(((percentage / 100) * 4.0).toFixed(2));
    const overallGrade = calculateGradeFromScore(percentage);

    const newResult: ExamResult = {
      id: `exam-${student.id}-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      section: student.section,
      examName: newExamData.examName,
      academicYear: newExamData.academicYear,
      subjects,
      totalMarks,
      maxTotal,
      percentage,
      gpa,
      rank: 1,
      overallGrade,
      teacherRemarks: newExamData.teacherRemarks
    };

    saveExamResult(newResult);
    updateStudent(student.id, { gpa });

    toast('Academic Result Record Created!', `Saved transcript for ${student.name} (${newExamData.examName})`, 'success');
    setIsAddExamModalOpen(false);
  };

  const handleUpdateResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;

    const totalMarks = editingResult.subjects.reduce((acc, s) => acc + Number(s.marksObtained), 0);
    const maxTotal = editingResult.subjects.reduce((acc, s) => acc + Number(s.maxMarks), 0);
    const percentage = Math.round((totalMarks / (maxTotal || 100)) * 100);
    const gpa = parseFloat(((percentage / 100) * 4.0).toFixed(2));
    const overallGrade = calculateGradeFromScore(percentage);

    const updatedResult: ExamResult = {
      ...editingResult,
      totalMarks,
      maxTotal,
      percentage,
      gpa,
      overallGrade
    };

    saveExamResult(updatedResult);
    updateStudent(editingResult.studentId, { gpa });
    toast('Exam Result Updated!', `Successfully saved changes for ${editingResult.studentName}`, 'success');
    setEditingResult(null);
  };

  const handleDeleteResult = (id: string, name: string, exam: string) => {
    if (window.confirm(`Delete exam record of ${name} for ${exam}?`)) {
      deleteExamResult(id);
      toast('Result Record Deleted', `Removed from academic transcript database`, 'info');
    }
  };

  const avgGPA = results.length > 0
    ? (results.reduce((acc, r) => acc + r.gpa, 0) / results.length).toFixed(2)
    : '3.85';

  const distinctionCount = results.filter(r => r.percentage >= 90).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Academic Gradebook & Examination Controller</h3>
          <p className="text-xs text-slate-500">
            Institution-wide examination records ({results.length} transcripts) • Manage marks, compute GPAs, and issue official sealed report cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddExamModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enter Examination Record</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Published Transcripts</span>
          <div className="text-3xl font-bold font-cinzel text-slate-900">{results.length}</div>
          <span className="text-[11px] text-blue-600 font-medium">Session {schoolConfig.academicYear}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Institutional GPA Average</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">{avgGPA} / 4.0</div>
          <span className="text-[11px] text-emerald-700">Top Tier School Board Rating</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Honors & Distinctions</span>
          <div className="text-3xl font-bold font-cinzel text-purple-600">{distinctionCount} Scholars</div>
          <span className="text-[11px] text-purple-700">Scored ≥ 90% in Final Board</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Pass Percentage</span>
          <div className="text-3xl font-bold font-cinzel text-blue-600">100%</div>
          <span className="text-[11px] text-blue-700">Zero Academic Probations</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {grades.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedGrade === g
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scholar name, exam, grade..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Scholar Info</th>
                <th className="py-3 px-4 font-semibold">Assessment Title</th>
                <th className="py-3 px-4 font-semibold text-center">Percentage</th>
                <th className="py-3 px-4 font-semibold text-center">GPA</th>
                <th className="py-3 px-4 font-semibold text-center">Grade / Rank</th>
                <th className="py-3 px-4 font-semibold">Directorate Remarks</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredResults.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-sm">{res.studentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{res.grade}-{res.section} • {res.academicYear}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {res.examName}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-blue-600 text-sm">{res.percentage}%</span>
                    <div className="text-[10px] text-slate-400 font-mono">{res.totalMarks}/{res.maxTotal}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200 text-xs">
                      {res.gpa} / 4.0
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                      <Award className="w-3 h-3 text-blue-600" />
                      <span>{res.overallGrade} (Rank #{res.rank})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[220px] truncate text-[11px]">
                    {res.teacherRemarks}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setReportCardResult(res)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 border border-blue-200 cursor-pointer"
                        title="Generate & View Official Sealed Report Card"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Report Card</span>
                      </button>
                      <button
                        onClick={() => setEditingResult({ ...res })}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 transition-colors border border-slate-200 cursor-pointer"
                        title="Edit Marks & Remarks"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteResult(res.id, res.studentName, res.examName)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-red-600 transition-colors border border-slate-200 cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Result Modal */}
      <Modal
        isOpen={isAddExamModalOpen}
        onClose={() => setIsAddExamModalOpen(false)}
        title="Enter Academic Assessment & Marks Record"
        subtitle="Create examination transcript and update student GPA gradebook"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateExamResult} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Student *</label>
              <select
                required
                value={newExamData.studentId}
                onChange={e => setNewExamData({ ...newExamData, studentId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade}-{s.section} • Roll: {s.rollNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assessment / Exam Title *</label>
              <input
                type="text"
                required
                value={newExamData.examName}
                onChange={e => setNewExamData({ ...newExamData, examName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Subject Scores (Marks out of 100)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Science</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newExamData.scienceMarks}
                  onChange={e => setNewExamData({ ...newExamData, scienceMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Mathematics</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newExamData.mathMarks}
                  onChange={e => setNewExamData({ ...newExamData, mathMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">English</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newExamData.englishMarks}
                  onChange={e => setNewExamData({ ...newExamData, englishMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Social Studies</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newExamData.socialMarks}
                  onChange={e => setNewExamData({ ...newExamData, socialMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Coding/STEM</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={newExamData.codingMarks}
                  onChange={e => setNewExamData({ ...newExamData, codingMarks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-blue-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Principal / Academic Board Remarks</label>
            <textarea
              rows={2}
              value={newExamData.teacherRemarks}
              onChange={e => setNewExamData({ ...newExamData, teacherRemarks: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddExamModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
            >
              Commit Result to Database
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Result Modal */}
      <Modal
        isOpen={editingResult !== null}
        onClose={() => setEditingResult(null)}
        title="Edit Examination Marks & Academic Record"
        subtitle={editingResult ? `${editingResult.studentName} • ${editingResult.examName}` : ''}
        maxWidth="2xl"
      >
        {editingResult && (
          <form onSubmit={handleUpdateResult} className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Subject Scores Breakdown</h4>
              <div className="space-y-2">
                {editingResult.subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800 w-44">{sub.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Marks:</span>
                      <input
                        type="number"
                        min={0}
                        max={sub.maxMarks}
                        value={sub.marksObtained}
                        onChange={e => {
                          const updatedSubs = [...editingResult.subjects];
                          const newScore = Number(e.target.value);
                          updatedSubs[idx] = {
                            ...sub,
                            marksObtained: newScore,
                            grade: calculateGradeFromScore(newScore)
                          };
                          setEditingResult({ ...editingResult, subjects: updatedSubs });
                        }}
                        className="w-16 px-2 py-1 text-center font-mono font-bold border border-slate-300 rounded text-blue-700"
                      />
                      <span className="text-slate-400 font-mono">/ {sub.maxMarks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Directorate Remarks</label>
              <textarea
                rows={2}
                value={editingResult.teacherRemarks}
                onChange={e => setEditingResult({ ...editingResult, teacherRemarks: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
              >
                Save Transcript Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Report Card Modal */}
      {reportCardResult && (
        <ReportCardModal
          result={reportCardResult}
          isOpen={reportCardResult !== null}
          onClose={() => setReportCardResult(null)}
        />
      )}
    </div>
  );
};
