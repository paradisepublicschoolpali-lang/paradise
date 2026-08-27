import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, FileText, Send, Calendar, DollarSign, Sparkles, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { emailService } from '../../services/emailService';

export const AdmissionsPage: React.FC = () => {
  const { submitAdmission } = useSchoolData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    applicantName: '',
    gradeApplying: 'Grade 1',
    dob: '',
    gender: 'Male' as const,
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    previousSchool: ''
  });

  const [submittedAppNo, setSubmittedAppNo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.parentName || !formData.parentEmail || !formData.parentPhone) {
      toast('Please fill all mandatory fields', '', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const appNo = submitAdmission(formData);
      setSubmittedAppNo(appNo);

      // Dispatch confirmation email
      await emailService.sendAdmissionConfirmation({
        applicationNo: appNo,
        applicantName: formData.applicantName,
        gradeApplying: formData.gradeApplying,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        submissionDate: new Date().toISOString().split('T')[0]
      });

      toast('Application Registered & Confirmation Sent!', `Application reference: ${appNo}`, 'success');
    } catch (err: any) {
      toast('Submission Recorded', 'Application registered in database', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { step: '01', title: 'Submit Online Application', desc: 'Complete the digital form with student details and academic records.' },
    { step: '02', title: 'Aptitude Assessment', desc: 'Short diagnostic evaluation in Mathematics, Science, and Language.' },
    { step: '03', title: 'Interactive Interview', desc: 'Personal interaction with candidate and parents by Academic Panel.' },
    { step: '04', title: 'Offer & Enrolment', desc: 'Formal offer letter dispatched followed by document verification.' },
  ];

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Enrolment 2026-27</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">Admissions & Enrolment Bureau</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Join a vibrant community committed to academic distinction, character, and global leadership.
          </p>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">How to Apply</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">4-Step Admission Journey</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
              <div className="text-4xl font-black font-cinzel text-blue-600 opacity-20">{s.step}</div>
              <h3 className="text-base font-bold text-slate-900 font-cinzel">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Admission Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-blue-600 uppercase">Direct Application</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-slate-900">Online Enrolment Form</h2>
            <p className="text-xs text-slate-500">Academic Year 2026-2027 • All Grades</p>
          </div>

          {submittedAppNo ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-emerald-900 font-cinzel">Application Successfully Registered!</h3>
              <p className="text-sm text-emerald-800">
                Your application reference ID is: <strong className="font-mono text-base">{submittedAppNo}</strong>
              </p>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                An email confirmation with assessment guidelines has been sent from <strong>paradisepublicschool.pali@gmail.com</strong> to your registered email. The admissions bureau will contact you shortly.
              </p>
              <button
                onClick={() => setSubmittedAppNo(null)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={e => setFormData({ ...formData, applicantName: e.target.value })}
                    placeholder="e.g. Reyansh Malhotra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grade Applying For *</label>
                  <select
                    value={formData.gradeApplying}
                    onChange={e => setFormData({ ...formData, gradeApplying: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="Nursery">Early Years: Nursery</option>
                    <option value="Kindergarten">Early Years: Kindergarten (LKG / UKG)</option>
                    <option value="Grade 1">Primary: Grade 1</option>
                    <option value="Grade 2">Primary: Grade 2</option>
                    <option value="Grade 3">Primary: Grade 3</option>
                    <option value="Grade 4">Primary: Grade 4</option>
                    <option value="Grade 5">Primary: Grade 5</option>
                    <option value="Grade 6">Middle School: Grade 6</option>
                    <option value="Grade 7">Middle School: Grade 7</option>
                    <option value="Grade 8">Middle School: Grade 8 (Senior Class)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Pooja Malhotra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.parentEmail}
                    onChange={e => setFormData({ ...formData, parentEmail: e.target.value })}
                    placeholder="parent@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="+91 98110 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registering & Sending Confirmation...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Dossier & Receive Confirmation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
