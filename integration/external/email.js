import nodemailer from "nodemailer";

let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        },
    });

async function sendEmail(emailBody) {
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Aravind" <samalaaravind02@gmail.com>', // sender address
        to: "projectsar07@gmail.com, aravind.reddy@certifyglobal.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: emailBody, // plain text body
        html: "<b>Hello world?</b>", // html body
    });


    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


}

export { sendEmail }