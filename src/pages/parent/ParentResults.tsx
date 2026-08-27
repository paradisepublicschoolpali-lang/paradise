import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Printer, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReportCardModal } from '../../components/common/ReportCardModal';
import { ExamResult } from '../../types';

export const ParentResults: React.FC = () => {
  const { results } = useSchoolData();
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  const result = results[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase">Board Assessment 2025-2026</span>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-slate-900 mt-0.5">{result?.examName}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Overall Honors: <strong className="text-blue-700">{result?.overallGrade}</strong> • Rank {result?.rank} in Division
          </p>
        </div>

        <button
          onClick={() => setSelectedResult(result)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Sealed Report Card</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Cumulative GPA</span>
          <div className="text-3xl font-bold font-cinzel text-blue-600">{result?.gpa} / 4.0</div>
          <span className="text-[11px] text-emerald-700">Top 2% of Batch</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Aggregate Percentage</span>
          <div className="text-3xl font-bold font-cinzel text-slate-900">{result?.percentage}%</div>
          <span className="text-[11px] text-slate-500">{result?.totalMarks} / {result?.maxTotal} Total Marks</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Class Distinction</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">Rank {result?.rank}</div>
          <span className="text-[11px] text-emerald-700">Gold Honors Scholar</span>
        </div>
      </div>

      {/* Subject Marks Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100">
          Discipline & Subject Score Breakdown
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold text-center">Score</th>
                <th className="py-3 px-4 font-semibold text-center">Max Marks</th>
                <th className="py-3 px-4 font-semibold text-center">Grade</th>
                <th className="py-3 px-4 font-semibold">Faculty Appraisal Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {result?.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sub.subject}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">{sub.marksObtained}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-500">{sub.maxMarks}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{sub.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Remarks Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Principal & Dean's Assessment</h4>
        <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
          "{result?.teacherRemarks}"
        </p>
      </div>

      {/* Report Card Modal */}
      <ReportCardModal
        result={selectedResult}
        isOpen={selectedResult !== null}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  );
};
