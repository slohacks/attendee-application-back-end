const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerificationEmail = (email, token) => {
  sgMail.send({
    to: email,
    from: 'team@slohacks.com',
    subject: 'SLO Hacks Verification Link',
    text: `The token below will allow you to verify your account.\n${token}\nThe token expires after 1 hour.`
  })
}

const sendForgotPasswordEmail = (email, token) => {
  sgMail.send({
    to: email,
    from: 'team@slohacks.com',
    subject: 'SLO Hacks Reset Password',
    text: `The token will below will allow you to reset your password.\n${token}\nThe token expires after 1 hour.`
  })
}

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail
}
