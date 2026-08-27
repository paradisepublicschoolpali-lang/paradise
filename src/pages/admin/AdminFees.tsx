import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { FeeItem } from '../../types';
import { CreditCard, Search, Mail, Printer, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { PaymentModal } from '../../components/common/PaymentModal';
import { Modal } from '../../components/common/Modal';

export const AdminFees: React.FC = () => {
  const { fees, students, addFeeInvoice, updateFeeInvoice, deleteFeeInvoice, payFeeInvoice } = useSchoolData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeReceiptModal, setActiveReceiptModal] = useState<FeeItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);

  // New Invoice Form
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || 'std-1',
    term: 'Term 3 (Winter Session 2026-27)',
    dueDate: '2026-11-15',
    tuition: 38000,
    transport: 12000,
    labAndLibrary: 8500,
    sportsAndActivities: 4500,
    developmentFund: 6000,
    status: 'Pending' as FeeItem['status']
  });

  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.paidAmount, 0) + 2450000;
  const pendingFees = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const totalOutstanding = pendingFees.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const filteredFees = fees.filter(f => {
    const matchesStatus = selectedStatus === 'All' || f.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudent = students.find(s => s.id === formData.studentId) || students[0];
    const total = formData.tuition + formData.transport + formData.labAndLibrary + formData.sportsAndActivities + formData.developmentFund;

    addFeeInvoice({
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      grade: `${selectedStudent.grade}-${selectedStudent.section}`,
      term: formData.term,
      dueDate: formData.dueDate,
      breakdown: {
        tuition: formData.tuition,
        transport: formData.transport,
        labAndLibrary: formData.labAndLibrary,
        sportsAndActivities: formData.sportsAndActivities,
        developmentFund: formData.developmentFund
      },
      totalAmount: total,
      status: formData.status
    });

    toast('Fee Invoice Generated!', `Invoice billed to ${selectedStudent.name} for ${formatCurrency(total)}`, 'success');
    setIsAddModalOpen(false);
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    const total = editingFee.breakdown.tuition + editingFee.breakdown.transport + editingFee.breakdown.labAndLibrary + editingFee.breakdown.sportsAndActivities + editingFee.breakdown.developmentFund;

    updateFeeInvoice(editingFee.id, {
      ...editingFee,
      totalAmount: total,
      paidAmount: editingFee.status === 'Paid' ? total : 0
    });

    toast('Invoice Updated', `Changes committed for invoice ${editingFee.invoiceNo}`, 'success');
    setEditingFee(null);
  };

  const handleDeleteFee = (id: string, invoiceNo: string) => {
    if (window.confirm(`Delete fee invoice ${invoiceNo}?`)) {
      deleteFeeInvoice(id);
      toast('Invoice Deleted', `Record ${invoiceNo} removed`, 'info');
    }
  };

  const handleSendReminder = (studentName: string, invoiceNo: string) => {
    toast('Payment Alert Dispatched!', `Automated reminder sent to guardian of ${studentName} for invoice ${invoiceNo}`, 'success');
  };

  const handleManualSettle = (feeId: string, invoiceNo: string) => {
    payFeeInvoice(feeId, 'Bank Wire');
    toast('Invoice Settled', `Invoice ${invoiceNo} marked as Paid via Bank Wire`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Institutional Treasury & Invoicing</h3>
          <p className="text-xs text-slate-500">Create, edit, bill, and reconcile student tuition and transport fees</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Fee Invoice</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Revenue Settled</span>
          <div className="text-3xl font-bold font-cinzel text-blue-600 mt-1">{formatCurrency(totalCollected)}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Verified in school treasury account</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Pending Invoices</span>
          <div className="text-3xl font-bold font-cinzel text-amber-600 mt-1">{formatCurrency(totalOutstanding)}</div>
          <span className="text-[11px] text-slate-500">{pendingFees.length} accounts awaiting collection</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Dunning & Alerts</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">Automated Reminders Active</div>
          </div>
          <button
            onClick={() => toast('Bulk Reminders Transmitted', 'Alerts sent to all pending fee accounts', 'info')}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Send Reminders to Defaulters</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student name, invoice #, class..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>Institutional Fee Ledger & Invoices</span>
        </h4>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice #</th>
                <th className="py-3 px-4 font-semibold">Scholar Name</th>
                <th className="py-3 px-4 font-semibold">Billing Term</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Payment Details</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFees.map(fee => (
                <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{fee.invoiceNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{fee.studentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{fee.grade}</div>
                  </td>
                  <td className="py-3 px-4">{fee.term}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(fee.totalAmount)}</td>
                  <td className="py-3 px-4 text-center">
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
                  <td className="py-3 px-4 text-[11px]">
                    {fee.status === 'Paid' ? (
                      <div>
                        <span className="text-slate-900 font-semibold">{fee.paymentMethod}</span>
                        <div className="text-slate-400 font-mono text-[10px]">{fee.transactionId}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-mono">Due: {formatDate(fee.dueDate)}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingFee({ ...fee })}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200"
                        title="Edit Invoice Details & Breakdown"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFee(fee.id, fee.invoiceNo)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {fee.status === 'Paid' ? (
                        <button
                          onClick={() => setActiveReceiptModal(fee)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                          title="View Official Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSendReminder(fee.studentName, fee.invoiceNo)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 transition-colors border border-slate-200"
                            title="Send Reminder"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleManualSettle(fee.id, fee.invoiceNo)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase shadow-xs"
                          >
                            Settle
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Generate New Student Fee Invoice"
        subtitle="Issue a tuition and activity billing statement"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateFee} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Scholar *</label>
            <select
              value={formData.studentId}
              onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade}-{s.section} • Roll #{s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Billing Term</label>
              <input
                type="text"
                value={formData.term}
                onChange={e => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h5 className="font-bold text-slate-800">Fee Breakdown (USD / INR)</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-500 text-[11px]">Tuition</label>
                <input
                  type="number"
                  value={formData.tuition}
                  onChange={e => setFormData({ ...formData, tuition: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px]">Transport</label>
                <input
                  type="number"
                  value={formData.transport}
                  onChange={e => setFormData({ ...formData, transport: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px]">Labs & Library</label>
                <input
                  type="number"
                  value={formData.labAndLibrary}
                  onChange={e => setFormData({ ...formData, labAndLibrary: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px]">Sports & Clubs</label>
                <input
                  type="number"
                  value={formData.sportsAndActivities}
                  onChange={e => setFormData({ ...formData, sportsAndActivities: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px]">Development Fund</label>
                <input
                  type="number"
                  value={formData.developmentFund}
                  onChange={e => setFormData({ ...formData, developmentFund: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px]">Initial Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Fee Modal */}
      <Modal
        isOpen={editingFee !== null}
        onClose={() => setEditingFee(null)}
        title="Edit Fee Invoice"
        subtitle={editingFee ? `Invoice #${editingFee.invoiceNo} • ${editingFee.studentName}` : ''}
        maxWidth="lg"
      >
        {editingFee && (
          <form onSubmit={handleUpdateFee} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Term</label>
                <input
                  type="text"
                  value={editingFee.term}
                  onChange={e => setEditingFee({ ...editingFee, term: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={editingFee.status}
                  onChange={e => setEditingFee({ ...editingFee, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  value={editingFee.dueDate}
                  onChange={e => setEditingFee({ ...editingFee, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tuition Amount</label>
                <input
                  type="number"
                  value={editingFee.breakdown.tuition}
                  onChange={e => setEditingFee({
                    ...editingFee,
                    breakdown: { ...editingFee.breakdown, tuition: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingFee(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
              >
                Save Invoice Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Payment Receipt Modal */}
      <PaymentModal
        feeItem={activeReceiptModal}
        isOpen={activeReceiptModal !== null}
        onClose={() => setActiveReceiptModal(null)}
      />
    </div>
  );
};
