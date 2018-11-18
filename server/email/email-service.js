const config = require("../config")
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
})

let sendMail = function sendMail(mailOptions, next) {
    console.log('Sending Email near transporter')
    transporter.sendMail(mailOptions, (error, info) => {
        console.log("Sending Email in Transporter")
        if (error) {
            console.log("Sending Email in Transporter -> Error")
            console.log(error)
            return console.log(error);
        }

        console.log("Sending Email in Transporter -> Success")
        console.log('Message sent: %s', info.messageId)

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

        next();
    })
}

module.exports = sendMail;