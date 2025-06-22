const sendEmail = require('../utils/sendEmail');

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const subject = `New message from ${name}`;
    const text = `
You received a new message from your website contact form:

👤 Name: ${name}
📧 Email: ${email}
💬 Message:
${message}
    `;

    // 1️⃣ Send to admin
    await sendEmail(process.env.EMAIL_ADMIN, subject, text, email);

    // 2️⃣ Auto-reply to user
    const autoReplySubject = `Thanks for contacting Cpn Phonex!`;
    const autoReplyText = `
Hi ${name},

Thank you for reaching out to us! 👋

We’ve received your message and will get back to you as soon as possible.

In the meantime, feel free to connect with us on our socials or revisit the site for updates.

Best regards,  
Cpn Phonex Team  
support@cpnphonex.com
    `;

    await sendEmail(email, autoReplySubject, autoReplyText);

    res.status(200).json({ success: true, message: 'Message sent to admin ✅' });
  } catch (err) {
    console.error('❌ Failed to send contact message:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};
