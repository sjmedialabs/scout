import nodemailer from "nodemailer";

export async function sendSetPasswordEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/set-password?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <no-reply@yourapp.com>`,
    to: email,
    subject: "Set your password",
    html: `
      <p>You have been added as an agency.</p>
      <p>Click below to set your password:</p>
      <a href="${link}">Set Password</a>
    `,
  });
}
