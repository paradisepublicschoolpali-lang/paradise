import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Printer, CheckCircle2, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { PaymentModal } from '../../components/common/PaymentModal';
import { FeeItem } from '../../types';

export const ParentFees: React.FC = () => {
  const { fees, students } = useSchoolData();
  const { currentUser } = useAuth();
  const [activePaymentModal, setActivePaymentModal] = useState<FeeItem | null>(null);

  const student = students.find(s => s.id === currentUser.id || s.loginId === currentUser.loginId) || students[0];

  // Strictly filter fees for this student
  const studentInvoices = fees.filter(f => f.studentId === student?.id || f.studentName === student?.name);
  const pendingInvoices = studentInvoices.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const paidInvoices = studentInvoices.filter(f => f.status === 'Paid');

  const totalPaid = paidInvoices.reduce((sum, item) => sum + item.paidAmount, 0);
  const totalPending = pendingInvoices.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Student Fee Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold font-cinzel text-slate-900 text-base">{student?.name}</h3>
            <p className="text-xs text-slate-500">
              {student?.grade}-{student?.section} • Admission No: <strong className="font-mono text-slate-700">{student?.admissionNo}</strong> • Roll No: {student?.rollNo}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${pendingInvoices.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {pendingInvoices.length > 0 ? `${pendingInvoices.length} Due Invoice(s)` : 'All Dues Cleared'}
        </span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Settled Fees</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600">{formatCurrency(totalPaid)}</div>
          <span className="text-[11px] text-emerald-700">{paidInvoices.length} Terms Cleared</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Outstanding Balance</span>
          <div className="text-3xl font-bold font-cinzel text-amber-600">{formatCurrency(totalPending)}</div>
          <span className="text-[11px] text-amber-700">
            {pendingInvoices.length > 0 ? `Due by ${formatDate(pendingInvoices[0].dueDate)}` : 'No pending dues'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Payment Gateway</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">UPI, Debit Card, Net Banking & NEFT</div>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>256-Bit Encrypted Secure Channel</span>
          </span>
        </div>
      </div>

      {/* Invoice Ledger */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>Student Tuition Fee Ledger</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice No</th>
                <th className="py-3 px-4 font-semibold">Billing Term</th>
                <th className="py-3 px-4 font-semibold">Due Date</th>
                <th className="py-3 px-4 font-semibold text-right">Tuition Fee (₹)</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No tuition fee invoices generated for this student yet.
                  </td>
                </tr>
              ) : (
                studentInvoices.map(fee => (
                  <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{fee.invoiceNo}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{fee.term}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{formatDate(fee.dueDate)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatCurrency(fee.breakdown?.tuition || fee.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          fee.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {fee.status === 'Paid' ? (
                        <button
                          onClick={() => setActivePaymentModal(fee)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-blue-600" />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActivePaymentModal(fee)}
                          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Online</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment & Receipt Modal */}
      <PaymentModal
        feeItem={activePaymentModal}
        isOpen={activePaymentModal !== null}
        onClose={() => setActivePaymentModal(null)}
      />
    </div>
  );
};
