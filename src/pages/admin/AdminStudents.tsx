import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Student, FeeItem } from '../../types';
import { Users, Search, Plus, Trash2, Edit3, Download, Key, Eye, EyeOff, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const AdminStudents: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, fees, addFeeInvoice } = useSchoolData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [feeManagingStudent, setFeeManagingStudent] = useState<Student | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    loginId: '',
    password: 'password123',
    grade: 'Class 8',
    section: 'A',
    rollNo: '08A-99',
    admissionNo: `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    house: 'Phoenix Gold' as Student['house'],
    dob: '2012-06-15',
    gender: 'Male' as Student['gender'],
    bloodGroup: 'O+',
    guardianName: '',
    guardianPhone: '+91 ',
    guardianEmail: '',
    address: '',
    busRoute: 'Route 4 - Rohini & Pitampura Express',
    busNumber: 'DL-1PB-0418',
    lockerNumber: 'LK-08A-99',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
  });

  // Student Fee Quick Generation Form (Tuition only)
  const [studentFeeForm, setStudentFeeForm] = useState({
    term: 'Quarter 3 (Oct - Dec 2026)',
    dueDate: '2026-10-15',
    tuition: 35000,
    status: 'Pending' as FeeItem['status']
  });

  const filteredStudents = students.filter(s => {
    const matchesGrade = selectedGrade === 'All' || s.grade.toLowerCase() === selectedGrade.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.loginId && s.loginId.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          s.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.guardianName || !formData.guardianPhone) {
      toast('Please fill all mandatory fields', '', 'error');
      return;
    }

    const assignedLoginId = formData.loginId || formData.name.toLowerCase().split(' ')[0] + Math.floor(10 + Math.random() * 90);

    addStudent({
      ...formData,
      loginId: assignedLoginId,
      password: formData.password || 'password123'
    });

    toast('Student Enrolled & ID Created!', `Student Login ID: ${assignedLoginId} | Password: ${formData.password || 'password123'}`, 'success');
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      loginId: '',
      password: 'password123',
      grade: 'Class 8',
      section: 'A',
      rollNo: '08A-99',
      admissionNo: `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      house: 'Phoenix Gold',
      dob: '2012-06-15',
      gender: 'Male',
      bloodGroup: 'O+',
      guardianName: '',
      guardianPhone: '+91 ',
      guardianEmail: '',
      address: '',
      busRoute: 'Route 4 - Rohini & Pitampura Express',
      busNumber: 'DL-1PB-0418',
      lockerNumber: 'LK-08A-99',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'
    });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, editingStudent);
    toast('Student Profile & Login Credentials Updated', `Saved changes for ${editingStudent.name}`, 'success');
    setEditingStudent(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the school database?`)) {
      deleteStudent(id);
      toast('Student Record Removed', `${name} has been archived`, 'info');
    }
  };

  const handleAddStudentFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeManagingStudent) return;
    const tuitionAmount = Number(studentFeeForm.tuition);

    addFeeInvoice({
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: feeManagingStudent.id,
      studentName: feeManagingStudent.name,
      grade: `${feeManagingStudent.grade}-${feeManagingStudent.section}`,
      term: studentFeeForm.term,
      dueDate: studentFeeForm.dueDate,
      breakdown: {
        tuition: tuitionAmount
      },
      totalAmount: tuitionAmount,
      status: studentFeeForm.status
    });

    toast('Tuition Fee Invoiced!', `Issued ${studentFeeForm.term} tuition fee for ${feeManagingStudent.name} (${formatCurrency(tuitionAmount)})`, 'success');
    setFeeManagingStudent(null);
  };

  const handleExportCsv = () => {
    toast('Exporting Student Body Directory', 'CSV file generated and downloaded', 'info');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Student Directory & Credentials Directorate</h3>
          <p className="text-xs text-slate-500">
            Total Enrolment: {students.length} scholars • Add/Edit student biodata, class, grades, fees & Parent/Student Login IDs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Directory CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Nursery', 'Kindergarten', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map(g => (
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
            placeholder="Search by name, student ID, roll #, guardian..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Scholar Info</th>
                <th className="py-3 px-4 font-semibold">Class / Roll #</th>
                <th className="py-3 px-4 font-semibold">Student Login ID</th>
                <th className="py-3 px-4 font-semibold">Password</th>
                <th className="py-3 px-4 font-semibold">Guardian Contact</th>
                <th className="py-3 px-4 font-semibold text-center">Fee Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map(student => {
                const studentInvoices = fees.filter(f => f.studentId === student.id);
                const hasPendingFee = studentInvoices.some(f => f.status === 'Pending' || f.status === 'Overdue');
                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{student.admissionNo} • {student.house}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">{student.grade} - {student.section}</span>
                      <div className="text-[10px] text-slate-500 font-mono">Roll: {student.rollNo}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200 text-xs">
                        {student.loginId || student.admissionNo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                        {student.password || 'password123'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.guardianName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{student.guardianPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        hasPendingFee ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {hasPendingFee ? 'Dues Pending' : 'Clear'}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{studentInvoices.length} invoices</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setFeeManagingStudent(student)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200 cursor-pointer"
                          title="Generate / Customize Fees for this Scholar"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Bill Fees</span>
                        </button>
                        <button
                          onClick={() => { setEditingStudent({ ...student }); setShowPassword(false); }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                          title="Edit Full Profile & Login Credentials"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Scholar & Assign ID"
        subtitle="Set student information and Parent/Student portal login credentials"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
          {/* Credentials Section */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Parent / Student Portal Login Credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student Login ID *</label>
                <input
                  type="text"
                  required
                  value={formData.loginId}
                  onChange={e => setFormData({ ...formData, loginId: e.target.value })}
                  placeholder="e.g. aryan10 or PPS-2026-0842"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-500">ID used by parent & student to log in</span>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Portal Password *</label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="e.g. password123"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-500">Initial password for this student</span>
              </div>
            </div>
          </div>

          {/* Student Photo Upload */}
          <ImageUploadInput
            label="Student Photograph / Avatar"
            value={formData.avatar}
            onChange={(val) => setFormData({ ...formData, avatar: val })}
            presets={[
              'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300'
            ]}
            shape="square"
            helperText="Upload student photo from device or choose avatar preset."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aryan Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Admission Number</label>
              <input
                type="text"
                value={formData.admissionNo}
                onChange={e => setFormData({ ...formData, admissionNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Grade</label>
              <select
                value={formData.grade}
                onChange={e => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Nursery">Nursery</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8 (Senior)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Roll Number</label>
              <input
                type="text"
                value={formData.rollNo}
                onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">House</label>
              <select
                value={formData.house}
                onChange={e => setFormData({ ...formData, house: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Phoenix Gold">Phoenix Gold</option>
                <option value="Royal Gryphon">Royal Gryphon</option>
                <option value="Emerald Dragon">Emerald Dragon</option>
                <option value="Solar Falcon">Solar Falcon</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Blood Group</label>
              <input
                type="text"
                value={formData.bloodGroup}
                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Parent / Guardian Name *</label>
              <input
                type="text"
                required
                value={formData.guardianName}
                onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="e.g. Vikram Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Guardian Phone *</label>
              <input
                type="tel"
                required
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                placeholder="+91 98110 00000"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Guardian Email</label>
              <input
                type="email"
                value={formData.guardianEmail}
                onChange={e => setFormData({ ...formData, guardianEmail: e.target.value })}
                placeholder="parent@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              Enroll Student & Save ID
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={editingStudent !== null}
        onClose={() => setEditingStudent(null)}
        title="Edit Student Profile & Login ID"
        subtitle={editingStudent ? `${editingStudent.name} (${editingStudent.grade}-${editingStudent.section})` : ''}
        maxWidth="2xl"
      >
        {editingStudent && (
          <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs">
            {/* Credentials Edit */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Key className="w-4 h-4 text-blue-600" />
                <span>Parent / Student Portal Login Credentials</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Login ID</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.loginId || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, loginId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500">Used by student and parent to log in</span>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={editingStudent.password || ''}
                      onChange={e => setEditingStudent({ ...editingStudent, password: e.target.value })}
                      className="w-full px-3 py-2 pr-10 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">Reset or customize password</span>
                </div>
              </div>
            </div>

            {/* Student Photo Upload in Edit Modal */}
            <ImageUploadInput
              label="Student Photograph / Avatar"
              value={editingStudent.avatar}
              onChange={(val) => setEditingStudent({ ...editingStudent, avatar: val })}
              presets={[
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300'
              ]}
              shape="square"
              helperText="Upload local photo from device or choose avatar preset."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.guardianName}
                  onChange={e => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Grade</label>
                <select
                  value={editingStudent.grade}
                  onChange={e => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8 (Senior)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Section</label>
                <input
                  type="text"
                  value={editingStudent.section}
                  onChange={e => setEditingStudent({ ...editingStudent, section: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Roll Number</label>
                <input
                  type="text"
                  value={editingStudent.rollNo}
                  onChange={e => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={editingStudent.guardianPhone}
                  onChange={e => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={editingStudent.address}
                  onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Save All Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Quick Bill Student Tuition Fee Modal */}
      <Modal
        isOpen={feeManagingStudent !== null}
        onClose={() => setFeeManagingStudent(null)}
        title="Custom Tuition Fee for Scholar"
        subtitle={feeManagingStudent ? `${feeManagingStudent.name} (${feeManagingStudent.grade}-${feeManagingStudent.section} • Roll #${feeManagingStudent.rollNo})` : ''}
        maxWidth="md"
      >
        {feeManagingStudent && (
          <form onSubmit={handleAddStudentFee} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Term</label>
                <input
                  type="text"
                  value={studentFeeForm.term}
                  onChange={e => setStudentFeeForm({ ...studentFeeForm, term: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  value={studentFeeForm.dueDate}
                  onChange={e => setStudentFeeForm({ ...studentFeeForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tuition Fee (₹) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={studentFeeForm.tuition}
                  onChange={e => setStudentFeeForm({ ...studentFeeForm, tuition: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={studentFeeForm.status}
                  onChange={e => setStudentFeeForm({ ...studentFeeForm, status: e.target.value as any })}
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
                onClick={() => setFeeManagingStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Issue Tuition Invoice
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
