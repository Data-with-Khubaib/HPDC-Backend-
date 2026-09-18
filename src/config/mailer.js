// src/config/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a styled HTML email with a 6-digit verification code.
 */
async function sendOtpEmail(toEmail, otpCode, userName = 'User') {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"HPDC Platform" <noreply@hpdc.sa>',
    to: toEmail,
    subject: 'Your HPDC Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0d5f3a; margin: 0;">HPDC Platform</h2>
          <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 14px;">Halal Products Development Company</p>
        </div>
        <p style="color: #374151; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
        <p style="color: #374151; font-size: 14px; line-height: 1.5;">
          Your one-time verification code is below. This code will expire in <strong>10 minutes</strong>.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0d5f3a; background: #f0fdf4; padding: 12px 24px; border-radius: 8px; border: 1px dashed #0d5f3a;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #6b7280; font-size: 13px; text-align: center; line-height: 1.4;">
          If you did not request this code, please ignore this email or contact support.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 0;">
          HPDC ESG Certification System &bull; Confidential
        </p>
      </div>
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.warn(`[SMTP Warning] Could not send email via SMTP (${err.message}). Logging code in console for development:`);
    console.log(`========================================`);
    console.log(`[OTP CODE FOR ${toEmail}]: ${otpCode}`);
    console.log(`========================================`);
    return { dev: true, otpCode };
  }
}

module.exports = {
  transporter,
  sendOtpEmail,
};
