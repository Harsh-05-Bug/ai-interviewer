const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 48px; height: 48px; border-radius: 12px; background: #0071E3; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-weight: 800; font-size: 20px;">AI</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #1D1D1F; margin: 16px 0 4px;">AI Interviewer</h1>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; color: #1D1D1F; margin-bottom: 8px;">Verify your email</h2>
      <p style="font-size: 15px; color: #6E6E73; line-height: 1.6; margin-bottom: 24px;">
        Hi ${name},<br/><br/>Thanks for signing up! Please verify your email address to start using AI Interviewer.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: #0071E3; color: white; text-decoration: none; border-radius: 980px; font-weight: 600; font-size: 15px;">Verify Email Address</a>
      </div>
      <p style="font-size: 13px; color: #86868B; line-height: 1.5;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E7; text-align: center;">
        <p style="font-size: 12px; color: #86868B;">AI Interviewer · Interview Prep Platform</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"AI Interviewer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email — AI Interviewer',
    html,
  });
}

async function sendWelcomeEmail(email, name) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 48px; height: 48px; border-radius: 12px; background: #0071E3; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-weight: 800; font-size: 20px;">AI</span>
        </div>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; color: #1D1D1F; margin-bottom: 8px;">Welcome to AI Interviewer!</h2>
      <p style="font-size: 15px; color: #6E6E73; line-height: 1.6; margin-bottom: 24px;">
        Hi ${name},<br/><br/>Your email has been verified. You're all set to start practicing!
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/setup" style="display: inline-block; padding: 14px 32px; background: #0071E3; color: white; text-decoration: none; border-radius: 980px; font-weight: 600; font-size: 15px;">Start Mock Interview</a>
      </div>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E7; text-align: center;">
        <p style="font-size: 12px; color: #86868B;">AI Interviewer · Interview Prep Platform</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"AI Interviewer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to AI Interviewer!',
    html,
  });
}

async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 48px; height: 48px; border-radius: 12px; background: #0071E3; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-weight: 800; font-size: 20px;">AI</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #1D1D1F; margin: 16px 0 4px;">AI Interviewer</h1>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; color: #1D1D1F; margin-bottom: 8px;">Reset your password</h2>
      <p style="font-size: 15px; color: #6E6E73; line-height: 1.6; margin-bottom: 24px;">
        Hi ${name},<br/><br/>We received a request to reset your password. Click the button below to choose a new password.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #FF3B30; color: white; text-decoration: none; border-radius: 980px; font-weight: 600; font-size: 15px;">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #86868B; line-height: 1.5;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E7; text-align: center;">
        <p style="font-size: 12px; color: #86868B;">AI Interviewer · Interview Prep Platform</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"AI Interviewer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password — AI Interviewer',
    html,
  });
}

async function sendOTPEmail(email, name, otp) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; background: #111; color: #fff; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 48px; height: 48px; border-radius: 12px; background: #00F0B5; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: #0a0a0a; font-weight: 800; font-size: 20px;">AI</span>
        </div>
      </div>
      <h2 style="font-size: 20px; font-weight: 600; color: #00F0B5; text-align: center; margin-bottom: 8px;">Admin Verification Code</h2>
      <p style="font-size: 14px; color: #999; text-align: center; margin-bottom: 24px;">Hi ${name}, here is your OTP for admin password change:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #00F0B5; background: #1a1a1a; padding: 16px 32px; border-radius: 12px; display: inline-block;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: #555; text-align: center;">This code expires in 10 minutes. Do not share it with anyone.</p>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #333; text-align: center;">
        <p style="font-size: 11px; color: #444;">AI Interviewer · Admin Panel</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"AI Interviewer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Admin OTP Code — AI Interviewer',
    html,
  });
}

module.exports = { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendOTPEmail };
