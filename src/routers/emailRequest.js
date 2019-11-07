const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = new express.Router()

const EmailRequest = require('../models/EmailRequestModel')
const User = require('../models/UserModel')
const { sendVerificationEmail } = require('../services/sendgrid')

const verifyEmailSecretKey = process.env.VERIFY_EMAIL_SECRET_KEY

router.post('/emails/resend', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('User wasn\'t found')
    }

    const existingEmailRequest = await EmailRequest.findOne({ owner: user._id })

    if (existingEmailRequest) {
      await existingEmailRequest.remove()
    }

    const verificationToken = jwt.sign({ email }, verifyEmailSecretKey, { expiresIn: 3600 })
    const uniqueToken = verificationToken.split('.').pop()
    const encryptedToken = await bcrypt.hash(uniqueToken, 10)
    const newEmailRequest = new EmailRequest({ token: encryptedToken, owner: user._id })
    await newEmailRequest.save()
    sendVerificationEmail(email, verificationToken)
    res.status(200).send({ success: true })
  } catch (err) {
    res.status(200).send({ success: true })
  }
})

router.post('/emails/confirm/:token', async (req, res) => {
  const { token } = req.params
  try {
    const tokenInfo = jwt.verify(token, verifyEmailSecretKey)
    const user = await User.findOne({ email: tokenInfo.email })
    if (!user) {
      throw new Error('Token doesn\'t contain an existing user')
    }

    const emailRequest = await EmailRequest.findOne({ owner: user._id })
    if (!emailRequest) {
      throw new Error('There is no email request with that token')
    }
    const uniqueToken = token.split('.').pop()
    const isMatch = await bcrypt.compare(uniqueToken, emailRequest.token)
    if (!isMatch) {
      throw new Error('Token doesn\'t match a request')
    }

    emailRequest.remove()
    user.emailVerified = true
    user.verifyEmailTimestamp = Date.now()
    await user.save()
    res.status(200).send({ success: true })
  } catch (err) {
    jwt.verify(
      token,
      verifyEmailSecretKey,
      { ignoreExpiration: true },
      async function (errToken, decoded) {
        if (errToken) {
          return res.status(400).send({ success: false })
        }
        const { email } = decoded
        const { _id } = await User.findOne({ email })
        const emailRequest = await EmailRequest.findOne({ owner: _id })
        if (emailRequest) {
          const uniqueToken = token.split('.').pop()
          const isMatch = await bcrypt.compare(uniqueToken, emailRequest.token)
          if (isMatch) {
            emailRequest.remove()
          }
        }
        return res.status(400).send({ success: false })
      })
  }
})

module.exports = router
