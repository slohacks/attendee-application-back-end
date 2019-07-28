const express = require('express')
const jwt = require('jsonwebtoken')
const EmailRequest = require('../models/EmailRequestModel')
const User = require('../models/User')
const router = new express.Router()

router.post('/emails/resend', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error()
    }

    const existingEmailRequest = await EmailRequest.findOne({ owner: user._id })

    if (existingEmailRequest) {
      await existingEmailRequest.remove()
    }

    const verificationToken = jwt.sign({ email }, 'SECRETWILLBEHERE', { expiresIn: 60 })
    const newEmailRequest = new EmailRequest({ token: verificationToken, owner: user._id })
    await newEmailRequest.save()
    res.status(200).send({})
  } catch (err) {
    res.status(200).send({})
  }
})

router.post('/emails/confirm/:token', async (req, res) => {
  const { token } = req.params
  const emailRequest = await EmailRequest.findOne({ token })
  try {
    if (!emailRequest) {
      throw new Error('There is no email request with that token')
    }

    const tokenInfo = jwt.verify(token, 'SECRETWILLBEHERE')
    const user = await User.findOne({ email: tokenInfo.email })

    if (!user) {
      throw new Error('Unable to verify the given user in the token')
    }

    emailRequest.remove()
    user.emailVerified = true
    user.verifyTime = Date.now()
    await user.save()
    res.status(200).send({})
  } catch (err) {
    emailRequest.remove()
    res.status(400).send({})
  }
})

module.exports = router
