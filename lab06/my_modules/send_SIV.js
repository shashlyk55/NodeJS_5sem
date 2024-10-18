const nodemailer = require('nodemailer')
const sendmail = require('sendmail')()


function send(message){
    sendmail(
        {
            to: 'rajavil872@adambra.com',
            from: 'wiyorep191@craftapk.com',
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