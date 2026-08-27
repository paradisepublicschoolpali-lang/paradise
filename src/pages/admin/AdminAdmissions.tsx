import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { AdmissionApplication, Student } from '../../types';
import { FileCheck2, Search, CheckCircle2, XCircle, UserPlus, Edit3, Trash2, Key } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const AdminAdmissions: React.FC = () => {
  const { admissions, updateAdmissionStatus, updateAdmissionApplication, deleteAdmissionApplication, convertApplicationToStudent } = useSchoolData();
  const { toast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAppModal, setActiveAppModal] = useState<AdmissionApplication | null>(null);
  const [enrollingApp, setEnrollingApp] = useState<AdmissionApplication | null>(null);
  
  // Enrolment custom state
  const [customLoginId, setCustomLoginId] = useState('');
  const [customPassword, setCustomPassword] = useState('password123');
  const [customGrade, setCustomGrade] = useState('Grade 8');
  const [customSection, setCustomSection] = useState('A');
  const [customHouse, setCustomHouse] = useState<Student['house']>('Phoenix Gold');

  const statuses = ['All', 'Pending', 'Under Review', 'Interview Scheduled', 'Accepted', 'Rejected'];

  const filteredAdmissions = admissions.filter(app => {
    const matchesStatus = selectedStatus === 'All' || app.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.gradeApplying.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppModal) return;
    updateAdmissionApplication(activeAppModal.id, activeAppModal);
    toast('Application Record Saved!', `Updated details for ${activeAppModal.applicantName}`, 'success');
    setActiveAppModal(null);
  };

  const handleDelete = (id: string, appNo: string) => {
    if (window.confirm(`Delete application ${appNo}?`)) {
      deleteAdmissionApplication(id);
      toast('Application Deleted', `Reference ${appNo} removed`, 'info');
    }
  };

  const handleOpenEnroll = (app: AdmissionApplication) => {
    setEnrollingApp(app);
    const base = app.applicantName.toLowerCase().split(' ')[0];
    setCustomLoginId(`${base}${Math.floor(10 + Math.random() * 90)}`);
    setCustomPassword('password123');
    setCustomGrade(app.gradeApplying.includes('Grade') ? app.gradeApplying : 'Grade 10');
  };

  const handleConfirmEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollingApp) return;

    convertApplicationToStudent(enrollingApp.id, {
      loginId: customLoginId,
      password: customPassword,
      grade: customGrade,
      section: customSection,
      house: customHouse
    });

    toast('Scholar Enrolled & Login ID Generated!', `Login ID: ${customLoginId} | Password: ${customPassword}`, 'success');
    setEnrollingApp(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Admissions & Enrolment Bureau</h3>
          <p className="text-xs text-slate-500">
            Total Applications: {admissions.length} • Review dossiers, schedule candidate interviews, and 1-click enroll scholars
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
            {admissions.filter(a => a.status === 'Accepted').length} Accepted Offers
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedStatus === s
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidate, app #, parent..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">App Number</th>
                <th className="py-3 px-4 font-semibold">Candidate Info</th>
                <th className="py-3 px-4 font-semibold">Grade Applying</th>
                <th className="py-3 px-4 font-semibold">Guardian Contact</th>
                <th className="py-3 px-4 font-semibold text-center">Submission Date</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAdmissions.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{app.applicationNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-sm">{app.applicantName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">DOB: {app.dob} ({app.gender})</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-slate-800 text-[11px]">
                      {app.gradeApplying}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <div className="font-semibold text-slate-900">{app.parentName}</div>
                    <div className="text-slate-500 font-mono">{app.parentPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-500">
                    {formatDate(app.submissionDate)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setActiveAppModal({ ...app })}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 transition-colors border border-slate-200"
                        title="Review / Edit Application Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      
                      <button
                        onClick={() => handleOpenEnroll(app)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase flex items-center gap-1 shadow-xs"
                        title="Enroll directly into Student Body"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Enroll Scholar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(app.id, app.applicationNo)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200"
                        title="Delete Application"
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

      {/* Edit Application Modal */}
      <Modal
        isOpen={activeAppModal !== null}
        onClose={() => setActiveAppModal(null)}
        title="Review & Edit Application Dossier"
        subtitle={activeAppModal ? `Application #${activeAppModal.applicationNo} • ${activeAppModal.applicantName}` : ''}
        maxWidth="lg"
      >
        {activeAppModal && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Applicant Name</label>
                <input
                  type="text"
                  required
                  value={activeAppModal.applicantName}
                  onChange={e => setActiveAppModal({ ...activeAppModal, applicantName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Grade Applying For</label>
                <input
                  type="text"
                  required
                  value={activeAppModal.gradeApplying}
                  onChange={e => setActiveAppModal({ ...activeAppModal, gradeApplying: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Parent Name</label>
                <input
                  type="text"
                  required
                  value={activeAppModal.parentName}
                  onChange={e => setActiveAppModal({ ...activeAppModal, parentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Parent Phone</label>
                <input
                  type="text"
                  required
                  value={activeAppModal.parentPhone}
                  onChange={e => setActiveAppModal({ ...activeAppModal, parentPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Admission Board Decision Status</label>
              <select
                value={activeAppModal.status}
                onChange={e => setActiveAppModal({ ...activeAppModal, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending Evaluation</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Accepted">Accepted / Offer Extended</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Directorate Remarks & Notes</label>
              <textarea
                rows={3}
                value={activeAppModal.notes || ''}
                onChange={e => setActiveAppModal({ ...activeAppModal, notes: e.target.value })}
                placeholder="State interview date, test score remarks..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveAppModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
              >
                Save Application
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 1-Click Enroll Modal */}
      <Modal
        isOpen={enrollingApp !== null}
        onClose={() => setEnrollingApp(null)}
        title="Enroll Candidate Directly as Active Student"
        subtitle={enrollingApp ? `Assigning Student ID & Credentials for ${enrollingApp.applicantName}` : ''}
        maxWidth="lg"
      >
        {enrollingApp && (
          <form onSubmit={handleConfirmEnroll} className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Parent / Student Portal Login Credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Login ID *</label>
                  <input
                    type="text"
                    required
                    value={customLoginId}
                    onChange={e => setCustomLoginId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Allocated Grade</label>
                <select
                  value={customGrade}
                  onChange={e => setCustomGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Nursery">Nursery</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8 (Senior)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Section</label>
                <input
                  type="text"
                  value={customSection}
                  onChange={e => setCustomSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">House</label>
                <select
                  value={customHouse}
                  onChange={e => setCustomHouse(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Phoenix Gold">Phoenix Gold</option>
                  <option value="Royal Gryphon">Royal Gryphon</option>
                  <option value="Emerald Dragon">Emerald Dragon</option>
                  <option value="Solar Falcon">Solar Falcon</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEnrollingApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider"
              >
                Confirm Enrolment & Create Student
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
