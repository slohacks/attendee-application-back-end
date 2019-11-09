const express = require('express')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const router = new express.Router()

const User = require('../models/UserModel')
const ForgotPasswordRequest = require('../models/ForgotPasswordRequestModel')
const { sendForgotPasswordEmail } = require('../services/sendgrid')

const forgotPasswordSecretKey = process.env.FORGOT_PASSWORD_SECRET_KEY

router.post('/forgot-password/request', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('User wasn\'t found with that email')
    }

    const resetToken = crypto.randomBytes(16).toString('hex')
    const newToken = jwt.sign({ _id: user._id, resetToken }, forgotPasswordSecretKey, { expiresIn: 3600 })
    const encryptedResetToken = await bcrypt.hash(resetToken, 10)
    const existingPasswordResetRequest = await ForgotPasswordRequest.findOne({ owner: user._id })

    if (existingPasswordResetRequest) {
      await existingPasswordResetRequest.remove()
    }

    sendForgotPasswordEmail(email, newToken)
    const newPasswordResetRequest = new ForgotPasswordRequest({ token: encryptedResetToken, owner: user._id })
    await newPasswordResetRequest.save()
    res.status(200).send({ success: true })
  } catch (err) {
    res.status(200).send({ success: true })
  }
})

router.get('/forgot-password/verify/:token', async (req, res) => {
  const { token } = req.params
  try {
    const tokenInfo = jwt.verify(token, forgotPasswordSecretKey)
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ owner: tokenInfo._id })
    if (!forgotPasswordRequest) {
      throw new Error('There is no reset password request with that token')
    }

    const isMatch = await bcrypt.compare(tokenInfo.resetToken, forgotPasswordRequest.token)
    if (!isMatch) {
      throw new Error('Reset token doesn\'t match a request')
    }
    res.status(200).send({ success: true })
  } catch (err) {
    jwt.verify(
      token,
      forgotPasswordSecretKey,
      { ignoreExpiration: true },
      async function (errToken, decodedInfo) {
        if (errToken) {
          return res.status(400).send({ success: false })
        }
        const { _id, resetToken } = decodedInfo
        const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ owner: _id })
        if (forgotPasswordRequest) {
          const isMatch = await bcrypt.compare(resetToken, forgotPasswordRequest.token)
          if (isMatch) {
            forgotPasswordRequest.remove()
          }
        }
        res.status(400).send({ success: false })
      }
    )
  }
})

router.post('/forgot-password/confirm/:token', async (req, res) => {
  const { token } = req.params
  try {
    const tokenInfo = jwt.verify(token, forgotPasswordSecretKey)
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ owner: tokenInfo._id })
    if (!forgotPasswordRequest) {
      throw new Error('There is no reset password request with that token')
    }

    const isMatch = await bcrypt.compare(tokenInfo.resetToken, forgotPasswordRequest.token)
    if (!isMatch) {
      throw new Error('Reset token doesn\'t match a request')
    }

    const user = await User.findOne({ _id: tokenInfo._id })
    const { newPassword } = req.body
    user.password = newPassword
    user.resetPasswordTimestamp = Date.now()
    await user.save()
    await forgotPasswordRequest.remove()
    res.status(200).send({ success: true })
  } catch (err) {
    jwt.verify(
      token,
      forgotPasswordSecretKey,
      { ignoreExpiration: true },
      async function (errToken, decodedInfo) {
        if (errToken) {
          return res.status(400).send({ success: false })
        }
        const { _id, resetToken } = decodedInfo
        const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ owner: _id })
        if (forgotPasswordRequest) {
          const isMatch = await bcrypt.compare(resetToken, forgotPasswordRequest.token)
          if (isMatch) {
            forgotPasswordRequest.remove()
          }
        }
        res.status(400).send({ success: false })
      }
    )
  }
})

module.exports = router
