// import modules
const express = require('express')
const Application = require('../models/Application')
const router = new express.Router()
const authMiddleware = require('../middleware/authMiddleware')

// Post request to add new application to database
router.post('/applications', authMiddleware, async (req, res) => {
  console.log(req.user, req.token)
  res.status(200).send({ message: 'Successful Authentication' })
  const application = new Application(req.body)
  application.owner = req.user._id

  // intermediate functions here
  //  lowercase?
  //  whitelist?

  try {
    // check if application for user already exists
    const application = await Application.findOne({ owner: req.user._id })
    if (application) {
      throw new Error('Application for this user already exists')
      // possibly return a response with error code other than 400
    }
    await application.save()
    res.status(201).send(application)
  } catch (err) {
    res.status(400).send({ errorMessage: err.message })
  }
})

// Get request to fetch a user's application based on user's ID
router.get('/applications/:id', authMiddleware, async (req, res) => {
  const appId = req.params.id
  try {
    // find application based on application objectID and current user's objectID
    const application = await Application.findOne({ appId, owner: req.user._id })
    if (!application) {
      return res.status(404).send()
    }
    res.status(200).send(application)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router
