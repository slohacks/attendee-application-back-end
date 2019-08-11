const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = new express.Router()

const EmailRequest = require('../models/EmailRequestModel')
const User = require('../models/UserModel')
const { sendVerificationEmail } = require('../services/sendgrid')

const verifyEmailSecretKey = process.env.VERIFY_EMAIL_SECRET_KEY

router.post('/users/signup', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const verificationToken = jwt.sign({ email: user.email }, verifyEmailSecretKey, { expiresIn: 3600 })
    const uniqueToken = verificationToken.split('.').pop()
    const encryptedToken = await bcrypt.hash(uniqueToken, 10)
    const newEmailRequest = new EmailRequest({ token: encryptedToken, owner: user._id })
    await newEmailRequest.save()
    sendVerificationEmail(user.email, verificationToken)
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send({ errorMessage: error.message })
  }
})

module.exports = router
