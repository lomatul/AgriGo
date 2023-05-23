const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  // const transporter = nodemailer.createTransport({
  //   service: process.env.EMAIL_SERVICE,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  try {    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMPT_PASS
      }, 
      tls: {
          rejectUnauthorized: false
      } 
    });

    await transporter.sendMail ({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: text,
    });

    console.log("email sent successfully!");
  } catch (error) {
    console.log("email not sent"+error);
  }


  // transporter.sendMail(mailOptions, function (err, info) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(info);
  //   }
  // });
};

module.exports = sendEmail;
