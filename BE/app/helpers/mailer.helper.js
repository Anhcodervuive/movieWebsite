const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.mail.username, pass: config.mail.password },
});

module.exports = { transporter };
