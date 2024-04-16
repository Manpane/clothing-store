const nodemailer = require("nodemailer");

const sendEmail = async (email, html, subject, cc, bcc) => {
  try {
    var transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });
    return await new Promise((resolve, reject) => {
      transport.sendMail(
        {
          from: process.env.email,
          to: email,
          subject,
          html,
          cc,
          bcc,
        },
        (error, response) => {
          if (error) {
            console.log("Email could not sent due to error: " + error);
            resolve({ success: false, error: error });
          } else {
            console.log("Email has been sent successfully");
            console.log(response);
            resolve({ success: true, response: response });
          }
        },
      );
    });
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
