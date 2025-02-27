import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'esportsyoddha@gmail.com',  // Your Gmail email address
    pass: 'wlus zjeq vufg gprg'    // Your email password or App Password (if 2FA enabled)
  }
});

const sendMail = async (to, subject, textcontent, htmlcontent=null) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: textcontent,
    html: htmlcontent
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};

export default sendMail;
