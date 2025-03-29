const nodemailer = require('nodemailer')
const sendmail = require('sendmail')()


function send(message){
    sendmail(
        {
            to: 'nedajo4193@angewy.com',
            from: 'hovoba8314@abaot.com',
            subject: message
        },
        (err) => {
            if(err){
                console.log('Error sending')
                return false
            }
            return true
        }
    )
}

module.exports = {send}