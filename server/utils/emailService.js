import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter using Gmail App Password
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `M&M Healthcare <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - M&M Healthcare',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: white;
              border: 2px dashed #3b82f6;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
              border-radius: 8px;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #2563eb;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6b7280;
              font-size: 14px;
            }
            .warning {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏥 M&M Healthcare</h1>
            <p>Your Digital Medical Mate</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering with M&M Healthcare. To complete your registration, please verify your email address.</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #6b7280;">Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">This code will expire in 10 minutes</p>
            </div>
            
            <p>Enter this code in the verification page to activate your account.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this verification code, please ignore this email. Never share this code with anyone.
            </div>
            
            <p>Need help? Contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2025 M&M Healthcare. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `M&M Healthcare <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to M&M Healthcare! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .feature-box {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to M&M Healthcare!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Your email has been successfully verified. Welcome to the M&M Healthcare family!</p>
            
            <h3>What you can do now:</h3>
            <div class="feature-box">
              🩺 <strong>AI-Powered Symptom Analysis</strong><br>
              Get intelligent health insights based on your symptoms
            </div>
            <div class="feature-box">
              🔒 <strong>Secure Health Records</strong><br>
              Your data is encrypted and protected
            </div>
            <div class="feature-box">
              🌍 <strong>Multi-Language Support</strong><br>
              Access healthcare in your preferred language
            </div>
            <div class="feature-box">
              💙 <strong>Personalized Care</strong><br>
              Receive tailored health recommendations
            </div>
            
            <p style="margin-top: 30px;">Ready to start your health journey? Log in now and explore!</p>
          </div>
        </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false, error: error.message };
  }
};
