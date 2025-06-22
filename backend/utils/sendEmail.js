const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, replyTo = null) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  if (replyTo) {
    mailOptions.replyTo = replyTo;
  }

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent:", info.messageId);
};

module.exports = sendEmail;
