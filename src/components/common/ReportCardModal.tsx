import React from 'react';
import { ExamResult } from '../../types';
import { Modal } from './Modal';
import { Logo } from './Logo';
import { Printer, Award, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ReportCardModalProps {
  result: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ result, isOpen, onClose }) => {
  const { toast } = useToast();

  if (!result) return null;

  const handlePrint = () => {
    window.print();
    toast('Transcript Prepared', 'Ready to print or save as PDF', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Academic Transcript"
      subtitle={`${result.examName} • Academic Session ${result.academicYear}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Printable Transcript Document Container */}
        <div id="printable-report-card" className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm text-slate-800 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-slate-200 gap-4">
            <Logo size="lg" />
            <div className="text-center sm:text-right">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Official Board Record
              </span>
              <div className="text-xs text-slate-500 mt-2">Affiliation Code: <strong className="text-slate-900">PPS-CBSE-992140</strong></div>
              <div className="text-xs text-slate-500">Accredited by International Baccalaureate & CBSE</div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Candidate Name</span>
              <strong className="text-slate-900 text-sm">{result.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Class & Section</span>
              <strong className="text-slate-900 text-sm">{result.grade} - Section {result.section}</strong>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Assessment Term</span>
              <strong className="text-blue-700 text-sm">{result.examName}</strong>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider block">Class Standing</span>
              <strong className="text-emerald-700 text-sm flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Rank #{result.rank} of 42</span>
              </strong>
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Subject Title</th>
                  <th className="py-3 px-4 text-center font-semibold">Max Marks</th>
                  <th className="py-3 px-4 text-center font-semibold">Marks Scored</th>
                  <th className="py-3 px-4 text-center font-semibold">Grade</th>
                  <th className="py-3 px-4 font-semibold">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {result.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{sub.subject}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{sub.maxMarks}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-700">{sub.marksObtained}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 italic text-[11px]">{sub.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cumulative Performance Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Total Marks</span>
              <strong className="text-lg font-bold text-slate-900 font-mono">{result.totalMarks} / {result.maxTotal}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Percentage</span>
              <strong className="text-lg font-bold text-slate-900 font-mono">{result.percentage}%</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Cumulative GPA</span>
              <strong className="text-lg font-bold text-blue-700 font-mono">{result.gpa} / 4.0</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Overall Honors</span>
              <strong className="text-lg font-bold text-emerald-700">{result.overallGrade}</strong>
            </div>
          </div>

          {/* Institutional Signatures */}
          <div className="pt-8 flex items-center justify-between border-t border-slate-200 text-center text-xs text-slate-500">
            <div>
              <div className="font-serif italic text-slate-800 text-base">Dr. Sarah Jenkins</div>
              <div className="border-t border-slate-300 pt-1 mt-1 font-semibold text-[11px]">Class Mentor & Grade Head</div>
            </div>
            <div>
              <div className="font-serif italic text-slate-800 text-base">Dr. Robert Vance</div>
              <div className="border-t border-slate-300 pt-1 mt-1 font-semibold text-[11px]">Principal & Directorate Seal</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Transcript</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
