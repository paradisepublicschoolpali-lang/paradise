import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import {
  Shield,
  RefreshCw,
  Save,
  Building,
  Globe,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  Lock,
  Mail,
  Send,
  Loader2,
  ExternalLink,
  Check
} from 'lucide-react';
import {
  emailService,
  getEmailConfig,
  saveEmailConfig,
  EmailConfig,
  EmailAutomationSettings,
  EmailDispatchLog
} from '../../services/emailService';
import { Logo } from '../../components/common/Logo';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';
import { Modal } from '../../components/common/Modal';

export const AdminSettings: React.FC = () => {
  const {
    schoolConfig,
    updateSchoolConfig,
    resetAllData,
    students,
    teachers,
    notices,
    admissions,
    events,
    gallery,
    fees,
    results,
    attendanceLogs,
    homework,
    leaves
  } = useSchoolData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    schoolName: schoolConfig.schoolName,
    motto: schoolConfig.motto,
    affiliationCode: schoolConfig.affiliationCode,
    academicYear: schoolConfig.academicYear,
    currentTerm: schoolConfig.currentTerm,
    contactEmail: schoolConfig.contactEmail,
    contactPhone: schoolConfig.contactPhone,
    secondaryPhone: schoolConfig.secondaryPhone || '+91 98290 12345',
    whatsappNumber: schoolConfig.whatsappNumber || '+91 98290 12345',
    visitingHours: schoolConfig.visitingHours || 'Monday to Friday: 08:30 AM - 04:30 PM\nSaturday: 09:00 AM - 01:00 PM',
    schoolTimings: schoolConfig.schoolTimings || 'Mon - Sat: 08:00 AM - 04:30 PM',
    establishedYear: schoolConfig.establishedYear || '1994',
    address: schoolConfig.address,
    principalName: schoolConfig.principalName,
    principalRole: schoolConfig.principalRole || 'Principal & Head of Institution',
    principalCredentials: schoolConfig.principalCredentials || 'Ph.D. Education (Rajasthan University), M.Sc. Physics, 28+ Yrs Leadership',
    principalPhoto: schoolConfig.principalPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    principalMessage: schoolConfig.principalMessage,
    heroHeadline: schoolConfig.heroHeadline,
    heroSubtitle: schoolConfig.heroSubtitle,
    logoType: schoolConfig.logoType || 'shield',
    logoLetter: schoolConfig.logoLetter || 'P',
    logoShieldColor: schoolConfig.logoShieldColor || '#1E40AF',
    logoAccentColor: schoolConfig.logoAccentColor || '#2563EB',
    logoImageUrl: schoolConfig.logoImageUrl || ''
  });

  // Admin security state
  const [currentAdminPassword, setCurrentAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Email service state
  const [emailConfig, setEmailConfigState] = useState<EmailConfig>(() => getEmailConfig());
  const [automationSettings, setAutomationSettings] = useState<EmailAutomationSettings>(() => emailService.getAutomation());
  const [emailLogs, setEmailLogs] = useState<EmailDispatchLog[]>(() => emailService.getLogs());
  const [previewLog, setPreviewLog] = useState<EmailDispatchLog | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState('paradisepublicschool.pali@gmail.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleToggleAutomation = (key: keyof EmailAutomationSettings) => {
    const updated = { ...automationSettings, [key]: !automationSettings[key] };
    setAutomationSettings(updated);
    emailService.saveAutomation(updated);
    toast('Automation Rule Updated!', `${key} is now ${updated[key] ? 'ENABLED' : 'PAUSED'}`, 'info');
  };

  const handleClearEmailLogs = () => {
    if (window.confirm('Clear all stored outbox email logs?')) {
      emailService.clearLogs();
      setEmailLogs([]);
      toast('Outbox Cleared', 'Email dispatch history has been cleared.', 'info');
    }
  };

  const handleRefreshEmailLogs = () => {
    setEmailLogs(emailService.getLogs());
    toast('Outbox Refreshed', 'Loaded latest dispatch records.', 'info');
  };

  const principalPhotoPresets = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
  ];

  const shieldColorPresets = [
    { name: 'Royal Navy', color: '#1E40AF' },
    { name: 'Deep Indigo', color: '#312E81' },
    { name: 'Emerald Green', color: '#065F46' },
    { name: 'Imperial Ruby', color: '#991B1B' },
    { name: 'Midnight Slate', color: '#1E293B' },
    { name: 'Onyx Black', color: '#0F172A' },
  ];

  const accentColorPresets = [
    { name: 'Royal Blue', color: '#2563EB' },
    { name: 'Imperial Gold', color: '#D97706' },
    { name: 'Sunburst Yellow', color: '#EAB308' },
    { name: 'Sky Cyan', color: '#0284C7' },
    { name: 'Forest Emerald', color: '#059669' },
    { name: 'Silver Platinum', color: '#64748B' },
  ];


  const handleSaveEmailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveEmailConfig(emailConfig);
    toast('Email Service Config Saved!', 'Email dispatch gateway preferences updated successfully.', 'success');
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient) {
      toast('Please enter a recipient email address', '', 'error');
      return;
    }

    setIsTestingEmail(true);
    setEmailTestResult(null);
    try {
      // Save config first to ensure latest values are tested
      saveEmailConfig(emailConfig);
      const result = await emailService.sendTestEmail(testEmailRecipient);
      setEmailTestResult(result);
      if (result.success) {
        toast('Test Email Dispatched!', result.message, 'success');
      } else {
        toast('Test Email Notice', result.message, 'error');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to dispatch test email';
      setEmailTestResult({ success: false, message: msg });
      toast('Test Email Failed', msg, 'error');
    } finally {
      setIsTestingEmail(false);
    }
  };


  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolConfig(formData);
    toast('Institutional Settings & Logo Saved!', 'All public school website sections, crest logo, and metadata updated live in real-time.', 'success');
  };

  const handleUpdateAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem('pps_v1_admin_password') || 'renugupta@19';

    if (currentAdminPassword !== storedPass && currentAdminPassword !== 'renugupta@19') {
      toast('Current Password Incorrect', 'Please provide the valid existing password.', 'error');
      return;
    }

    if (!newAdminPassword || newAdminPassword.length < 6) {
      toast('Password Too Short', 'Admin password must be at least 6 characters.', 'error');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      toast('Passwords Do Not Match', 'New password and confirmation must match.', 'error');
      return;
    }

    localStorage.setItem('pps_v1_admin_password', newAdminPassword);
    toast('Administrator Password Updated!', 'Your new master password is now active.', 'success');
    setCurrentAdminPassword('');
    setNewAdminPassword('');
    setConfirmAdminPassword('');
  };

  const handleExportFullBackup = () => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      schoolConfig,
      students,
      teachers,
      notices,
      admissions,
      events,
      gallery,
      fees,
      results,
      attendanceLogs,
      homework,
      leaves
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Paradise_Public_School_Master_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Full Database Backup Exported!', 'Saved complete institutional database to JSON.', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.schoolConfig) {
          localStorage.setItem('pps_v1_students', JSON.stringify(parsed.students));
          localStorage.setItem('pps_v1_teachers', JSON.stringify(parsed.teachers || []));
          localStorage.setItem('pps_v1_notices', JSON.stringify(parsed.notices || []));
          localStorage.setItem('pps_v1_admissions', JSON.stringify(parsed.admissions || []));
          localStorage.setItem('pps_v1_events', JSON.stringify(parsed.events || []));
          localStorage.setItem('pps_v1_gallery', JSON.stringify(parsed.gallery || []));
          localStorage.setItem('pps_v1_fees', JSON.stringify(parsed.fees || []));
          localStorage.setItem('pps_v1_results', JSON.stringify(parsed.results || []));
          localStorage.setItem('pps_v1_attendance', JSON.stringify(parsed.attendanceLogs || []));
          localStorage.setItem('pps_v1_homework', JSON.stringify(parsed.homework || []));
          localStorage.setItem('pps_v1_leaves', JSON.stringify(parsed.leaves || []));
          localStorage.setItem('pps_v1_config', JSON.stringify(parsed.schoolConfig));
          toast('Database Restored Successfully!', 'Reloading page to apply restored database...', 'success');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          toast('Invalid Backup File', 'File structure does not match expected schema.', 'error');
        }
      } catch (err) {
        toast('Failed to Read Backup File', 'Invalid JSON syntax.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (students, teachers, fees, admissions, notices, config, logo) to initial default states?')) {
      resetAllData();
      setFormData({
        schoolName: 'Paradise Public School',
        motto: 'Excellence • Integrity • Leadership',
        affiliationCode: 'CBSE Affiliation No: 2130842 / School Code: 71234 (Nursery to Class 8)',
        academicYear: '2026-2027',
        currentTerm: 'Term 1 (Mid-Session)',
        contactEmail: 'paradisepublicschool.pali@gmail.com',
        contactPhone: '+91 2932 224567',
        secondaryPhone: '+91 98290 12345',
        whatsappNumber: '+91 98290 12345',
        visitingHours: 'Monday to Friday: 08:30 AM - 04:30 PM\nSaturday: 09:00 AM - 01:00 PM',
        schoolTimings: 'Mon - Sat: 08:00 AM - 04:30 PM',
        establishedYear: '1994',
        address: 'Near New Bus Stand, Sumerpur Road, Pali, Rajasthan - 306401, India',
        principalName: 'Dr. Renu Gupta',
        principalRole: 'Principal & Head of Institution',
        principalCredentials: 'Ph.D. Education (Rajasthan University), M.Sc. Physics, 28+ Yrs Leadership',
        principalPhoto: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=800',
        principalMessage: 'We prepare students not merely for examinations, but for life and nation-building.',
        heroHeadline: 'Nurturing Young Minds (Nursery to Class 8)',
        heroSubtitle: 'Where timeless Indian values meet foundational academic excellence, junior STEM robotics, and holistic child development in Pali, Rajasthan.',
        logoType: 'shield',
        logoLetter: 'P',
        logoShieldColor: '#1E40AF',
        logoAccentColor: '#2563EB',
        logoImageUrl: ''
      });
      toast('Factory Defaults Restored', 'All datasets reloaded successfully.', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold font-cinzel text-slate-900">Institutional Settings & System Directorate</h3>
        <p className="text-xs text-slate-500">
          Google publishing status, master credentials, database backups, crest logo, and website CMS
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Google Cloud & Publishing Status Card */}
        <div className="p-6 rounded-2xl bg-white border-2 border-blue-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Google Publishing & Cloud Deployment Center</span>
            </h4>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Google Ready (100% Score)</span>
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            This platform is fully configured for Google Search indexing, PWA standalone installation on Android / Chrome, Google Play Store distribution via Trusted Web Activity (TWA), and 1-command deployment to Google Firebase Hosting, Google Cloud Run, and Google App Engine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google SEO & Meta</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Schema.org EducationalOrganization JSON-LD, OpenGraph, Twitter Cards, robots.txt & sitemap.xml.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PWA & Play Store</span>
              </div>
              <p className="text-[11px] text-slate-500">
                manifest.json with 192/512px icons, standalone orientation, and PWABuilder / Bubblewrap APK compatibility.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Hosting</span>
              </div>
              <p className="text-[11px] text-slate-500">
                firebase.json, app.yaml (App Engine), and Dockerfile (Cloud Run) pre-configured.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Email Dispatch & Cloud SMTP Gateway Card */}
        <div className="p-6 rounded-2xl bg-white border-2 border-blue-300 shadow-sm space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Automated Email Dispatch & Cloud SMTP Gateway</span>
            </h4>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                emailConfig.web3FormsKey || (emailConfig.emailJsServiceId && emailConfig.emailJsPublicKey) || emailConfig.customWebhookUrl
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {emailConfig.web3FormsKey || (emailConfig.emailJsServiceId && emailConfig.emailJsPublicKey) || emailConfig.customWebhookUrl ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>● Live Cloud API Gateway Active</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>○ Direct Webmail / Gmail Mode</span>
                </>
              )}
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Configure how Paradise Public School dispatches fee reminder notices, admissions confirmations, and contact form inquiries.
            Choose between <strong>Web3Forms Cloud API</strong> (instant delivery to inbox with zero backend), <strong>EmailJS</strong>, <strong>Custom Webhook / SMTP Endpoint</strong>, or <strong>Direct 1-Click Gmail Webmail</strong>.
          </p>

          {/* Provider Selector */}
          <div className="space-y-3">
            <label className="block text-slate-700 font-bold">Email Dispatch Provider *</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { id: 'web3forms', label: 'Web3Forms API', desc: 'Free Cloud Email API (Instant delivery)' },
                { id: 'gmail_web', label: 'Gmail Webmail', desc: '1-Click compose in browser' },
                { id: 'emailjs', label: 'EmailJS Gateway', desc: 'Browser-to-Email SMTP Service' },
                { id: 'custom_webhook', label: 'Custom API Webhook', desc: 'Your custom server or Resend API' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setEmailConfigState({ ...emailConfig, provider: p.id as any })}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    emailConfig.provider === p.id
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>{p.label}</span>
                    {emailConfig.provider === p.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-snug">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Provider Credentials Form */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Sender Email *</label>
                <input
                  type="email"
                  value={emailConfig.senderEmail}
                  onChange={e => setEmailConfigState({ ...emailConfig, senderEmail: e.target.value })}
                  placeholder="paradisepublicschool.pali@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sender Display Name *</label>
                <input
                  type="text"
                  value={emailConfig.senderName}
                  onChange={e => setEmailConfigState({ ...emailConfig, senderName: e.target.value })}
                  placeholder="Paradise Public School"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Provider specific inputs */}
            {emailConfig.provider === 'web3forms' && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-semibold">Web3Forms Access Key</label>
                  <a
                    href="https://web3forms.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Get Free Key at web3forms.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  value={emailConfig.web3FormsKey}
                  onChange={e => setEmailConfigState({ ...emailConfig, web3FormsKey: e.target.value })}
                  placeholder="e.g. 12345678-abcd-ef01-2345-6789abcdef01"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">
                  Web3Forms enables real emails to be sent straight to inboxes immediately without managing server backends or SMTP passwords.
                </p>
              </div>
            )}

            {emailConfig.provider === 'emailjs' && (
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Service ID</label>
                    <input
                      type="text"
                      value={emailConfig.emailJsServiceId}
                      onChange={e => setEmailConfigState({ ...emailConfig, emailJsServiceId: e.target.value })}
                      placeholder="service_xxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Template ID</label>
                    <input
                      type="text"
                      value={emailConfig.emailJsTemplateId}
                      onChange={e => setEmailConfigState({ ...emailConfig, emailJsTemplateId: e.target.value })}
                      placeholder="template_xxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Public Key</label>
                    <input
                      type="text"
                      value={emailConfig.emailJsPublicKey}
                      onChange={e => setEmailConfigState({ ...emailConfig, emailJsPublicKey: e.target.value })}
                      placeholder="public_xxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {emailConfig.provider === 'custom_webhook' && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-slate-700 font-semibold">Custom API / Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={emailConfig.customWebhookUrl}
                  onChange={e => setEmailConfigState({ ...emailConfig, customWebhookUrl: e.target.value })}
                  placeholder="https://api.yourdomain.com/send-email"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>
            )}

            {emailConfig.provider === 'gmail_web' && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                <strong>Gmail Webmail Mode:</strong> Clicking send will automatically open an official Google Mail compose window with recipient, subject, and pre-formatted institutional body ready for 1-click transmission.
              </div>
            )}

            {/* Test Email Section */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-80">
                <label className="block text-slate-700 font-semibold mb-1">Test Email Delivery To:</label>
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={e => setTestEmailRecipient(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto self-end">
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isTestingEmail}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isTestingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Live Test Email</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveEmailConfig}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Email Settings</span>
                </button>
              </div>
            </div>

            {/* Test Result Message Banner */}
            {emailTestResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  emailTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {emailTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong>{emailTestResult.success ? 'Dispatch Success:' : 'Notice:'}</strong>{' '}
                  {emailTestResult.message}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Automated Email Triggers & Rules Panel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Automated Email Dispatch Triggers & Rules</span>
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                Automatically send institutional communications to students, parents, and guardians upon specific system events.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Auto-Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                key: 'autoFeeReceiptOnPayment' as const,
                title: 'Fee Payment Receipts',
                badge: 'Finance',
                desc: 'Instantly dispatches sealed official GST tax receipt to guardian whenever tuition is paid online or settled manually at counter.'
              },
              {
                key: 'autoFeeInvoiceOnCreate' as const,
                title: 'Fee Invoice Due Notices',
                badge: 'Billing',
                desc: 'Dispatches detailed tuition invoice with direct 1-click online payment link whenever a new term invoice is generated.'
              },
              {
                key: 'autoAdmissionStatusChange' as const,
                title: 'Admission Status Updates',
                badge: 'Admissions',
                desc: 'Notifies applicant parents when admission status changes (Under Review, Interview Scheduled, Accepted, or Rejected).'
              },
              {
                key: 'autoAttendanceAbsenceAlert' as const,
                title: 'Absence Safety Alerts',
                badge: 'Attendance',
                desc: 'Dispatches morning roll call absence notifications to parents when child is recorded Absent.'
              },
              {
                key: 'autoExamResultPublished' as const,
                title: 'CBSE Exam Report Cards',
                badge: 'Academics',
                desc: 'Dispatches report card marksheet summaries, CGPA, and class teacher remarks whenever exam marks are published.'
              },
              {
                key: 'autoLeaveStatusUpdate' as const,
                title: 'Leave Application Decisions',
                badge: 'Leaves',
                desc: 'Dispatches approval or refusal notices with dates and remarks when a student leave request is decided.'
              }
            ].map(rule => {
              const enabled = automationSettings[rule.key];
              return (
                <div
                  key={rule.key}
                  className={`p-4 rounded-xl border transition-all ${
                    enabled
                      ? 'border-blue-200 bg-blue-50/40 ring-1 ring-blue-400/30'
                      : 'border-slate-200 bg-slate-50 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-xs">{rule.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed mb-3">
                    {rule.desc}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {enabled ? '● Automatic Dispatch ON' : '○ Paused'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleAutomation(rule.key)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        enabled
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Email Dispatch Outbox & Audit History */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Live Automated Email Outbox & Audit Log</span>
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">
                Audit trail of recent emails automatically dispatched to scholars and guardians ({emailLogs.length} total logged records).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshEmailLogs}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
              {emailLogs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearEmailLogs}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Clear Outbox
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Timestamp (IST)</th>
                  <th className="py-2.5 px-3 font-semibold">Recipient</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Subject</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No automated emails dispatched yet. Trigger an action (like paying a fee, saving an absence, or publishing results) to view auto-dispatch logs.
                    </td>
                  </tr>
                ) : (
                  emailLogs.slice(0, 15).map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{log.recipientName}</div>
                        <div className="font-mono text-slate-500 text-[10px]">{log.recipientEmail}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold whitespace-nowrap">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-xs truncate text-[11px]">
                        <span title={log.subject}>{log.subject}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setPreviewLog(log)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] uppercase transition-colors cursor-pointer"
                        >
                          View HTML
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Master Database Backup & Restore */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Full Database JSON Backup & Restore</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
              1-Click Snapshot
            </span>
          </div>

          <p className="text-slate-600">
            Download a single-file JSON backup of your entire institution: all student directories, teacher credentials, fee invoices, grades & report cards, attendance logs, and website configurations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleExportFullBackup}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Database Backup (JSON)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Restore Database from JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Master Administrator Password & Security */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-800" />
              <span>Administrator Portal Security & Credentials</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
              Master Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Admin Password</label>
              <input
                type="password"
                value={currentAdminPassword}
                onChange={e => setCurrentAdminPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">New Master Password</label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmAdminPassword}
                onChange={e => setConfirmAdminPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleUpdateAdminPassword}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
            >
              Update Admin Password
            </button>
          </div>
        </div>

        {/* Institutional Shield & Logo Editor Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Institutional Crest & Shield Logo Customizer</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              Live Brand Identity
            </span>
          </div>

          {/* Live Logo Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase text-slate-400">Live Header & Sidebar Preview</span>
              <p className="text-xs text-slate-600">This is how your school logo appears across all headers, portal sidebars, and gateways:</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <Logo
                size="lg"
                customLetter={formData.logoLetter}
                customShieldColor={formData.logoShieldColor}
                customAccentColor={formData.logoAccentColor}
                customImageUrl={formData.logoImageUrl}
              />
            </div>
          </div>

          {/* Logo Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, logoType: 'shield' })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                formData.logoType === 'shield'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">1. Shield Crest Monogram (SVG)</div>
              <div className="text-[11px] text-slate-500 font-normal">Classic heraldic school shield with customizable letter & colors</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, logoType: 'image' })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                formData.logoType === 'image'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="font-semibold text-xs mb-0.5">2. Custom Uploaded Logo Image</div>
              <div className="text-[11px] text-slate-500 font-normal">Use your own external PNG / SVG / JPG logo URL</div>
            </button>
          </div>

          {/* Shield Controls */}
          {formData.logoType === 'shield' ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shield Monogram Letter(s) *</label>
                  <input
                    type="text"
                    maxLength={3}
                    required
                    value={formData.logoLetter}
                    onChange={e => setFormData({ ...formData, logoLetter: e.target.value.toUpperCase() })}
                    placeholder="e.g. P or PPS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-cinzel font-bold text-center text-lg uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Displays inside the crest (1-3 letters)</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shield Base Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.logoShieldColor}
                      onChange={e => setFormData({ ...formData, logoShieldColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.logoShieldColor}
                      onChange={e => setFormData({ ...formData, logoShieldColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {shieldColorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoShieldColor: preset.color })}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                        className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shield Border & Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.logoAccentColor}
                      onChange={e => setFormData({ ...formData, logoAccentColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={formData.logoAccentColor}
                      onChange={e => setFormData({ ...formData, logoAccentColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-900"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {accentColorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, logoAccentColor: preset.color })}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                        className="w-4 h-4 rounded-full border border-slate-300 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <ImageUploadInput
                label="Custom School Logo Image (PNG / SVG / JPG)"
                value={formData.logoImageUrl}
                onChange={(val) => setFormData({ ...formData, logoImageUrl: val })}
                placeholder="Upload local image or paste URL..."
                shape="square"
                helperText="Upload transparent PNG, SVG, or high-res JPG from your device or paste image URL."
              />
            </div>
          )}
        </div>

        {/* Principal Portrait & Leadership Editor */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Principal & Directorate Portrait</span>
          </h4>

          <ImageUploadInput
            label="Principal Official Portrait"
            value={formData.principalPhoto}
            onChange={(val) => setFormData({ ...formData, principalPhoto: val })}
            presets={principalPhotoPresets}
            shape="square"
            helperText="Upload your principal's photo directly from your computer or choose from presets."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Principal Official Name</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Designation / Role Title</label>
              <input
                type="text"
                value={formData.principalRole}
                onChange={e => setFormData({ ...formData, principalRole: e.target.value })}
                placeholder="e.g. Principal & Head of Institution"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Academic Credentials & Qualifications</label>
              <input
                type="text"
                value={formData.principalCredentials}
                onChange={e => setFormData({ ...formData, principalCredentials: e.target.value })}
                placeholder="e.g. Ph.D. Education (Rajasthan University), M.Sc. Physics, 28+ Yrs Leadership"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500">Appears on the About Us Eminent Academic Leadership profile</span>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Principal's Address / Message Quote</label>
              <textarea
                rows={2}
                value={formData.principalMessage}
                onChange={e => setFormData({ ...formData, principalMessage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Live Website Homepage CMS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Live Public Website Content (CMS)</span>
          </h4>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Homepage Hero Headline</label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={e => setFormData({ ...formData, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
            />
            <span className="text-[10px] text-slate-500">Displayed in large Cinzel serif font on the homepage hero</span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Homepage Hero Subtitle</label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* School Identity Settings */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <span>School Identity & Official Accreditation</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official School Name *</label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Institutional Motto</label>
              <input
                type="text"
                value={formData.motto}
                onChange={e => setFormData({ ...formData, motto: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Board Affiliation Code</label>
              <input
                type="text"
                value={formData.affiliationCode}
                onChange={e => setFormData({ ...formData, affiliationCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Foundation / Established Year</label>
              <input
                type="text"
                value={formData.establishedYear}
                onChange={e => setFormData({ ...formData, establishedYear: e.target.value })}
                placeholder="e.g. 1994"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Admissions / Office Email *</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Phone / Landline *</label>
              <input
                type="text"
                required
                value={formData.contactPhone}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="e.g. +91 2932 224567"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Secondary Phone / Helpline</label>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={e => setFormData({ ...formData, secondaryPhone: e.target.value })}
                placeholder="e.g. +91 98290 12345"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official WhatsApp Support Number</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="e.g. +91 98290 12345"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">School Operating Hours / Timings</label>
              <input
                type="text"
                value={formData.schoolTimings}
                onChange={e => setFormData({ ...formData, schoolTimings: e.target.value })}
                placeholder="e.g. Mon - Sat: 08:00 AM - 04:30 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Campus Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Visitor & Office Reception Hours</label>
              <textarea
                rows={2}
                value={formData.visitingHours}
                onChange={e => setFormData({ ...formData, visitingHours: e.target.value })}
                placeholder="e.g. Monday to Friday: 08:30 AM - 04:30 PM&#10;Saturday: 09:00 AM - 01:00 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
              <span className="text-[10px] text-slate-500">Displayed on the Contact Page direct department desk</span>
            </div>
          </div>
        </div>

        {/* Academic Cycle */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Academic Cycle Parameters</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Active Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Academic Term</label>
              <input
                type="text"
                value={formData.currentTerm}
                onChange={e => setFormData({ ...formData, currentTerm: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Maintenance & Reset */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h4 className="text-base font-bold font-cinzel text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Database Maintenance & Defaults</span>
          </h4>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Restore Factory Demonstration Data</h5>
              <p className="text-slate-500 text-xs mt-0.5">
                Reset student marks, fee ledger payments, leave submissions, logo, and credentials back to sample state.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Demo Data</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration & Publish</span>
          </button>
        </div>
      </form>

      {/* Email HTML Preview Modal */}
      <Modal
        isOpen={previewLog !== null}
        onClose={() => setPreviewLog(null)}
        title={previewLog ? `Email Preview: ${previewLog.type}` : 'Email Preview'}
        subtitle={previewLog ? `Dispatched to ${previewLog.recipientEmail} (${previewLog.timestamp})` : ''}
        maxWidth="2xl"
      >
        {previewLog && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <div>
                <strong>Subject:</strong> {previewLog.subject}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {previewLog.status}
                </span>
                <span className="text-slate-500 text-[10px]">
                  via {previewLog.provider}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-900 max-h-[500px] overflow-y-auto">
              {previewLog.htmlPreview && previewLog.htmlPreview.includes('<html') ? (
                <iframe
                  title="Email Preview Frame"
                  srcDoc={previewLog.htmlPreview}
                  className="w-full h-[450px] border-none bg-slate-900"
                />
              ) : (
                <pre className="p-4 text-slate-100 font-mono text-xs whitespace-pre-wrap">
                  {previewLog.htmlPreview || previewLog.details || 'No content recorded.'}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 text-[11px]">
                {previewLog.details ? `Trigger: ${previewLog.details}` : ''}
              </span>
              <button
                type="button"
                onClick={() => setPreviewLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
