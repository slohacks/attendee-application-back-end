const express = require('express')
const Application = require('../models/ApplicationModel')
const router = new express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/applications', authMiddleware, async (req, res) => {
  try {
    const application = new Application(req.body)
    application.owner = req.user._id
    const existingApplication = await Application.findOne({ owner: req.user._id })
    if (existingApplication) {
      throw new Error('Application for this user already exists')
    }
    await application.save()
    res.status(201).send(application)
  } catch (err) {
    res.status(400).send({ errorMessage: err.message })
  }
})

router.get('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const appId = req.params.id
    const application = await Application.findOne({ _id: appId, owner: req.user._id })
    if (!application) {
      return res.status(404).send({})
    }
    res.status(200).send(application)
  } catch (err) {
    res.status(500).send({ errorMessage: err.message })
  }
})

module.exports = router
