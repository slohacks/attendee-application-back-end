const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const EmailRequest = require('../models/EmailRequestModel')
const User = require('../models/UserModel')
const router = new express.Router()

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

    const verificationToken = jwt.sign({ email }, 'SECRET2WILLBEHERE', { expiresIn: 3600 })
    const encryptedToken = await bcrypt.hash(verificationToken, 10)
    const newEmailRequest = new EmailRequest({ token: encryptedToken, owner: user._id })
    await newEmailRequest.save()
    res.status(200).send({})
  } catch (err) {
    res.status(200).send({})
  }
})

router.post('/emails/confirm/:token', async (req, res) => {
  const { token } = req.params
  try {
    const tokenInfo = jwt.verify(token, 'SECRET2WILLBEHERE')
    const user = await User.findOne({ email: tokenInfo.email })
    if (!user) {
      throw new Error('Token doesn\'t contain an existing user')
    }

    const emailRequest = await EmailRequest.findOne({ owner: user._id })
    if (!emailRequest) {
      throw new Error('There is no email request with that token')
    }

    const isMatch = await bcrypt.compare(token, emailRequest.token)
    if (!isMatch) {
      throw new Error('Token doesn\'t match a request')
    }

    emailRequest.remove()
    user.emailVerified = true
    user.verifyTime = Date.now()
    await user.save()
    res.status(200).send({})
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        const failedTokenInfo = jwt.decode(token)
        const failedUserRequest = await User.findOne({ email: failedTokenInfo.email })
        const emailRequest = await EmailRequest.findOne({ owner: failedUserRequest._id })
        if (emailRequest) {
          emailRequest.remove()
        }
        return res.status(400).send({})
      default:
        return res.status(400).send({})
    }
  }
})

module.exports = router
