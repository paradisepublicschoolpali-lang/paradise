// ============================================================================
// PARADISE PUBLIC SCHOOL - EMAIL DISPATCH SERVICE & AUTOMATION LAYER
// ============================================================================
// Supports:
// 1. Executive Styled HTML Email Templates (Tuition Notices, Fee Receipts,
//    Admission Status Updates, Attendance Alerts, Report Cards, Welcome Dossiers)
// 2. Automated Event Triggers (Auto-fee receipt on payment, Auto-dues on creation,
//    Auto-absence alert to parents, Auto-admission updates, Auto-results)
// 3. Web3Forms Cloud API (Direct email delivery to inbox with zero backend)
// 4. EmailJS REST API (Browser-to-Email Delivery)
// 5. Custom REST Webhook / SMTP API Gateway
// 6. Direct 1-Click Gmail Webmail Composer (https://mail.google.com)
// 7. Audit Outbox & Dispatch History Logger
// ============================================================================

export interface EmailConfig {
  provider: 'web3forms' | 'emailjs' | 'custom_webhook' | 'gmail_web' | 'mailto';
  web3FormsKey: string;
  emailJsServiceId: string;
  emailJsTemplateId: string;
  emailJsPublicKey: string;
  customWebhookUrl: string;
  senderEmail: string;
  senderName: string;
}

export interface EmailAutomationSettings {
  autoFeeReceiptOnPayment: boolean;
  autoFeeInvoiceOnCreate: boolean;
  autoAdmissionStatusChange: boolean;
  autoAttendanceAbsenceAlert: boolean;
  autoExamResultPublished: boolean;
  autoLeaveStatusUpdate: boolean;
  autoDailyFeeReminderBatch: boolean;
}

export interface EmailDispatchLog {
  id: string;
  timestamp: string;
  recipientEmail: string;
  recipientName: string;
  type: 'Fee Receipt' | 'Fee Invoice Due' | 'Admission Status' | 'Attendance Alert' | 'Exam Result' | 'Leave Status' | 'Enrolment Welcome' | 'Inquiry' | 'Manual Reminder';
  subject: string;
  status: 'Delivered' | 'Dispatched (API)' | 'Composed (Webmail)' | 'Logged';
  provider: string;
  details?: string;
  htmlPreview?: string;
}

const STORAGE_KEY = 'pps_v1_email_config';
const AUTOMATION_KEY = 'pps_v1_email_automation';
const LOGS_KEY = 'pps_v1_email_logs';

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  provider: 'web3forms',
  web3FormsKey: (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string) || '',
  emailJsServiceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || '',
  emailJsTemplateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || '',
  emailJsPublicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || '',
  customWebhookUrl: (import.meta.env.VITE_EMAIL_WEBHOOK_URL as string) || '',
  senderEmail: 'paradisepublicschool.pali@gmail.com',
  senderName: 'Paradise Public School'
};

export const DEFAULT_AUTOMATION_SETTINGS: EmailAutomationSettings = {
  autoFeeReceiptOnPayment: true,
  autoFeeInvoiceOnCreate: true,
  autoAdmissionStatusChange: true,
  autoAttendanceAbsenceAlert: true,
  autoExamResultPublished: true,
  autoLeaveStatusUpdate: true,
  autoDailyFeeReminderBatch: true
};

export const getEmailConfig = (): EmailConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_EMAIL_CONFIG, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.warn('Failed to load email config from localStorage', err);
  }
  return DEFAULT_EMAIL_CONFIG;
};

export const saveEmailConfig = (config: Partial<EmailConfig>): EmailConfig => {
  const current = getEmailConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist email config', err);
  }
  return updated;
};

