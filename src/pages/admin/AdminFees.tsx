import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { FeeItem, Student } from '../../types';
import {
  CreditCard,
  Search,
  Mail,
  Printer,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  User,
  Filter,
  Send,
  Copy,
  ExternalLink,
  Users,
  AlertTriangle,
  Loader2,
  Globe
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { PaymentModal } from '../../components/common/PaymentModal';
import { Modal } from '../../components/common/Modal';
import { emailService } from '../../services/emailService';

export const AdminFees: React.FC = () => {
  const { fees, students, addFeeInvoice, updateFeeInvoice, deleteFeeInvoice, payFeeInvoice } = useSchoolData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('All');
  const [activeReceiptModal, setActiveReceiptModal] = useState<FeeItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);

  // Email Dispatch Modal States
  const [emailModalFee, setEmailModalFee] = useState<FeeItem | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [previewHtmlMode, setPreviewHtmlMode] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [selectedBulkFeeIds, setSelectedBulkFeeIds] = useState<string[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // New Invoice Form (Tuition only)
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || 'std-1',
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    tuition: 35000,
    status: 'Pending' as FeeItem['status']
  });

  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.paidAmount, 0);
  const pendingFees = fees.filter(f => f.status === 'Pending' || f.status === 'Overdue');
  const totalOutstanding = pendingFees.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const filteredFees = fees.filter(f => {
    const matchesStatus = selectedStatus === 'All' || f.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesStudent = selectedStudentFilter === 'All' || f.studentId === selectedStudentFilter;
    const matchesSearch = f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.grade.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesStudent && matchesSearch;
  });

  // Open Single Student Email Composer with Styled Format & Payment Link
  const handleOpenEmailModal = (fee: FeeItem) => {
    const student = students.find(s => s.id === fee.studentId || s.name === fee.studentName);
    const recipient = student?.guardianEmail || `${fee.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const subject = `[URGENT] Tuition Fee Due Notice - ${fee.studentName} (${fee.grade}) • Invoice #${fee.invoiceNo}`;
    const paymentUrl = emailService.getPaymentUrl();

    const body = emailService.generateFeeEmailText({
      studentName: fee.studentName,
      grade: fee.grade,
      rollNo: student?.rollNo || 'N/A',
      invoiceNo: fee.invoiceNo,
      term: fee.term,
      amountFormatted: formatCurrency(fee.totalAmount),
      dueDateFormatted: formatDate(fee.dueDate),
      paymentLink: paymentUrl
    });

    setEmailModalFee(fee);
    setEmailRecipient(recipient);
    setEmailSubject(subject);
    setEmailMessage(body);
    setPreviewHtmlMode(false);
  };

  // Open Bulk Email Dispatcher
  const handleOpenBulkEmailModal = () => {
    setSelectedBulkFeeIds(pendingFees.map(f => f.id));
    setIsBulkEmailModalOpen(true);
  };

  // 1-Click Send via Gmail Webmail in Browser
  const handleSendViaGmailWeb = () => {
    if (!emailRecipient) {
      toast('Recipient email is required', '', 'error');
      return;
    }
    emailService.openGmailComposer({
      to: emailRecipient,
      subject: emailSubject,
      body: emailMessage
    });
    toast('Gmail Compose Window Opened!', `Pre-filled email to ${emailRecipient}`, 'success');
  };

  // Launch User's Default Desktop Mail Client
  const handleSendViaMailClient = () => {
    if (!emailRecipient) {
      toast('Recipient email is required', '', 'error');
      return;
    }
    emailService.openDefaultMailClient({
      to: emailRecipient,
      subject: emailSubject,
      body: emailMessage
    });
    toast('Mail Client Opened!', `Email composed to ${emailRecipient}`, 'info');
  };

  // 1-Click Copy Email to Clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailMessage);
    toast('Email Copied to Clipboard!', 'Ready to paste into Gmail or your email client', 'info');
  };

  // Dispatch System Automated Email (Cloud / API)
  const handleDispatchSystemEmail = async () => {
    if (!emailRecipient) {
      toast('Recipient email is required', '', 'error');
      return;
    }

    setIsSendingEmail(true);
    try {
      const result = await emailService.sendEmail({
        to: emailRecipient,
        subject: emailSubject,
        message: emailMessage,
        fromName: 'Paradise Public School Accounts',
        replyTo: 'paradisepublicschool.pali@gmail.com'
      });

      toast(
        result.fallbackTriggered ? 'Webmail Opened!' : 'Email Dispatched!',
        result.message,
        'success'
      );
      if (!result.fallbackTriggered) {
        setEmailModalFee(null);
      }
    } catch (err: any) {
      toast('Dispatch Failed', err?.message || 'Unable to send email', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Dispatch Bulk Emails Action via Gmail Web / Cloud
  const handleDispatchBulkEmails = async (mode: 'gmail' | 'mailapp' | 'cloud') => {
    const selectedFees = pendingFees.filter(f => selectedBulkFeeIds.includes(f.id));
    const recipientEmails = selectedFees.map(f => {
      const s = students.find(std => std.id === f.studentId || std.name === f.studentName);
      return s?.guardianEmail || `${f.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    });

    const bccString = recipientEmails.join(', ');
    const bulkSubject = `[URGENT] Paradise Public School - Tuition Fee Dues Notice (Quarter 3)`;
    const paymentUrl = emailService.getPaymentUrl();
    const bulkBody = `======================================================================
           🏛️  PARADISE PUBLIC SCHOOL, NEW DELHI
     CBSE Affiliation No: 2130842 • School Code: 71234
======================================================================
OFFICIAL TUITION FEE DUES NOTICE • ACADEMIC SESSION 2026-2027

Dear Parents / Guardians,

Greetings from Paradise Public School.

This is an official notice regarding outstanding Tuition Fees for the ongoing academic term.

Please settle any pending tuition dues before the upcoming deadline to ensure uninterrupted academic and portal access.

💳 1-CLICK ONLINE FEE PAYMENT LINK:
👉 ${paymentUrl}

(Log in to your Parent Portal to view your child's quarterly invoice and pay online via UPI, RuPay, Credit/Debit Card or Net Banking)

⚡ OTHER PAYMENT OPTIONS:
• Instant UPI ID  : paradiseschool@sbi (Google Pay / PhonePe / Paytm / BHIM)
• Accounts Counter: Open Monday to Saturday, 08:30 AM to 03:00 PM

Helpline: +91 11 2765 4321 / +91 98110 12345
Official Accounts Desk: paradisepublicschool.pali@gmail.com
======================================================================`;

    if (mode === 'gmail') {
      emailService.openGmailComposer({
        to: 'paradisepublicschool.pali@gmail.com',
        bcc: bccString,
        subject: bulkSubject,
        body: bulkBody
      });
      toast('Bulk Gmail Composer Opened!', `Pre-filled with ${recipientEmails.length} guardian BCC recipients & payment link`, 'success');
      setIsBulkEmailModalOpen(false);
      return;
    }

    if (mode === 'mailapp') {
      emailService.openDefaultMailClient({
        to: 'paradisepublicschool.pali@gmail.com',
        bcc: bccString,
        subject: bulkSubject,
        body: bulkBody
      });
      toast('Mail App Opened for Bulk Send!', `BCC populated with ${recipientEmails.length} recipients & payment link`, 'info');
      setIsBulkEmailModalOpen(false);
      return;
    }

    // Cloud Automated Batch Send
    setIsSendingEmail(true);
    try {
      let sentCount = 0;
      for (const fee of selectedFees) {
        const s = students.find(std => std.id === fee.studentId || std.name === fee.studentName);
        const email = s?.guardianEmail || `${fee.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
        await emailService.sendFeeReminder({
          studentName: fee.studentName,
          grade: fee.grade,
          rollNo: s?.rollNo || 'N/A',
          invoiceNo: fee.invoiceNo,
          term: fee.term,
          amount: fee.totalAmount,
          dueDate: fee.dueDate,
          recipientEmail: email
        });
        sentCount++;
      }
      toast('Bulk Dispatch Complete!', `Dispatched ${sentCount} notices with payment links to guardians`, 'success');
      setIsBulkEmailModalOpen(false);
    } catch (err: any) {
      toast('Batch sending issue', err?.message || 'Some emails could not be sent', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCreateFee = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStudent = students.find(s => s.id === formData.studentId) || students[0];
    const tuitionAmount = Number(formData.tuition);

    addFeeInvoice({
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      grade: `${selectedStudent.grade}-${selectedStudent.section}`,
      term: formData.term,
      dueDate: formData.dueDate,
      breakdown: {
        tuition: tuitionAmount
      },
      totalAmount: tuitionAmount,
      status: formData.status
    });

    toast('Tuition Fee Invoiced!', `Billed to ${selectedStudent.name} for ${formatCurrency(tuitionAmount)}`, 'success');
    setIsAddModalOpen(false);
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    const tuitionAmount = Number(editingFee.breakdown.tuition);

    updateFeeInvoice(editingFee.id, {
      ...editingFee,
      breakdown: {
        tuition: tuitionAmount
      },
      totalAmount: tuitionAmount,
      paidAmount: editingFee.status === 'Paid' ? tuitionAmount : 0
    });

    toast('Tuition Fee Updated', `Committed changes for invoice ${editingFee.invoiceNo} (${formatCurrency(tuitionAmount)})`, 'success');
    setEditingFee(null);
  };

  const handleDeleteFee = (id: string, invoiceNo: string) => {
    if (window.confirm(`Delete fee invoice ${invoiceNo}?`)) {
      deleteFeeInvoice(id);
      toast('Invoice Deleted', `Record ${invoiceNo} removed`, 'info');
    }
  };

  const handleManualSettle = (feeId: string, invoiceNo: string) => {
    payFeeInvoice(feeId, 'UPI');
    toast('Invoice Settled', `Invoice ${invoiceNo} marked as Paid via Cash / UPI Counter`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Student Tuition Fee Treasury</h3>
          <p className="text-xs text-slate-500">
            Manage tuition billing in ₹ INR • Send official email reminders to pending fee scholars from <strong className="font-mono text-blue-700">paradisepublicschool.pali@gmail.com</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingFees.length > 0 && (
            <button
              onClick={handleOpenBulkEmailModal}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Email All Pending ({pendingFees.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Tuition Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Tuition Collected</span>
          <div className="text-3xl font-bold font-cinzel text-emerald-600 mt-1">{formatCurrency(totalCollected)}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Reconciled in treasury account</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Pending Tuition Dues</span>
          <div className="text-3xl font-bold font-cinzel text-amber-600 mt-1">{formatCurrency(totalOutstanding)}</div>
          <span className="text-[11px] text-slate-500">{pendingFees.length} student account(s) awaiting payment</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Official Email Dispatch Desk</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate font-mono text-xs text-blue-700">
              paradisepublicschool.pali@gmail.com
            </div>
          </div>
          <button
            onClick={handleOpenBulkEmailModal}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Send Bulk Fee Reminder Emails</span>
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

          {/* Student Filter */}
          <div className="flex items-center gap-1.5 ml-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStudentFilter}
              onChange={e => setSelectedStudentFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Scholars</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade}-{s.section})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scholar name, invoice #, class..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Tuition Fee Invoices ({filteredFees.length} records)</span>
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            Sender: paradisepublicschool.pali@gmail.com
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice #</th>
                <th className="py-3 px-4 font-semibold">Scholar Name</th>
                <th className="py-3 px-4 font-semibold">Guardian Email</th>
                <th className="py-3 px-4 font-semibold">Billing Term</th>
                <th className="py-3 px-4 font-semibold text-right">Tuition Fee (₹)</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Payment Info</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No tuition fee invoices match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredFees.map(fee => {
                  const student = students.find(s => s.id === fee.studentId || s.name === fee.studentName);
                  const guardianEmail = student?.guardianEmail || `${fee.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

                  return (
                    <tr key={fee.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{fee.invoiceNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{fee.studentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{fee.grade}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                        {guardianEmail}
                      </td>
                      <td className="py-3 px-4 font-medium">{fee.term}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {formatCurrency(fee.breakdown?.tuition || fee.totalAmount)}
                      </td>
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
                            <span className="text-slate-900 font-semibold">{fee.paymentMethod || 'UPI'}</span>
                            <div className="text-slate-400 font-mono text-[10px]">{fee.transactionId || 'Counter Deposit'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono">Due: {formatDate(fee.dueDate)}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingFee({ ...fee })}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                            title="Edit Tuition Fee"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFee(fee.id, fee.invoiceNo)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {fee.status === 'Paid' ? (
                            <button
                              onClick={() => setActiveReceiptModal(fee)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                              title="View Official Tax Receipt"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenEmailModal(fee)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center gap-1 border border-blue-200 cursor-pointer"
                                title="Compose & Send Tuition Due Email to Guardian"
                              >
                                <Mail className="w-3.5 h-3.5 text-blue-600" />
                                <span>Send Mail</span>
                              </button>
                              <button
                                onClick={() => handleManualSettle(fee.id, fee.invoiceNo)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase shadow-xs cursor-pointer"
                              >
                                Settle
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Email Dispatch Modal */}
      <Modal
        isOpen={emailModalFee !== null}
        onClose={() => setEmailModalFee(null)}
        title="Send Tuition Fee Due Notice (Email Dispatch)"
        subtitle={emailModalFee ? `Scholar: ${emailModalFee.studentName} (${emailModalFee.grade}) • Invoice #${emailModalFee.invoiceNo}` : ''}
        maxWidth="2xl"
      >
        {emailModalFee && (
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-blue-800 font-semibold block">Sender Address:</span>
                <strong className="text-blue-950 font-mono">paradisepublicschool.pali@gmail.com</strong>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-200 text-blue-900 font-bold text-[10px]">
                Accounts & Treasury Bureau
              </span>
            </div>

            {/* Recipient & Subject */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Recipient Guardian Email *</label>
                <input
                  type="email"
                  required
                  value={emailRecipient}
                  onChange={e => setEmailRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Subject Line *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPreviewHtmlMode(false)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        !previewHtmlMode ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Text / Mailto View
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewHtmlMode(true)}
                      className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        previewHtmlMode ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Executive HTML Card Preview
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer text-xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </button>
                </div>

                {!previewHtmlMode ? (
                  <textarea
                    rows={11}
                    value={emailMessage}
                    onChange={e => setEmailMessage(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-800 font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                ) : (
                  /* Live HTML Email Preview Box */
                  <div className="rounded-2xl border border-slate-300 overflow-hidden bg-slate-900 shadow-inner max-h-[380px] overflow-y-auto">
                    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 p-5 text-center text-white border-b-2 border-amber-500 space-y-1">
                      <div className="inline-block bg-white text-blue-900 font-bold px-3 py-0.5 rounded-md text-xs tracking-widest font-serif">
                        PARADISE
                      </div>
                      <h4 className="text-base font-bold font-cinzel text-white">PARADISE PUBLIC SCHOOL</h4>
                      <p className="text-[10px] text-blue-200 uppercase tracking-wider">CBSE Affiliation No: 2130842 • School Code: 71234</p>
                    </div>

                    <div className="p-5 bg-white space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          ⚠️ Tuition Fee Notice
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">Invoice #{emailModalFee.invoiceNo}</span>
                      </div>

                      <p className="text-slate-700">
                        Dear Parent / Guardian of <strong>{emailModalFee.studentName}</strong>,
                        <br />
                        <span className="text-slate-500 text-[11px]">
                          This is a formal reminder regarding the outstanding tuition fees for {emailModalFee.term}.
                        </span>
                      </p>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex justify-between text-slate-600">
                          <span>Scholar Name:</span>
                          <strong className="text-slate-900">{emailModalFee.studentName} ({emailModalFee.grade})</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Billing Term:</span>
                          <span className="text-slate-900 font-medium">{emailModalFee.term}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Payment Due Date:</span>
                          <span className="text-red-600 font-bold">{formatDate(emailModalFee.dueDate)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-blue-900 font-bold">
                          <span>Total Amount Due:</span>
                          <span className="text-lg font-black font-mono text-blue-700">{formatCurrency(emailModalFee.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Prominent Payment Button */}
                      <div className="text-center pt-2">
                        <a
                          href={emailService.getPaymentUrl()}
                          target="_blank"
                          rel="noreferrer"
                          className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs uppercase tracking-wider shadow-md text-center transition-all cursor-pointer"
                        >
                          💳 Pay Tuition Fee Online (Parent Portal) &rarr;
                        </a>
                        <span className="block mt-1.5 text-[10px] text-slate-400">
                          Direct Link: <span className="text-blue-600 underline font-mono">{emailService.getPaymentUrl()}</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-950 space-y-1">
                        <strong>⚡ Quick UPI ID:</strong> <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">paradiseschool@sbi</span>
                        <div className="text-[10px] text-blue-700">Supported: Google Pay, PhonePe, Paytm, BHIM & Net Banking</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEmailModalFee(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer text-xs"
              >
                Cancel
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendViaGmailWeb}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold flex items-center gap-1.5 border border-slate-300 shadow-xs cursor-pointer text-xs"
                  title="Open 1-Click Gmail Webmail with pre-filled content & payment link"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Send with Gmail Web</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendViaMailClient}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold flex items-center gap-1.5 border border-blue-200 cursor-pointer text-xs"
                  title="Open Desktop Mail App"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Desktop Mail App</span>
                </button>

                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={handleDispatchSystemEmail}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Cloud Notice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Pending Fees Email Dispatcher Modal */}
      <Modal
        isOpen={isBulkEmailModalOpen}
        onClose={() => setIsBulkEmailModalOpen(false)}
        title="Batch Email Dispatcher: Pending Tuition Fees"
        subtitle={`Select scholars with pending dues to dispatch email notices from paradisepublicschool.pali@gmail.com`}
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h5 className="font-bold text-amber-950">Pending Fee Scholars: {pendingFees.length}</h5>
                <p className="text-amber-800 text-[11px]">
                  Selected: {selectedBulkFeeIds.length} scholars • Total Outstanding: {formatCurrency(
                    pendingFees.filter(f => selectedBulkFeeIds.includes(f.id)).reduce((sum, curr) => sum + curr.totalAmount, 0)
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (selectedBulkFeeIds.length === pendingFees.length) {
                  setSelectedBulkFeeIds([]);
                } else {
                  setSelectedBulkFeeIds(pendingFees.map(f => f.id));
                }
              }}
              className="text-amber-900 font-bold underline cursor-pointer text-[11px]"
            >
              {selectedBulkFeeIds.length === pendingFees.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Student Checklist */}
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-100">
            {pendingFees.map(fee => {
              const student = students.find(s => s.id === fee.studentId || s.name === fee.studentName);
              const email = student?.guardianEmail || `${fee.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
              const isChecked = selectedBulkFeeIds.includes(fee.id);

              return (
                <label
                  key={fee.id}
                  className={`p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                    isChecked ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedBulkFeeIds([...selectedBulkFeeIds, fee.id]);
                        } else {
                          setSelectedBulkFeeIds(selectedBulkFeeIds.filter(id => id !== fee.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <div>
                      <strong className="text-slate-900 block">{fee.studentName} ({fee.grade})</strong>
                      <span className="text-[10px] text-slate-500 font-mono">{email} • Invoice #{fee.invoiceNo}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">{formatCurrency(fee.totalAmount)}</div>
                    <span className="text-[10px] text-amber-600 font-semibold">{fee.term}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Sender & Dispatch Info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <div><strong>Sender Address:</strong> paradisepublicschool.pali@gmail.com</div>
            <div><strong>Dispatch Protocol:</strong> Automated batch delivery or pre-filled Gmail Web BCC</div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsBulkEmailModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer text-xs"
            >
              Cancel
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={selectedBulkFeeIds.length === 0}
                onClick={() => handleDispatchBulkEmails('gmail')}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 cursor-pointer text-xs"
                title="Open Gmail in browser with all recipients in BCC"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Open in Gmail (BCC)</span>
              </button>

              <button
                type="button"
                disabled={selectedBulkFeeIds.length === 0}
                onClick={() => handleDispatchBulkEmails('mailapp')}
                className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1.5 cursor-pointer text-xs"
                title="Open default desktop mail client"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Desktop Mail (BCC)</span>
              </button>

              <button
                type="button"
                disabled={selectedBulkFeeIds.length === 0 || isSendingEmail}
                onClick={() => handleDispatchBulkEmails('cloud')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching {selectedBulkFeeIds.length}...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Automated Cloud ({selectedBulkFeeIds.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Tuition Fee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Generate Scholar Tuition Invoice"
        subtitle="Issue quarterly or annual tuition billing for a specific student"
        maxWidth="md"
      >
        <form onSubmit={handleCreateFee} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Scholar *</label>
            <select
              value={formData.studentId}
              onChange={e => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
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
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
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

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tuition Fee Amount (₹) *</label>
              <input
                type="number"
                min={0}
                required
                value={formData.tuition}
                onChange={e => setFormData({ ...formData, tuition: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-base"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              Issue Tuition Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Tuition Fee Modal */}
      <Modal
        isOpen={editingFee !== null}
        onClose={() => setEditingFee(null)}
        title="Edit Scholar Tuition Fee"
        subtitle={editingFee ? `Invoice #${editingFee.invoiceNo} • Scholar: ${editingFee.studentName}` : ''}
        maxWidth="md"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Status</label>
                <select
                  value={editingFee.status}
                  onChange={e => setEditingFee({ ...editingFee, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={editingFee.dueDate}
                onChange={e => setEditingFee({ ...editingFee, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-slate-700 font-bold mb-1">Tuition Fee (₹) *</label>
              <input
                type="number"
                min={0}
                required
                value={editingFee.breakdown?.tuition || editingFee.totalAmount}
                onChange={e => setEditingFee({
                  ...editingFee,
                  breakdown: { tuition: Number(e.target.value) },
                  totalAmount: Number(e.target.value)
                })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-base"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingFee(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Tuition Changes
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
