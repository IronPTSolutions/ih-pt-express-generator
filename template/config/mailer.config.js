const nodemailer = require('nodemailer');

const appUrl = process.env.APP_URL;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASSWORD;

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user,
        pass,
    },
});

module.exports.sendValidationEmail = (email, activationToken, name) => {
    transport.sendMail({
        to: email,
        from: `template team <${user}>`,
        subject: 'Activate your account',
        html: `
					<h1>Hi ${name}</h1>
					<p>Click on the button below to activate your account ❤️</p>
					<a href="${appUrl}/activate/${activationToken}" style="padding: 10px 20px; color: white; background-color: pink; border-radius: 5px;">Click here</a>
				`,
    });
};