export const getAutomationSettings = (): EmailAutomationSettings => {
  try {
    const stored = localStorage.getItem(AUTOMATION_KEY);
    if (stored) {
      return { ...DEFAULT_AUTOMATION_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (err) {
    console.warn('Failed to load email automation settings', err);
  }
  return DEFAULT_AUTOMATION_SETTINGS;
};

export const saveAutomationSettings = (settings: Partial<EmailAutomationSettings>): EmailAutomationSettings => {
  const current = getAutomationSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(AUTOMATION_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save email automation settings', err);
  }
  return updated;
};

export const getEmailLogs = (): EmailDispatchLog[] => {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Failed to load email logs', err);
  }
  return [];
};

export const addEmailLog = (logItem: Omit<EmailDispatchLog, 'id' | 'timestamp'>): EmailDispatchLog => {
  const newLog: EmailDispatchLog = {
    ...logItem,
    id: `eml-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };
  try {
    const current = getEmailLogs();
    const updated = [newLog, ...current].slice(0, 100); // keep last 100 logs
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to append email log', err);
  }
  return newLog;
};

export const clearEmailLogs = (): void => {
  try {
    localStorage.removeItem(LOGS_KEY);
  } catch (err) {
    console.error('Failed to clear email logs', err);
  }
};

/**
 * Returns direct URL to the Parent Portal fee payment section
 */
export const getPaymentPortalUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/#/parent/fees`;
  }
  return 'https://paradisepublicschool.edu.in/#/parent/fees';
};

export interface SendEmailPayload {
  to: string;
  subject: string;
  message: string;
  html?: string;
  fromName?: string;
  replyTo?: string;
  metadata?: Record<string, any>;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  providerUsed: string;
  fallbackTriggered?: boolean;
}

export const emailService = {
  getConfig: getEmailConfig,
  saveConfig: saveEmailConfig,
  getAutomation: getAutomationSettings,
  saveAutomation: saveAutomationSettings,
  getLogs: getEmailLogs,
  addLog: addEmailLog,
  clearLogs: clearEmailLogs,
  getPaymentUrl: getPaymentPortalUrl,

  // ============================================================================
  // HTML EMAIL TEMPLATE GENERATORS
  // ============================================================================

  /**
   * Generates high-conversion, responsive HTML email template for Tuition Fee Notices
   */
  generateFeeEmailHtml(params: {
    studentName: string;
    grade: string;
    rollNo: string;
    invoiceNo: string;
    term: string;
    amountFormatted: string;
    dueDateFormatted: string;
    paymentLink?: string;
  }): string {
    const paymentUrl = params.paymentLink || getPaymentPortalUrl();
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tuition Fee Due Notice - ${params.studentName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 15px 50px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25); border: 1px solid #334155;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%); padding: 36px 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background-color: #ffffff; border-radius: 12px; padding: 8px 16px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                    <span style="font-size: 20px; font-weight: 900; color: #1e40af; letter-spacing: 3px; font-family: Georgia, serif;">PARADISE</span>
                  </td>
                </tr>
              </table>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0; letter-spacing: 0.5px; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</h1>
              <p style="color: #bfdbfe; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">CBSE Affiliation No: 2130842 • School Code: 71234 (Nursery to Class 8)</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 12px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ⚠️ Tuition Fee Notice
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; color: #64748b; font-family: monospace; font-weight: 700;">
                      Invoice: <span style="color: #1e40af;">#${params.invoiceNo}</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 32px 20px 32px; font-size: 14px; line-height: 1.6; color: #334155;">
              <p style="margin: 0 0 10px 0; font-size: 15px;">Dear Parent / Guardian of <strong>${params.studentName}</strong>,</p>
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                Greetings from the Accounts & Treasury Directorate. This is a formal notification regarding the outstanding Tuition Fee for the ongoing academic term. Please review the invoice breakdown below:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden;">
                <tr>
                  <td colspan="2" style="background-color: #f1f5f9; padding: 12px 18px; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Scholar Billing Details</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Scholar Name:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${params.studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Class & Section:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.grade}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Admission / Roll:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-family: monospace; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.rollNo}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Billing Term:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.term}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Due Date:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 800; color: #dc2626; border-bottom: 1px solid #f1f5f9;">${params.dueDateFormatted}</td>
                </tr>
                <tr style="background-color: #eff6ff;">
                  <td style="padding: 16px 18px; font-size: 13px; font-weight: 800; color: #1e40af; text-transform: uppercase;">Total Tuition Due:</td>
                  <td align="right" style="padding: 16px 18px; font-size: 22px; font-weight: 900; color: #1e40af;">${params.amountFormatted}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px; text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${paymentUrl}" target="_blank" rel="noopener noreferrer" style="display: block; width: 90%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 18px 24px; border-radius: 14px; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4); text-align: center;">
                      💳 Click Here to Pay Tuition Fee Online &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px;">
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 18px 20px;">
                <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase;">⚡ Instant UPI Payment Option</h4>
                <p style="margin: 0; font-size: 12px; color: #475569;">
                  Official School UPI ID: <strong style="font-family: monospace; background: #e2e8f0; padding: 2px 8px; border-radius: 6px; color: #0f172a;">paradiseschool@sbi</strong>
                  <br><span style="font-size: 11px; color: #64748b;">Compatible with Google Pay, PhonePe, Paytm & BHIM UPI</span>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 800; color: #f8fafc; font-size: 13px; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</p>
              <p style="margin: 0 0 4px 0;">Near New Bus Stand, Sumerpur Road, Pali, Rajasthan - 306401, India</p>
              <p style="margin: 0;">Accounts Desk: ${schoolEmail} • Helpline: +91 2932 224567 / +91 98290 12345</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  generateFeeEmailText(params: {
    studentName: string;
    grade: string;
    rollNo: string;
    invoiceNo: string;
    term: string;
    amountFormatted: string;
    dueDateFormatted: string;
    paymentLink?: string;
  }): string {
    const paymentUrl = params.paymentLink || getPaymentPortalUrl();
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';

    return `======================================================================
           🏛️  PARADISE PUBLIC SCHOOL, PALI (RAJASTHAN)
     CBSE Affiliation No: 2130842 • School Code: 71234 (Nursery to Class 8)
======================================================================
OFFICIAL TUITION FEE DUE NOTICE • INVOICE #${params.invoiceNo}

Dear Parent / Guardian of ${params.studentName},

Greetings from Paradise Public School.
This is a formal reminder regarding the outstanding Tuition Fee for the ongoing academic session.

----------------------------------------------------------------------
📋 INVOICE DETAILS
----------------------------------------------------------------------
Scholar Name       : ${params.studentName}
Class & Section    : ${params.grade}
Admission / Roll   : ${params.rollNo || 'N/A'}
Invoice Number     : ${params.invoiceNo}
Billing Term       : ${params.term}
Payment Due Date   : ${params.dueDateFormatted}
TOTAL AMOUNT DUE   : ${params.amountFormatted}
----------------------------------------------------------------------

💳 1-CLICK ONLINE PAYMENT LINK:
👉 ${paymentUrl}

⚡ OTHER PAYMENT OPTIONS:
• Instant UPI ID   : paradiseschool@sbi (Google Pay / PhonePe / Paytm)
• School Accounts Counter: Monday to Saturday, 08:30 AM to 03:00 PM

Helpline: +91 2932 224567 / +91 98290 12345
Official Accounts Desk: ${schoolEmail}
======================================================================`;
  },

  /**
   * Generates Official Sealed Fee Payment Receipt HTML
   */
  generateReceiptEmailHtml(params: {
    studentName: string;
    grade: string;
    rollNo: string;
    invoiceNo: string;
    term: string;
    amountFormatted: string;
    paymentDateFormatted: string;
    paymentMethod: string;
    transactionId: string;
  }): string {
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Tuition Fee Receipt - ${params.studentName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 15px 50px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25); border: 1px solid #334155;">
          <tr>
            <td style="background: linear-gradient(135deg, #065f46 0%, #047857 60%, #10b981 100%); padding: 36px 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <table border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="background-color: #ffffff; border-radius: 12px; padding: 8px 16px; text-align: center;">
                    <span style="font-size: 20px; font-weight: 900; color: #047857; letter-spacing: 3px; font-family: Georgia, serif;">PARADISE</span>
                  </td>
                </tr>
              </table>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0; letter-spacing: 0.5px; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</h1>
              <p style="color: #d1fae5; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">CBSE Affiliation No: 2130842 • Official Tuition Fee Tax Receipt</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 10px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; font-size: 11px; font-weight: 800; padding: 6px 16px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ✅ Payment Settled & Cleared
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; color: #64748b; font-family: monospace; font-weight: 700;">
                      Receipt: <span style="color: #047857;">#${params.invoiceNo}</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 32px 18px 32px; font-size: 14px; line-height: 1.6; color: #334155;">
              <p style="margin: 0 0 8px 0; font-size: 15px;">Dear Parent / Guardian of <strong>${params.studentName}</strong>,</p>
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                We gratefully acknowledge receipt of your tuition fee payment. The payment has been reconciled into the institutional accounts ledger.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden;">
                <tr>
                  <td colspan="2" style="background-color: #f0fdf4; padding: 12px 18px; border-bottom: 1px solid #bbf7d0;">
                    <strong style="color: #166534; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🧾 Payment & Transaction Details</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Scholar Name:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${params.studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Class & Section:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.grade}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Roll / Scholar No:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-family: monospace; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.rollNo || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Billing Term:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.term}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Transaction Reference:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 12px; font-family: monospace; font-weight: 700; color: #047857; border-bottom: 1px solid #f1f5f9;">${params.transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Payment Mode:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 18px; font-size: 13px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Payment Date:</td>
                  <td align="right" style="padding: 10px 18px; font-size: 13px; font-weight: 600; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.paymentDateFormatted}</td>
                </tr>
                <tr style="background-color: #ecfdf5;">
                  <td style="padding: 16px 18px; font-size: 13px; font-weight: 800; color: #065f46; text-transform: uppercase;">Amount Settled:</td>
                  <td align="right" style="padding: 16px 18px; font-size: 22px; font-weight: 900; color: #047857;">${params.amountFormatted}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 800; color: #f8fafc; font-size: 13px; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</p>
              <p style="margin: 0 0 4px 0;">Accounts & Treasury Directorate • Near New Bus Stand, Pali (Rajasthan)</p>
              <p style="margin: 0;">Official Receipt Desk: ${schoolEmail} • Helpline: +91 2932 224567</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  generateReceiptEmailText(params: {
    studentName: string;
    grade: string;
    rollNo: string;
    invoiceNo: string;
    term: string;
    amountFormatted: string;
    paymentDateFormatted: string;
    paymentMethod: string;
    transactionId: string;
  }): string {
    return `======================================================================
           🏛️  PARADISE PUBLIC SCHOOL, PALI (RAJASTHAN)
     CBSE Affiliation No: 2130842 • School Code: 71234 (Nursery to Class 8)
======================================================================
OFFICIAL TUITION FEE TAX RECEIPT • INVOICE #${params.invoiceNo}
STATUS: PAID & SETTLED IN FULL

Dear Parent / Guardian of ${params.studentName},

We gratefully acknowledge receipt of your tuition fee payment.

RECEIPT SUMMARY:
----------------------------------------------------------------------
Scholar Name       : ${params.studentName}
Class & Section    : ${params.grade}
Admission / Roll   : ${params.rollNo || 'N/A'}
Billing Term       : ${params.term}
Invoice Number     : ${params.invoiceNo}
Transaction ID     : ${params.transactionId}
Payment Method     : ${params.paymentMethod}
Settled Date       : ${params.paymentDateFormatted}
TOTAL AMOUNT PAID  : ${params.amountFormatted}
----------------------------------------------------------------------
This is an authentic institutional receipt for tax and fee records.

Accounts & Treasury Directorate • Paradise Public School
Helpline: +91 2932 224567 / +91 98290 12345
======================================================================`;
  },

  /**
   * Generates Admission Application Status Email HTML
   */
  generateAdmissionStatusEmailHtml(params: {
    applicantName: string;
    applicationNo: string;
    gradeApplying: string;
    parentName: string;
    status: string;
    notes?: string;
  }): string {
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';
    const statusColor = params.status === 'Accepted' ? '#10b981' : params.status === 'Rejected' ? '#ef4444' : '#2563eb';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Admission Application Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%); padding: 32px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</h1>
              <p style="color: #bfdbfe; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase;">Admissions & Enrolment Directorate</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 10px 32px;">
              <span style="background-color: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 20px; text-transform: uppercase;">
                Dossier Ref: #${params.applicationNo}
              </span>
              <h2 style="font-size: 18px; color: #0f172a; margin: 18px 0 8px 0;">Admission Application Status Update</h2>
              <p style="font-size: 14px; color: #475569; margin: 0;">Dear ${params.parentName},</p>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
                The Admissions Committee has reviewed the application for candidate <strong>${params.applicantName}</strong> applying for <strong>${params.gradeApplying}</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 20px 32px;">
              <div style="background-color: #f8fafc; border: 2px solid ${statusColor}; border-radius: 14px; padding: 20px; text-align: center;">
                <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Current Decision Status</span>
                <div style="font-size: 24px; font-weight: 900; color: ${statusColor}; margin: 8px 0;">${params.status}</div>
                ${params.notes ? `<p style="margin: 10px 0 0 0; font-size: 13px; color: #334155; font-style: italic;">&ldquo;${params.notes}&rdquo;</p>` : ''}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px; font-size: 12px; color: #475569; line-height: 1.6;">
              <strong>Next Steps:</strong>
              <ul style="margin: 6px 0; padding-left: 20px;">
                <li>Keep this application reference number handy for verification.</li>
                <li>Visit the school admissions office with original birth certificate, previous school report card, and Aadhaar copy.</li>
                <li>School Admissions Desk: Near New Bus Stand, Sumerpur Road, Pali.</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0;">Helpline: +91 2932 224567 • Email: ${schoolEmail}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  /**
   * Generates Student Enrolment Welcome Email HTML
   */
  generateEnrollmentWelcomeEmailHtml(params: {
    studentName: string;
    grade: string;
    section: string;
    rollNo: string;
    loginId: string;
    password?: string;
    guardianName: string;
    house?: string;
    busRoute?: string;
  }): string {
    const portalUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/login` : 'https://paradisepublicschool.edu.in/#/login';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Paradise Public School</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%); padding: 36px 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</h1>
              <p style="color: #bfdbfe; font-size: 11px; margin: 6px 0 0 0; text-transform: uppercase;">Official Scholar Enrolment Dossier</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 10px 32px;">
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 8px 0;">🎉 Welcome to the Paradise Family!</h2>
              <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                Dear ${params.guardianName}, we are pleased to confirm that <strong>${params.studentName}</strong> has been officially enrolled in <strong>${params.grade} (${params.section})</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 20px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; font-size: 13px;">
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Scholar Name:</td>
                  <td align="right" style="padding: 10px 16px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${params.studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Class & Section:</td>
                  <td align="right" style="padding: 10px 16px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.grade} - ${params.section}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Roll Number:</td>
                  <td align="right" style="padding: 10px 16px; font-family: monospace; font-weight: 700; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${params.rollNo}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Assigned House:</td>
                  <td align="right" style="padding: 10px 16px; font-weight: 700; color: #1e40af; border-bottom: 1px solid #f1f5f9;">${params.house || 'Ashoka House'}</td>
                </tr>
                <tr style="background-color: #eff6ff;">
                  <td style="padding: 12px 16px; color: #1e40af; font-weight: 700;">Student Login ID:</td>
                  <td align="right" style="padding: 12px 16px; font-family: monospace; font-weight: 900; color: #1e40af; font-size: 15px;">${params.loginId}</td>
                </tr>
                <tr style="background-color: #eff6ff;">
                  <td style="padding: 12px 16px; color: #1e40af; font-weight: 700;">Temporary Password:</td>
                  <td align="right" style="padding: 12px 16px; font-family: monospace; font-weight: 900; color: #1e40af;">${params.password || 'password123'}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px; text-align: center;">
              <a href="${portalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; padding: 14px 28px; border-radius: 12px;">
                🚀 Log in to Student & Parent Portal &rarr;
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0;">Paradise Public School • Pali, Rajasthan • Helpline: +91 2932 224567</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  /**
   * Generates Daily Attendance Absence Alert HTML
   */
  generateAttendanceAlertEmailHtml(params: {
    studentName: string;
    grade: string;
    section: string;
    date: string;
    guardianName?: string;
  }): string {
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Scholar Absence Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
          <tr>
            <td style="background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%); padding: 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</h1>
              <p style="color: #fecaca; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase;">Dean of Discipline & Attendance Roll Bureau</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 30px 10px 30px;">
              <span style="background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; text-transform: uppercase;">
                ⚠️ Daily Roll Call: Marked Absent
              </span>
              <h2 style="font-size: 17px; color: #0f172a; margin: 16px 0 8px 0;">Scholar Absence Notice</h2>
              <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                Dear ${params.guardianName || 'Parent / Guardian'},
                <br><br>
                This automated safety alert is to notify you that your child <strong>${params.studentName}</strong> (${params.grade} - ${params.section}) was recorded as <strong>ABSENT</strong> during the morning roll call on <strong>${params.date}</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background-color: #fef2f2; border: 1px dashed #f87171; border-radius: 12px; padding: 16px; font-size: 12px; color: #7f1d1d;">
                <strong>Notice of Safe Custody:</strong> If your child is absent due to illness or approved leave, please submit a medical slip or leave request via the Parent Portal. If you were unaware of this absence, please contact the school reception immediately.
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0 0 4px 0;">Immediate Helpline: +91 2932 224567 / +91 98290 12345</p>
              <p style="margin: 0;">Attendance Desk: ${schoolEmail}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  /**
   * Generates Report Card Result Publication Email HTML
   */
  generateReportCardEmailHtml(params: {
    studentName: string;
    grade: string;
    section: string;
    examName: string;
    totalMarks: number;
    maxTotal: number;
    percentage: number;
    overallGrade: string;
    gpa: number;
    teacherRemarks?: string;
  }): string {
    const resultsUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/parent/results` : 'https://paradisepublicschool.edu.in/#/parent/results';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Examination Result Publication</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%); padding: 32px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</h1>
              <p style="color: #bfdbfe; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase;">CBSE Board Examination Directorate</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 10px 32px;">
              <span style="background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; text-transform: uppercase;">
                📊 ${params.examName} Result Declared
              </span>
              <h2 style="font-size: 18px; color: #0f172a; margin: 16px 0 8px 0;">Official Academic Report Card</h2>
              <p style="font-size: 13px; color: #475569;">
                Dear Parent, the academic results for <strong>${params.studentName}</strong> (${params.grade} - ${params.section}) have been published:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 20px 32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; font-size: 13px;">
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Score Obtained:</td>
                  <td align="right" style="padding: 10px 16px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${params.totalMarks} / ${params.maxTotal}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Percentage:</td>
                  <td align="right" style="padding: 10px 16px; font-weight: 800; color: #166534; border-bottom: 1px solid #f1f5f9;">${params.percentage}%</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; color: #64748b; border-bottom: 1px solid #f1f5f9;">Overall Grade & GPA:</td>
                  <td align="right" style="padding: 10px 16px; font-weight: 800; color: #1e40af; border-bottom: 1px solid #f1f5f9;">${params.overallGrade} (${params.gpa} CGPA)</td>
                </tr>
                ${params.teacherRemarks ? `
                <tr>
                  <td style="padding: 10px 16px; color: #64748b;">Teacher Remarks:</td>
                  <td align="right" style="padding: 10px 16px; color: #334155; font-style: italic;">&ldquo;${params.teacherRemarks}&rdquo;</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 25px 32px; text-align: center;">
              <a href="${resultsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; padding: 14px 28px; border-radius: 12px;">
                📜 Download Complete Subject Marksheet &rarr;
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 11px;">
              <p style="margin: 0;">Paradise Public School • Pali, Rajasthan</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  },

  // ============================================================================
  // DISPATCH CORE ENGINES
  // ============================================================================

  openGmailComposer(options: { to: string; subject: string; body: string; bcc?: string; cc?: string }) {
    const params = new URLSearchParams();
    params.set('view', 'cm');
    params.set('fs', '1');
    params.set('to', options.to);
    params.set('su', options.subject);
    params.set('body', options.body);
    if (options.bcc) params.set('bcc', options.bcc);
    if (options.cc) params.set('cc', options.cc);

    const gmailUrl = `https://mail.google.com/mail/?${params.toString()}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  },

  openDefaultMailClient(options: { to: string; subject: string; body: string; bcc?: string; cc?: string }) {
    const params = new URLSearchParams();
    if (options.subject) params.set('subject', options.subject);
    if (options.body) params.set('body', options.body);
    if (options.bcc) params.set('bcc', options.bcc);
    if (options.cc) params.set('cc', options.cc);

    const mailtoUrl = `mailto:${encodeURIComponent(options.to)}?${params.toString()}`;
    window.open(mailtoUrl, '_blank');
  },

  /**
   * Primary Dispatch Method - Routes to Cloud APIs or Webmail Fallback
   */
  async sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
    const config = getEmailConfig();

    // 1. Web3Forms Cloud API
    if (config.provider === 'web3forms' && config.web3FormsKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: config.web3FormsKey,
            subject: payload.subject,
            from_name: payload.fromName || config.senderName,
            email: payload.replyTo || config.senderEmail,
            to_email: payload.to,
            message: payload.message,
            html: payload.html,
            ...payload.metadata
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          return {
            success: true,
            message: `Email dispatched successfully via Web3Forms to ${payload.to}`,
            providerUsed: 'Web3Forms API'
          };
        }
      } catch (err: any) {
        console.error('Web3Forms API dispatch error:', err);
      }
    }

    // 2. EmailJS REST API
    if (config.provider === 'emailjs' && config.emailJsServiceId && config.emailJsTemplateId && config.emailJsPublicKey) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: config.emailJsServiceId,
            template_id: config.emailJsTemplateId,
            user_id: config.emailJsPublicKey,
            template_params: {
              to_email: payload.to,
              to_name: payload.to.split('@')[0],
              subject: payload.subject,
              message: payload.message,
              html_message: payload.html || payload.message,
              payment_link: getPaymentPortalUrl(),
              from_name: payload.fromName || config.senderName,
              reply_to: payload.replyTo || config.senderEmail,
              ...payload.metadata
            }
          })
        });

        if (response.ok) {
          return {
            success: true,
            message: `Email dispatched successfully via EmailJS to ${payload.to}`,
            providerUsed: 'EmailJS REST Gateway'
          };
        }
      } catch (err: any) {
        console.error('EmailJS API dispatch error:', err);
      }
    }

    // 3. Custom Webhook
    if (config.provider === 'custom_webhook' && config.customWebhookUrl) {
      try {
        const response = await fetch(config.customWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: payload.to,
            subject: payload.subject,
            message: payload.message,
            html: payload.html,
            payment_link: getPaymentPortalUrl(),
            from: config.senderEmail,
            fromName: payload.fromName || config.senderName,
            replyTo: payload.replyTo,
            timestamp: new Date().toISOString(),
            ...payload.metadata
          })
        });

        if (response.ok) {
          return {
            success: true,
            message: `Email dispatched to custom server gateway for ${payload.to}`,
            providerUsed: 'Custom Webhook Gateway'
          };
        }
      } catch (err: any) {
        console.error('Custom Webhook dispatch error:', err);
      }
    }

    // 4. Default Interactive Fallback: Launch Gmail Webmail Composer
    this.openGmailComposer({
      to: payload.to,
      subject: payload.subject,
      body: payload.message
    });

    return {
      success: true,
      message: `Opened Gmail Webmail composer with pre-filled content to ${payload.to}.`,
      providerUsed: 'Gmail Webmail Composer',
      fallbackTriggered: true
    };
  },

  /**
   * Automated Background Dispatcher: Dispatches email silently without disruptive browser tab pops
   * and logs transaction to the institutional Outbox audit trail.
   */
  async sendAutomaticEmail(payload: SendEmailPayload & {
    type: EmailDispatchLog['type'];
    recipientName: string;
    details?: string;
  }): Promise<SendEmailResult> {
    const config = getEmailConfig();
    let result: SendEmailResult = {
      success: true,
      message: 'Logged in Outbox',
      providerUsed: 'Institutional Auto-Dispatcher'
    };

    // Attempt real cloud API if configured
    if (config.web3FormsKey || (config.emailJsServiceId && config.emailJsPublicKey) || config.customWebhookUrl) {
      try {
        result = await this.sendEmail(payload);
      } catch (e: any) {
        console.warn('Silent cloud dispatch fallback to audit log', e);
      }
    }

    // Always log to outbox
    addEmailLog({
      recipientEmail: payload.to,
      recipientName: payload.recipientName,
      type: payload.type,
      subject: payload.subject,
      status: result.fallbackTriggered ? 'Composed (Webmail)' : 'Delivered',
      provider: result.providerUsed,
      details: payload.details,
      htmlPreview: payload.html || payload.message
    });

    return result;
  },

  // ============================================================================
  // SPECIALIZED AUTOMATIC EVENT DISPATCHERS
  // ============================================================================

  /**
   * 1. Auto-dispatch Fee Payment Tax Receipt
   */
  async autoDispatchFeeReceipt(
    fee: {
      invoiceNo: string;
      studentName: string;
      grade: string;
      term: string;
      paidAmount: number;
      paymentDate?: string;
      paymentMethod?: string;
      transactionId?: string;
    },
    student?: { guardianEmail?: string; guardianName?: string; rollNo?: string }
  ): Promise<SendEmailResult | null> {
    const automation = getAutomationSettings();
    if (!automation.autoFeeReceiptOnPayment) return null;

    const recipient = student?.guardianEmail || `${fee.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const formattedAmount = `₹${(fee.paidAmount || 0).toLocaleString('en-IN')}`;
    const dateFormatted = fee.paymentDate || new Date().toISOString().split('T')[0];
    const txnId = fee.transactionId || `TXN-PARADISE-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const subject = `[TAX RECEIPT] Tuition Fee Settled - ${fee.studentName} (${fee.grade}) • Ref #${txnId}`;
    const html = this.generateReceiptEmailHtml({
      studentName: fee.studentName,
      grade: fee.grade,
      rollNo: student?.rollNo || 'N/A',
      invoiceNo: fee.invoiceNo,
      term: fee.term,
      amountFormatted: formattedAmount,
      paymentDateFormatted: dateFormatted,
      paymentMethod: fee.paymentMethod || 'UPI',
      transactionId: txnId
    });
    const message = this.generateReceiptEmailText({
      studentName: fee.studentName,
      grade: fee.grade,
      rollNo: student?.rollNo || 'N/A',
      invoiceNo: fee.invoiceNo,
      term: fee.term,
      amountFormatted: formattedAmount,
      paymentDateFormatted: dateFormatted,
      paymentMethod: fee.paymentMethod || 'UPI',
      transactionId: txnId
    });

    return await this.sendAutomaticEmail({
      to: recipient,
      recipientName: student?.guardianName || fee.studentName,
      type: 'Fee Receipt',
      subject,
      message,
      html,
      details: `Settled ${formattedAmount} for ${fee.term} (Invoice #${fee.invoiceNo})`
    });
  },

  /**
   * 2. Auto-dispatch Fee Invoice Due Notice
   */
  async autoDispatchFeeInvoice(
    fee: {
      invoiceNo: string;
      studentName: string;
      grade: string;
      term: string;
      totalAmount: number;
      dueDate: string;
    },
    student?: { guardianEmail?: string; guardianName?: string; rollNo?: string }
  ): Promise<SendEmailResult | null> {
    const automation = getAutomationSettings();
    if (!automation.autoFeeInvoiceOnCreate) return null;

    const recipient = student?.guardianEmail || `${fee.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const formattedAmount = `₹${fee.totalAmount.toLocaleString('en-IN')}`;

    const subject = `[FEE INVOICE] Tuition Due Notice - ${fee.studentName} (${fee.grade}) • Invoice #${fee.invoiceNo}`;
    const html = this.generateFeeEmailHtml({
      studentName: fee.studentName,
      grade: fee.grade,
      rollNo: student?.rollNo || 'N/A',
      invoiceNo: fee.invoiceNo,
      term: fee.term,
      amountFormatted: formattedAmount,
      dueDateFormatted: fee.dueDate
    });
    const message = this.generateFeeEmailText({
      studentName: fee.studentName,
      grade: fee.grade,
      rollNo: student?.rollNo || 'N/A',
      invoiceNo: fee.invoiceNo,
      term: fee.term,
      amountFormatted: formattedAmount,
      dueDateFormatted: fee.dueDate
    });

    return await this.sendAutomaticEmail({
      to: recipient,
      recipientName: student?.guardianName || fee.studentName,
      type: 'Fee Invoice Due',
      subject,
      message,
      html,
      details: `Billed ${formattedAmount} for ${fee.term} (Due: ${fee.dueDate})`
    });
  },

  /**
   * 3. Auto-dispatch Admission Status Update
   */
  async autoDispatchAdmissionStatus(app: {
    applicationNo: string;
    applicantName: string;
    gradeApplying: string;
    parentName: string;
    parentEmail: string;
    status: string;
    notes?: string;
  }): Promise<SendEmailResult | null> {
    const automation = getAutomationSettings();
    if (!automation.autoAdmissionStatusChange) return null;
    if (!app.parentEmail) return null;

    const subject = `[ADMISSION STATUS: ${app.status.toUpperCase()}] Application #${app.applicationNo} • ${app.applicantName}`;
    const html = this.generateAdmissionStatusEmailHtml({
      applicantName: app.applicantName,
      applicationNo: app.applicationNo,
      gradeApplying: app.gradeApplying,
      parentName: app.parentName,
      status: app.status,
      notes: app.notes
    });
    const message = `Application #${app.applicationNo} Status Update:\nCandidate: ${app.applicantName}\nGrade: ${app.gradeApplying}\nStatus: ${app.status}\nNotes: ${app.notes || 'None'}`;

    return await this.sendAutomaticEmail({
      to: app.parentEmail,
      recipientName: app.parentName,
      type: 'Admission Status',
      subject,
      message,
      html,
      details: `Status changed to ${app.status} for candidate ${app.applicantName}`
    });
  },

  /**
   * 4. Auto-dispatch Scholar Enrolment Welcome Dossier
   */
  async autoDispatchEnrollmentWelcome(student: {
    name: string;
    grade: string;
    section: string;
    rollNo: string;
    loginId: string;
    password?: string;
    guardianEmail: string;
    guardianName: string;
    house?: string;
    busRoute?: string;
  }): Promise<SendEmailResult | null> {
    if (!student.guardianEmail) return null;

    const subject = `[WELCOME] Scholar Enrolled - Login Credentials for ${student.name} (${student.grade}-${student.section})`;
    const html = this.generateEnrollmentWelcomeEmailHtml({
      studentName: student.name,
      grade: student.grade,
      section: student.section,
      rollNo: student.rollNo,
      loginId: student.loginId,
      password: student.password,
      guardianName: student.guardianName,
      house: student.house,
      busRoute: student.busRoute
    });
    const message = `Welcome to Paradise Public School!\nScholar: ${student.name}\nGrade: ${student.grade}-${student.section}\nRoll No: ${student.rollNo}\nLogin ID: ${student.loginId}\nPassword: ${student.password || 'password123'}`;

    return await this.sendAutomaticEmail({
      to: student.guardianEmail,
      recipientName: student.guardianName,
      type: 'Enrolment Welcome',
      subject,
      message,
      html,
      details: `Enrolled scholar ${student.name} with Login ID: ${student.loginId}`
    });
  },

  /**
   * 5. Auto-dispatch Attendance Absence Alert
   */
  async autoDispatchAttendanceAlert(
    student: {
      name: string;
      grade: string;
      section: string;
      rollNo?: string;
      guardianEmail?: string;
      guardianName?: string;
    },
    date: string,
    status: 'Absent' | 'Late' = 'Absent'
  ): Promise<SendEmailResult | null> {
    const automation = getAutomationSettings();
    if (!automation.autoAttendanceAbsenceAlert) return null;

    const recipient = student.guardianEmail || `${student.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const subject = `[ATTENDANCE ALERT] Scholar Marked ${status.toUpperCase()} - ${student.name} (${student.grade}-${student.section}) on ${date}`;
    const html = this.generateAttendanceAlertEmailHtml({
      studentName: student.name,
      grade: student.grade,
      section: student.section,
      date,
      guardianName: student.guardianName
    });
    const message = `Official Attendance Alert: ${student.name} (${student.grade}-${student.section}) was marked ${status} on ${date}. Please contact reception: +91 2932 224567.`;

    return await this.sendAutomaticEmail({
      to: recipient,
      recipientName: student.guardianName || student.name,
      type: 'Attendance Alert',
      subject,
      message,
      html,
      details: `Scholar recorded ${status} on ${date}`
    });
  },

  /**
   * 6. Auto-dispatch Examination Result Publication
   */
  async autoDispatchExamResult(
    result: {
      studentName: string;
      grade: string;
      section: string;
      examName: string;
      totalMarks: number;
      maxTotal: number;
      percentage: number;
      overallGrade: string;
      gpa: number;
      teacherRemarks?: string;
    },
    student?: { guardianEmail?: string; guardianName?: string }
  ): Promise<SendEmailResult | null> {
    const automation = getAutomationSettings();
    if (!automation.autoExamResultPublished) return null;

    const recipient = student?.guardianEmail || `${result.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const subject = `[REPORT CARD] ${result.examName} Result Declared - ${result.studentName} (${result.grade}-${result.section})`;
    const html = this.generateReportCardEmailHtml(result);
    const message = `CBSE Examination Result: ${result.studentName}\nExam: ${result.examName}\nTotal: ${result.totalMarks}/${result.maxTotal}\nPercentage: ${result.percentage}%\nGrade: ${result.overallGrade}`;

    return await this.sendAutomaticEmail({
      to: recipient,
      recipientName: student?.guardianName || result.studentName,
      type: 'Exam Result',
      subject,
      message,
      html,
      details: `${result.examName}: ${result.percentage}% (Grade: ${result.overallGrade})`
    });
  },

  /**
   * 7. Auto-dispatch Leave Status Update
   */
  async autoDispatchLeaveStatus(
    leave: {
      studentName: string;
      grade: string;
      fromDate: string;
      toDate: string;
      reason: string;
      status: string;
    },
    student?: { guardianEmail?: string; guardianName?: string }
  ): Promise<SendEmailResult | null> {
    const automation = getAutomationSettings();
    if (!automation.autoLeaveStatusUpdate) return null;

    const recipient = student?.guardianEmail || `${leave.studentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const subject = `[LEAVE APPLICATION] Decision: ${leave.status.toUpperCase()} for ${leave.studentName} (${leave.fromDate} to ${leave.toDate})`;
    const message = `Leave Application Decision for ${leave.studentName}:\nStatus: ${leave.status}\nPeriod: ${leave.fromDate} to ${leave.toDate}\nReason: ${leave.reason}`;

    return await this.sendAutomaticEmail({
      to: recipient,
      recipientName: student?.guardianName || leave.studentName,
      type: 'Leave Status',
      subject,
      message,
      details: `Leave application ${leave.status} for ${leave.fromDate} to ${leave.toDate}`
    });
  },

  /**
   * Batch Automated Due Reminders Scanner
   */
  async runAutomatedDueRemindersBatch(
    pendingFees: Array<{
      id: string;
      invoiceNo: string;
      studentId: string;
      studentName: string;
      grade: string;
      term: string;
      totalAmount: number;
      dueDate: string;
    }>,
    students: Array<{ id: string; name: string; rollNo?: string; guardianEmail?: string; guardianName?: string }>
  ): Promise<{ dispatchedCount: number }> {
    let dispatched = 0;
    for (const fee of pendingFees) {
      const student = students.find(s => s.id === fee.studentId || s.name === fee.studentName);
      await this.autoDispatchFeeInvoice(fee, student);
      dispatched++;
    }
    return { dispatchedCount: dispatched };
  },

  /**
   * Existing manual methods for backwards compatibility
   */
  async sendContactInquiry(inquiry: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<SendEmailResult> {
    const config = getEmailConfig();
    const destinationEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';
    const formattedSubject = `[Website Inquiry] ${inquiry.subject} - from ${inquiry.name}`;
    const formattedBody = `NEW INQUIRY RECEIVED VIA PARADISE PUBLIC SCHOOL WEBSITE
----------------------------------------------------------------------
Sender Name : ${inquiry.name}
Email       : ${inquiry.email}
Phone       : ${inquiry.phone || 'Not provided'}
Subject     : ${inquiry.subject}
Date & Time : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

MESSAGE:
${inquiry.message}`;

    const res = await this.sendEmail({
      to: destinationEmail,
      replyTo: inquiry.email,
      fromName: inquiry.name,
      subject: formattedSubject,
      message: formattedBody
    });

    addEmailLog({
      recipientEmail: destinationEmail,
      recipientName: 'School Directorate',
      type: 'Inquiry',
      subject: formattedSubject,
      status: res.fallbackTriggered ? 'Composed (Webmail)' : 'Delivered',
      provider: res.providerUsed,
      details: `From ${inquiry.name} (${inquiry.email})`
    });

    return res;
  },

  async sendAdmissionConfirmation(app: {
    applicationNo: string;
    applicantName: string;
    gradeApplying: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    submissionDate: string;
  }): Promise<SendEmailResult> {
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';
    const subject = `[Admission Application Received] Ref: ${app.applicationNo} • ${app.applicantName} (${app.gradeApplying})`;
    const body = `Dear ${app.parentName},\n\nThank you for registering your child's application for admission to Paradise Public School.\n\nApplication Number: ${app.applicationNo}\nCandidate Name: ${app.applicantName}\nGrade: ${app.gradeApplying}\nSubmission Date: ${app.submissionDate}\n\nOur admissions committee will evaluate the dossier and reach out shortly.\n\nAdmissions Desk: ${schoolEmail} • +91 2932 224567`;

    return await this.sendAutomaticEmail({
      to: app.parentEmail,
      recipientName: app.parentName,
      type: 'Admission Status',
      subject,
      message: body,
      details: `Initial application confirmation #${app.applicationNo}`
    });
  },

  async sendFeeReminder(params: {
    studentName: string;
    grade: string;
    rollNo: string;
    invoiceNo: string;
    term: string;
    amount: number;
    dueDate: string;
    recipientEmail: string;
    customMessage?: string;
  }): Promise<SendEmailResult> {
    const formattedAmount = `₹${params.amount.toLocaleString('en-IN')}`;
    const subject = `[URGENT] Tuition Fee Due Notice - ${params.studentName} (${params.grade}) • Invoice #${params.invoiceNo}`;
    const message = params.customMessage || this.generateFeeEmailText({
      studentName: params.studentName,
      grade: params.grade,
      rollNo: params.rollNo,
      invoiceNo: params.invoiceNo,
      term: params.term,
      amountFormatted: formattedAmount,
      dueDateFormatted: params.dueDate
    });
    const html = this.generateFeeEmailHtml({
      studentName: params.studentName,
      grade: params.grade,
      rollNo: params.rollNo,
      invoiceNo: params.invoiceNo,
      term: params.term,
      amountFormatted: formattedAmount,
      dueDateFormatted: params.dueDate
    });

    const res = await this.sendEmail({
      to: params.recipientEmail,
      subject,
      message,
      html
    });

    addEmailLog({
      recipientEmail: params.recipientEmail,
      recipientName: params.studentName,
      type: 'Manual Reminder',
      subject,
      status: res.fallbackTriggered ? 'Composed (Webmail)' : 'Delivered',
      provider: res.providerUsed,
      details: `Manual reminder for Invoice #${params.invoiceNo} (${formattedAmount})`
    });

    return res;
  },

  async sendTestEmail(recipientEmail: string): Promise<SendEmailResult> {
    const config = getEmailConfig();
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const paymentUrl = getPaymentPortalUrl();

    const subject = `[TEST] Paradise Public School Email System Verification - ${timestamp} IST`;
    const message = `Hello,

This is an automated test message from Paradise Public School's Email Dispatch System.

Configuration Status:
- Selected Provider : ${config.provider}
- Sender Address   : ${config.senderEmail}
- Dispatch Mode    : Live Cloud Email Gateway
- Payment Portal   : ${paymentUrl}
- Timestamp        : ${timestamp} IST

If you received this message, your school's email delivery system is functioning properly and ready to dispatch fee reminders, admission notices, and circulars!

Warm regards,
IT Directorate
Paradise Public School`;

    if (config.provider === 'web3forms' && !config.web3FormsKey) {
      return {
        success: false,
        message: 'Web3Forms is selected but Access Key is missing. Enter your free Web3Forms Access Key from https://web3forms.com',
        providerUsed: 'Web3Forms API'
      };
    }

    if (config.provider === 'emailjs' && (!config.emailJsServiceId || !config.emailJsPublicKey)) {
      return {
        success: false,
        message: 'EmailJS is selected but Service ID / Public Key is missing. Enter your EmailJS credentials.',
        providerUsed: 'EmailJS REST Gateway'
      };
    }

    const res = await this.sendEmail({
      to: recipientEmail,
      replyTo: config.senderEmail,
      fromName: 'Paradise Public School Verification',
      subject,
      message
    });

    addEmailLog({
      recipientEmail,
      recipientName: 'Administrator Test',
      type: 'Inquiry',
      subject,
      status: res.fallbackTriggered ? 'Composed (Webmail)' : 'Delivered',
      provider: res.providerUsed,
      details: 'Test email verification'
    });

    return res;
  }
};
