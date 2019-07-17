const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// Post request to add user to database. Expects all required fields in User Schema
router.post('/users/signup', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Post request to login a user. Takes in email and password and checks if it matches hashed password
router.get('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    res.send(user)
  } catch (e) {
    res.status(400).send()
  }
})

module.exports = router
