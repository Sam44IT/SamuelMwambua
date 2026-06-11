import nodemailer from "nodemailer";

const getMailConfig = () => ({
  host: process.env.SMTP_HOST || (process.env.GMAIL_USER ? "smtp.gmail.com" : ""),
  port: process.env.SMTP_PORT || (process.env.GMAIL_USER ? "587" : ""),
  user: process.env.SMTP_USER || process.env.GMAIL_USER,
  pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
  adminEmail: process.env.ADMIN_EMAIL,
  contactEmail:
    process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || "sampc4469@gmail.com",
});

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatMessageHtml = (value) =>
  escapeHtml(value)
    .split(/\r?\n/)
    .map((line) => line || "&nbsp;")
    .join("<br />");

const getTransporter = () => {
  const config = getMailConfig();

  if (!config.host || !config.port || !config.user || !config.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: Number(config.port),
    secure: Number(config.port) === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

export const sendMail = async ({ subject, text, html, to, replyTo }) => {
  const config = getMailConfig();
  const transporter = getTransporter();
  const recipient = to || config.adminEmail;
  if (!transporter || !recipient) return false;

  await transporter.sendMail({
    from: `"Samuel Portfolio" <${config.user}>`,
    to: recipient,
    replyTo,
    subject,
    text,
    html,
  });

  return true;
};

export const sendLoginAttemptEmail = async ({
  status,
  username,
  ipAddress,
  userAgent,
  timestamp,
}) => {
  try {
    await sendMail({
      subject: `Portfolio admin login ${status}`,
      text: [
        `Status: ${status}`,
        `Username: ${username || "unknown"}`,
        `IP address: ${ipAddress || "unknown"}`,
        `Browser/device: ${userAgent || "unknown"}`,
        `Timestamp: ${timestamp}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Unable to send login attempt email:", error.message);
  }
};

export const sendBruteForceWarningEmail = async ({ ipAddress, attempts }) => {
  try {
    await sendMail({
      subject: "WARNING: Possible portfolio admin brute force attack",
      text: `WARNING: Possible brute force attack detected from IP ${ipAddress}. ${attempts} failed attempts in the last 10 minutes.`,
    });
  } catch (error) {
    console.error("Unable to send brute force warning email:", error.message);
  }
};

export const sendAdminOtpEmail = async ({
  recipient,
  username,
  otp,
  expiresInMinutes,
  ipAddress,
  userAgent,
  timestamp,
}) => {
  return sendMail({
    to: recipient,
    subject: "Your portfolio admin verification code",
    text: [
      `Verification code: ${otp}`,
      `This code expires in ${expiresInMinutes} minutes.`,
      "",
      `Admin username: ${username || "unknown"}`,
      `IP address: ${ipAddress || "unknown"}`,
      `Browser/device: ${userAgent || "unknown"}`,
      `Timestamp: ${timestamp}`,
      "",
      "If you did not request this code, change your admin password immediately.",
    ].join("\n"),
  });
};

export const sendContactMessageEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  const config = getMailConfig();
  const receivedAt = new Date().toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);

  return sendMail({
    to: config.contactEmail,
    replyTo: email,
    subject: `New portfolio message: ${subject}`,
    text: [
      "New portfolio contact message",
      "",
      `From: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      `Received: ${receivedAt}`,
      "",
      message,
    ].join("\n"),
    html: `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbeafe;box-shadow:0 18px 45px rgba(15,23,42,0.10);">
            <tr>
              <td style="padding:28px 30px;background:linear-gradient(135deg,#00d4ff,#2563eb);color:#ffffff;">
                <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.9;">Samuel Portfolio</div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">New contact message</h1>
                <p style="margin:8px 0 0;font-size:15px;opacity:.92;">A visitor sent a message from your portfolio contact form.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:14px 16px;background:#eff6ff;border-radius:12px;">
                      <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;">Sender</div>
                      <div style="margin-top:6px;font-size:18px;font-weight:800;color:#0f172a;">${safeName}</div>
                      <a href="mailto:${safeEmail}" style="display:inline-block;margin-top:4px;color:#0369a1;text-decoration:none;font-weight:700;">${safeEmail}</a>
                    </td>
                  </tr>
                </table>

                <div style="height:18px;"></div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                  <tr>
                    <td style="padding:16px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                      <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;">Subject</div>
                      <div style="margin-top:6px;font-size:18px;font-weight:800;color:#172033;">${safeSubject}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px;font-size:16px;line-height:1.65;color:#334155;">
                      ${formatMessageHtml(message)}
                    </td>
                  </tr>
                </table>

                <div style="height:18px;"></div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:14px 16px;background:#0f172a;border-radius:12px;color:#e2e8f0;">
                      <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;font-weight:700;">Received</div>
                      <div style="margin-top:6px;font-size:15px;font-weight:700;">${escapeHtml(receivedAt)} EAT</div>
                    </td>
                  </tr>
                </table>

                <p style="margin:22px 0 0;font-size:13px;line-height:1.55;color:#64748b;">
                  You can reply directly to this email and your response will go to ${safeName}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  });
};
