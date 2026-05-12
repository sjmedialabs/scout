import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendSetPasswordEmail(email: string, token: string) {

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/set-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Scout Team" <no-reply@scout.com>`,
    to: email,
    subject: "Set your password",
    html: `
      <p>You have been added as an agency.</p>
      <p>Click below to set your password:</p>
      <a href="${link}">Set Password</a>
    `,
  });
}

export async function sendApplicationStatusEmail(
  email: string,
  name: string,
  jobTitle: string,
  status: string
) {

  const subject = `Update on your application for ${jobTitle}`;

  let html = `<p>Hi ${name},</p>`;

  if (status === "selected") {
    html += `
      <p>We’re thrilled to inform you that you have been <b>selected</b> for the <b>${jobTitle}</b> position!</p>
      <p>Our HR team will reach out to you shortly with the offer details and onboarding steps.</p>
    `;
  } else if (status === "shortlisted") {
    html += `
      <p>Great news! Your application for <b>${jobTitle}</b> has been <b>shortlisted</b>.</p>
      <p>We would like to schedule an interview with you. Expect a call or email from our team soon.</p>
    `;
  } else if (status === "rejected") {
    html += `
      <p>Thank you for your interest in the <b>${jobTitle}</b> position.</p>
      <p>After careful review, we regret to inform you that we will not be moving forward with your application at this time.</p>
      <p>We wish you the best in your job search.</p>
    `;
  } else {
    html += `
      <p>Your application status for <b>${jobTitle}</b> has been updated to: <b>${status.toUpperCase()}</b>.</p>
      <p>We will keep you posted on any further updates.</p>
    `;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Scout Team" <no-reply@scout.com>`,
    to: email,
    subject,
    html,
  });
}

