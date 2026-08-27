import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast('Please fill all mandatory fields', '', 'error');
      return;
    }
    setSubmitted(true);
    toast('Inquiry Dispatched', 'Our administrative desk will contact you within 24 hours.', 'success');
  };

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Connect with Paradise</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">Campus Contact & Directory</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Schedule a personal admissions tour or connect with our administrative and academic directorates.
          </p>
        </div>
      </section>

      {/* Directory & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold font-cinzel text-slate-900">Direct Department Contacts</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 text-sm">Main Campus Address</strong>
                    <span className="text-slate-600">42 Heritage Avenue, North Campus Enclave, New Delhi, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 text-sm">Admissions Hotline</strong>
                    <span className="text-slate-600">+1 (800) 842-PARADISE / +1 (555) 234-8000</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 text-sm">Official Inquiries</strong>
                    <span className="text-slate-600">admissions@paradiseschool.edu / info@paradiseschool.edu</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 text-sm">Visiting Hours</strong>
                    <span className="text-slate-600">Monday to Friday: 08:30 AM - 04:30 PM<br />Saturday: 09:00 AM - 01:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Tour CTA */}
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <h4 className="text-sm font-bold text-blue-900">Book an In-Person Campus Walkthrough</h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Guided visits for prospective families are conducted every Tuesday and Thursday at 10:00 AM.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-cinzel text-slate-900">Send an Inquiry</h3>
                <p className="text-xs text-slate-500 mt-1">Our admissions counselor will respond within 24 hours.</p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Inquiry Transmitted Successfully</h4>
                  <p className="text-xs text-emerald-700">Thank you. An admissions dean will contact you shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-800 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Department</label>
                      <select
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      >
                        <option>Admissions Inquiry</option>
                        <option>Curriculum & Academic Consultation</option>
                        <option>Fee Structure & Scholarships</option>
                        <option>Principal Office</option>
                        <option>Careers & Faculty Vacancies</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Message / Inquiry Details *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention candidate's current grade, target academic year, and specific questions..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Admissions</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
