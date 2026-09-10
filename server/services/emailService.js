import nodemailer from "nodemailer";

let transporter;

/** Lazily creates a singleton Nodemailer transporter from env config. */
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

/**
 * Sends an email. Fails "softly": logs the error rather than throwing,
 * so a broken SMTP config never breaks a core business action (e.g. saving
 * a customer) — the request still succeeds, only the notification is skipped.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

export const sendPasswordResetEmail = (to, resetUrl) =>
  sendEmail({
    to,
    subject: "Reset your RO Service Management password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#2563eb;">Password Reset Request</h2>
        <p>We received a request to reset your password. This link expires in 15 minutes.</p>
        <p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  });

export const sendServiceReminderEmail = (to, customerName, dueDate) =>
  sendEmail({
    to,
    subject: "Your RO Service is Due Soon",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#2563eb;">Service Reminder</h2>
        <p>Hi ${customerName}, your RO service is due on <b>${dueDate}</b>.</p>
        <p>Please contact us to schedule a visit.</p>
      </div>`,
  });

export const sendContactNotificationEmail = (to, contact) =>
  sendEmail({
    to,
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
        <h2 style="color:#2563eb;">New Message</h2>
        <p><b>From:</b> ${contact.name} (${contact.email})</p>
        <p><b>Phone:</b> ${contact.phone || "-"}</p>
        <p><b>Message:</b><br/>${contact.message}</p>
      </div>`,
  });
