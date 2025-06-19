const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message);
    return;
  }
  console.log('Ethereal account created:');
  console.log('User:', account.user);
  console.log('Pass:', account.pass);
  console.log('SMTP host:', account.smtp.host);
  console.log('SMTP port:', account.smtp.port);
});