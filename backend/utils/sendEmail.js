import nodemailer from 'nodemailer';

const getTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const otpEmailHTML = (otp, heading, subtext) => `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #3e0f0f; padding: 24px; text-align: center;">
      <h1 style="color: #b8860b; margin: 0; font-size: 22px; letter-spacing: 1px;">YOUR JEWELLERY BRAND</h1>
    </div>
    <div style="padding: 32px 24px; text-align: center;">
      <h2 style="color: #3e0f0f; margin-bottom: 8px;">${heading}</h2>
      <p style="color: #494F55; font-size: 14px; margin-bottom: 24px;">${subtext}</p>
      <div style="background-color: #f5f5f5; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #b8860b;">${otp}</span>
      </div>
      <p style="color: #999; font-size: 12px;">This code is valid for 5 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  </div>
`;

export const sendOtpEmail = async (email, otp, purpose = 'signup') => {
  const messages = {
    signup: {
      subject: 'Verify your email',
      heading: 'Verify your email',
      subtext: 'Use the code below to complete your sign up.',
    },
    login: {
      subject: 'Your login OTP',
      heading: 'Login verification',
      subtext: 'Use the code below to log in to your account.',
    },
    reset: {
      subject: 'Reset your password',
      heading: 'Reset your password',
      subtext: 'Use the code below to reset your account password.',
    },
  };

  const { subject, heading, subtext } = messages[purpose] || messages.signup;

  await getTransporter().sendMail({
    from: `"Your Jewellery Brand" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: otpEmailHTML(otp, heading, subtext),
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};

export default sendOtpEmail;
