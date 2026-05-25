const nodemailer = require("nodemailer");

const sendPasswordEmail = async (to, token) => {
  try {
    //1. Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${token}`;

    //create the message
    const message = {
      to,
      subject: "Reset Your StoryFlow Password",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #f8fafc;
      width: 100%;
      padding: 40px 0;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
      overflow: hidden;
    }
    .header {
      padding: 32px 32px 20px;
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      line-height: 36px;
      color: #ffffff;
      font-weight: bold;
      font-size: 18px;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      letter-spacing: -0.5px;
    }
    .logo-suffix {
      color: #6366f1;
    }
    .body {
      padding: 32px;
      color: #334155;
      font-size: 15px;
      line-height: 1.6;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    .text {
      margin-top: 0;
      margin-bottom: 24px;
      color: #475569;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 9999px;
      font-weight: bold;
      font-size: 15px;
      display: inline-block;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);
    }
    .divider {
      border-top: 1px solid #e2e8f0;
      margin: 28px 0;
    }
    .warning-text {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .link-fallback {
      font-size: 12px;
      word-break: break-all;
      color: #6366f1;
      text-decoration: none;
    }
    .footer {
      padding: 24px 32px;
      background-color: #f8fafc;
      border-top: 1px solid #f1f5f9;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div style="display: inline-block;">
          <div class="logo-badge">S</div>
          <span class="logo-text">Story<span class="logo-suffix">Flow</span></span>
        </div>
      </div>
      
      <!-- Body -->
      <div class="body">
        <h1 class="title">Reset Your Password</h1>
        <p class="text">We received a request to reset the password for your StoryFlow account. Click the button below to choose a new password.</p>
        
        <div class="button-container">
          <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
        </div>
        
        <p class="text">If you did not request a password reset, you can safely ignore this email; your password will remain unchanged.</p>
        
        <div class="divider"></div>
        
        <p class="warning-text">If the button above does not work, copy and paste this URL into your browser:</p>
        <a href="${resetUrl}" class="link-fallback">${resetUrl}</a>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 8px;">© ${new Date().getFullYear()} StoryFlow by Dhruv Patel. All rights reserved.</p>
        <p style="margin: 0;">You are receiving this system email because a password reset was initiated.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
    };
    //send the email
    const info = await transporter.sendMail(message);
    console.log("Email sent", info.messageId);
    return info;
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendPasswordEmail;
