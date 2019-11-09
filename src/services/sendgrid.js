const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const emailEnvironment = ['production', 'development']

const sendVerificationEmail = (email, token) => {
  if (emailEnvironment.includes(process.env.NODE_ENV)) {
    const link = process.env.NODE_ENV === 'production' ? `https://apply.slohacks.com/#/email/verify?token=${token}` : `localhost:8080/#/email/verify?token=${token}`
    sgMail.send({
      to: email,
      from: 'team@slohacks.com',
      subject: 'SLO Hacks Verification Link',
      text: `
      Please click the link below to verify your email address
      ${link}
      The link expires after 1 hour.
      `
    })
  }
}

const sendForgotPasswordEmail = (email, token) => {
  if (emailEnvironment.includes(process.env.NODE_ENV)) {
    const link = process.env.NODE_ENV === 'production' ? `https://apply.slohacks.com/#/forgot-password/verify?token=${token}` : `localhost:8080/#/forgot-password/verify?token=${token}`
    sgMail.send({
      to: email,
      from: 'team@slohacks.com',
      subject: 'SLO Hacks Reset Password',
      text: `
      Please click the link below to change your password
      ${link}
      The link will expire after 1 hour.`
    })
  }
}

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail
}
