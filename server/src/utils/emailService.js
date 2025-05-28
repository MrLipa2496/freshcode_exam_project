const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports.sendOfferStatusMail = async (
  name,
  email,
  offerTitle,
  status
) => {
  const NODE_ENV = process.env.NODE_ENV ?? 'development';

  try {
    const transporter = nodemailer.createTransport(
      await getTransporterOptions()
    );

    const subject = `Your offer "${offerTitle}" has been ${
      status === 'approved_by_moderator' ? 'approved' : 'rejected'
    }`;

    const text = `Dear ${name},\n\nYour offer "${offerTitle}" has been ${
      status === 'approved_by_moderator' ? 'approved' : 'rejected'
    } by the moderator.`;

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fa;
              color: #333;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              padding: 20px;
            }
            .email-header {
              text-align: center;
              padding: 10px;
            }
            .email-header h2 {
              margin: 0;
              font-size: 24px;
              color: #1d72b8;
            }
            .email-body {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            .status {
              font-weight: bold;
              color: ${status === 'approved_by_moderator' ? 'green' : 'red'};
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #888;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h2>Offer Status Update</h2>
            </div>
            <div class="email-body">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Your offer <strong>"${offerTitle}"</strong> has been 
                <span class="status">${
                  status === 'approved_by_moderator' ? 'approved' : 'rejected'
                }</span>
                by the moderator.
              </p>
            </div>
            <div class="footer">
              <p>If you have any questions, feel free to contact us.</p>
              <p>Best regards,<br>Offer Moderation Team</p>
              <a href="mailto:support@offers.com">support@offers.com</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const message = {
      from: 'Offer Moderation <no-reply@squadhelp.com>',
      to: `${name} <${email}>`,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
    if (NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.log(error);
  }
};

async function getTransporterOptions () {
  const NODE_ENV = process.env.NODE_ENV ?? 'development';

  if (NODE_ENV === 'development') {
    const account = await nodemailer.createTestAccount();
    console.log(account);
    return {
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    };
  }
  if (NODE_ENV === 'test') {
    return {};
  }
  if (NODE_ENV === 'production') {
    return {
      service: 'gmail',
      auth: {
        user: process.env.MAILING_EMAIL,
        pass: process.env.MAILING_PASS,
      },
    };
  }
}
