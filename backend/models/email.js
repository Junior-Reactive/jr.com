const nodemailer = require('nodemailer');

async function sendContactNotification(data) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Junior Reactive" <${process.env.EMAIL_USER}>`,
        to: 'juniorreactive@gmail.com',
        subject: `New Contact: ${data.subject}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendContactNotification };