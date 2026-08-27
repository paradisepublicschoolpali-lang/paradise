// ============================================================================
// PARADISE PUBLIC SCHOOL - EMAIL DISPATCH SERVICE & INTEGRATION LAYER
// ============================================================================
// Supports:
// 1. Executive Styled HTML Email Templates (With Direct Online Payment Button)
// 2. Web3Forms Cloud API (Direct email delivery to inbox without backend)
// 3. EmailJS REST API (Browser-to-Email Delivery)
// 4. Custom REST Webhook / SMTP API Gateway
// 5. Direct 1-Click Gmail Webmail Composer (https://mail.google.com)
// 6. Native OS Mailto Client Fallback
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

const STORAGE_KEY = 'pps_v1_email_config';

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
  getPaymentUrl: getPaymentPortalUrl,

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
        <!-- Email Card Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.25); border: 1px solid #334155;">
          
          <!-- Header Banner -->
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
              <p style="color: #bfdbfe; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">CBSE Affiliation No: 2130842 • School Code: 71234</p>
            </td>
          </tr>

          <!-- Notice Header & Status Badge -->
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

          <!-- Salutation & Message -->
          <tr>
            <td style="padding: 12px 32px 20px 32px; font-size: 14px; line-height: 1.6; color: #334155;">
              <p style="margin: 0 0 10px 0; font-size: 15px;">Dear Parent / Guardian of <strong>${params.studentName}</strong>,</p>
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                Greetings from the Accounts & Treasury Directorate. This is a formal notification regarding the outstanding Tuition Fee for the ongoing academic term. Please review the invoice breakdown below:
              </p>
            </td>
          </tr>

          <!-- Invoice Summary Card -->
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
                  <td align="right" style="padding: 16px 18px; font-size: 22px; font-weight: 900; color: #1e40af; font-family: -apple-system, sans-serif;">${params.amountFormatted}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PRIMARY ACTION BUTTON: DIRECT PAYMENT LINK -->
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
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <p style="margin: 0; font-size: 11px; color: #64748b;">
                      Direct Link: <a href="${paymentUrl}" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${paymentUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alternative Payment Options Block -->
          <tr>
            <td style="padding: 0 32px 25px 32px;">
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 18px 20px;">
                <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Additional Payment Options</h4>
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; line-height: 1.6; color: #475569;">
                  <tr>
                    <td style="padding-bottom: 8px; vertical-align: top; width: 24px; font-size: 14px;">📲</td>
                    <td style="padding-bottom: 8px;">
                      <strong>Instant UPI / QR Code:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 8px; border-radius: 6px; font-weight: 700; color: #0f172a;">paradiseschool@sbi</span>
                      <br><span style="font-size: 11px; color: #64748b;">Compatible with Google Pay, PhonePe, Paytm, BHIM & all UPI Apps</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top; width: 24px; font-size: 14px;">🏛️</td>
                    <td>
                      <strong>School Accounts Counter:</strong> Open Monday to Saturday, 08:30 AM to 03:00 PM for Cash, UPI & Card Deposits.
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Footer Contact & Sign-off -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 800; color: #f8fafc; font-size: 13px; font-family: Georgia, serif;">PARADISE PUBLIC SCHOOL</p>
              <p style="margin: 0 0 4px 0;">42 Heritage Avenue, North Campus Enclave, New Delhi - 110007, India</p>
              <p style="margin: 0 0 10px 0;">
                Accounts Desk: <a href="mailto:${schoolEmail}" style="color: #60a5fa; text-decoration: none; font-weight: 600;">${schoolEmail}</a> • Helpline: +91 11 2765 4321 / +91 98110 12345
              </p>
              <p style="margin: 0; font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 10px;">
                This is an official automated institutional communication. If you have already settled this invoice, please ignore this notice or reply with your transaction reference.
              </p>
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
   * Generates formatted text version of the Tuition Fee Notice (with direct payment link)
   */
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
           🏛️  PARADISE PUBLIC SCHOOL, NEW DELHI
     CBSE Affiliation No: 2130842 • School Code: 71234
======================================================================
OFFICIAL TUITION FEE DUE NOTICE • INVOICE #${params.invoiceNo}

Dear Parent / Guardian of ${params.studentName},

Greetings from Paradise Public School.

This is a formal reminder regarding the outstanding Tuition Fee for the upcoming academic session.

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

(Click the link above to log in to your Parent Portal, settle online via UPI, RuPay, Credit/Debit Card or Net Banking, and download your instant Tax Receipt)

⚡ OTHER PAYMENT OPTIONS:
• UPI ID          : paradiseschool@sbi (Google Pay / PhonePe / Paytm / BHIM)
• Accounts Counter: Open Monday to Saturday, 08:30 AM to 03:00 PM

Please settle the dues on or before ${params.dueDateFormatted} to ensure uninterrupted academic access.

----------------------------------------------------------------------
Accounts & Treasury Directorate • Paradise Public School
Helpline: +91 11 2765 4321 / +91 98110 12345
Official Accounts Desk: ${schoolEmail}
======================================================================`;
  },

  /**
   * 1-Click Launch Gmail Web Composer in a new tab
   */
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

  /**
   * Open Default OS Mail Client via mailto URL
   */
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
   * Dispatch email via configured cloud service or fallback
   */
  async sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
    const config = getEmailConfig();

    // 1. Try Web3Forms API if configured
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
        } else {
          console.warn('Web3Forms response not successful:', data);
        }
      } catch (err: any) {
        console.error('Web3Forms API dispatch error:', err);
      }
    }

    // 2. Try EmailJS if configured
    if (config.provider === 'emailjs' && config.emailJsServiceId && config.emailJsTemplateId && config.emailJsPublicKey) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
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

    // 3. Try Custom Webhook if configured
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
      message: `Opened Gmail Webmail composer with pre-filled content to ${payload.to}. Click Send in Gmail to transmit.`,
      providerUsed: 'Gmail Webmail Composer',
      fallbackTriggered: true
    };
  },

  /**
   * Send Contact Inquiry from Guest/Visitor to School Administration
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
Applicant / Sender Name : ${inquiry.name}
Email Address           : ${inquiry.email}
Contact Phone           : ${inquiry.phone || 'Not provided'}
Subject / Department    : ${inquiry.subject}
Date & Time             : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

MESSAGE CONTENT:
${inquiry.message}

----------------------------------------------------------------------
Paradise Public School Digital Portal Desk
Official Contact: ${destinationEmail}`;

    if (config.web3FormsKey || (config.emailJsServiceId && config.emailJsPublicKey) || config.customWebhookUrl) {
      return await this.sendEmail({
        to: destinationEmail,
        replyTo: inquiry.email,
        fromName: inquiry.name,
        subject: formattedSubject,
        message: formattedBody,
        metadata: {
          sender_name: inquiry.name,
          sender_email: inquiry.email,
          sender_phone: inquiry.phone,
          department: inquiry.subject
        }
      });
    }

    this.openGmailComposer({
      to: destinationEmail,
      subject: formattedSubject,
      body: formattedBody
    });

    return {
      success: true,
      message: `Inquiry composed for ${destinationEmail}. Gmail compose window opened.`,
      providerUsed: 'Gmail Webmail Composer',
      fallbackTriggered: true
    };
  },

  /**
   * Send Admission Application Confirmation to Parent & School
   */
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
    const body = `Dear ${app.parentName},

Greetings from Paradise Public School.

Thank you for registering your child's application for admission to Paradise Public School for Academic Year 2026-2027.

APPLICATION SUMMARY:
======================================================================
Application Number : ${app.applicationNo}
Candidate Name     : ${app.applicantName}
Grade Applied For  : ${app.gradeApplying}
Parent Name        : ${app.parentName}
Contact Phone      : ${app.parentPhone}
Registered Email   : ${app.parentEmail}
Submission Date    : ${app.submissionDate}
======================================================================

NEXT STEPS:
1. Document Review: Our admissions committee will evaluate the submitted information within 2 business days.
2. Interaction & Assessment: You will receive an invitation for an in-person candidate assessment and parent interaction.
3. Offer Letter: Formal offer letters and fee schedules will be extended upon successful assessment.

For any queries, please reach out to our Admissions Desk:
Helpline : +91 11 2765 4321 / +91 98110 12345
Email    : ${schoolEmail}
Address  : 42 Heritage Avenue, North Campus Enclave, New Delhi - 110007

Warm regards,
Admissions Directorate
Paradise Public School`;

    if (config.web3FormsKey || (config.emailJsServiceId && config.emailJsPublicKey) || config.customWebhookUrl) {
      return await this.sendEmail({
        to: app.parentEmail,
        replyTo: schoolEmail,
        fromName: 'Paradise Public School Admissions',
        subject,
        message: body,
        metadata: {
          application_no: app.applicationNo,
          applicant_name: app.applicantName,
          grade: app.gradeApplying
        }
      });
    }

    return {
      success: true,
      message: `Confirmation generated for ${app.parentEmail}`,
      providerUsed: 'Local Application Processor'
    };
  },

  /**
   * Send Single Fee Reminder to Student Guardian with styled HTML and Payment Link
   */
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
    const config = getEmailConfig();
    const schoolEmail = config.senderEmail || 'paradisepublicschool.pali@gmail.com';
    const formattedAmount = `₹${params.amount.toLocaleString('en-IN')}`;
    const paymentUrl = getPaymentPortalUrl();

    const subject = `[URGENT] Tuition Fee Due Notice - ${params.studentName} (${params.grade}) • Invoice #${params.invoiceNo}`;
    const body = params.customMessage || this.generateFeeEmailText({
      studentName: params.studentName,
      grade: params.grade,
      rollNo: params.rollNo,
      invoiceNo: params.invoiceNo,
      term: params.term,
      amountFormatted: formattedAmount,
      dueDateFormatted: params.dueDate,
      paymentLink: paymentUrl
    });

    const htmlBody = this.generateFeeEmailHtml({
      studentName: params.studentName,
      grade: params.grade,
      rollNo: params.rollNo,
      invoiceNo: params.invoiceNo,
      term: params.term,
      amountFormatted: formattedAmount,
      dueDateFormatted: params.dueDate,
      paymentLink: paymentUrl
    });

    if (config.web3FormsKey || (config.emailJsServiceId && config.emailJsPublicKey) || config.customWebhookUrl) {
      return await this.sendEmail({
        to: params.recipientEmail,
        replyTo: schoolEmail,
        fromName: 'Paradise Public School Accounts',
        subject,
        message: body,
        html: htmlBody,
        metadata: {
          invoice_no: params.invoiceNo,
          student_name: params.studentName,
          amount: params.amount,
          payment_url: paymentUrl
        }
      });
    }

    // Open Gmail composer by default
    this.openGmailComposer({
      to: params.recipientEmail,
      subject,
      body
    });

    return {
      success: true,
      message: `Opened Gmail Webmail composer for ${params.recipientEmail}`,
      providerUsed: 'Gmail Webmail Composer',
      fallbackTriggered: true
    };
  },

  /**
   * Send Test Email to verify live email delivery
   */
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

    return await this.sendEmail({
      to: recipientEmail,
      replyTo: config.senderEmail,
      fromName: 'Paradise Public School Verification',
      subject,
      message
    });
  }
};
