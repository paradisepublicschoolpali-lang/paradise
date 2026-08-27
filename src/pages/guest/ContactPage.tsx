import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { emailService } from '../../services/emailService';

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
  const [isSending, setIsSending] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{ message: string; provider: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast('Please fill all mandatory fields', '', 'error');
      return;
    }

    setIsSending(true);
    try {
      const result = await emailService.sendContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      setSubmitted(true);
      setDispatchResult({ message: result.message, provider: result.providerUsed });
      toast(
        result.fallbackTriggered ? 'Webmail Opened!' : 'Inquiry Dispatched!',
        result.message,
        'success'
      );
    } catch (err: any) {
      toast('Failed to dispatch', err?.message || 'Could not send email', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenGmail = () => {
    emailService.openGmailComposer({
      to: 'paradisepublicschool.pali@gmail.com',
      subject: `[Website Inquiry] ${formData.subject} - from ${formData.name}`,
      body: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    });
  };

  const handleOpenMailApp = () => {
    emailService.openDefaultMailClient({
      to: 'paradisepublicschool.pali@gmail.com',
      subject: `[Website Inquiry] ${formData.subject} - from ${formData.name}`,
      body: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    );
    toast('Inquiry Copied to Clipboard', '', 'info');
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
                    <span className="text-slate-600">42 Heritage Avenue, North Campus Enclave, New Delhi - 110007, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 text-sm">Admissions Helpline</strong>
                    <span className="text-slate-600">+91 11 2765 4321 / +91 98110 12345</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 text-sm">Official Email Desk</strong>
                    <span className="text-slate-600 font-mono text-xs">paradisepublicschool.pali@gmail.com</span>
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
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div>
                    <h4 className="text-base font-bold text-emerald-900 font-cinzel">Inquiry Transmitted Successfully</h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      {dispatchResult?.message || 'Inquiry sent to paradisepublicschool.pali@gmail.com. Our administrative desk will contact you within 24 hours.'}
                    </p>
                    {dispatchResult?.provider && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        Dispatched via: {dispatchResult.provider}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenGmail}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>Open in Gmail</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 shadow-xs cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
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
                        placeholder="e.g. Rajesh Sharma"
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
                        placeholder="name@gmail.com"
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
                        placeholder="+91 98110 00000"
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

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Email...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message to Admissions (Live Email)</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                      <span>Recipient: <strong className="font-mono text-slate-700">paradisepublicschool.pali@gmail.com</strong></span>
                      <button
                        type="button"
                        onClick={handleOpenGmail}
                        className="text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Send directly in Gmail</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
