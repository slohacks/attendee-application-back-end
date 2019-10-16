const express = require('express')
const IncompleteApplication = require('../models/IncompleteApplicationModel')
const router = new express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.put('/incomplete-applications/saves', authMiddleware, async (req, res) => {
  try {
    const existingIncompleteApp = await IncompleteApplication.findOne({ owner: req.user._id })
    if (existingIncompleteApp) {
      const updates = Object.keys(req.body)
      const allowedUpdates = ['name', 'email', 'phoneNumber', 'university', 'major', 'classYear', 'shirtSize', 'ethnicity', 'gender', 'pronouns', 'github', 'linkedin', 'personalSite', 'otherSite', 'originCity', 'campusParking', 'travelSponsorship', 'validAge', 'dietaryRestrictions', 'allergies', 'referral', 'personalProject', 'hackathonGoal', 'mlhSignature']
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
      if (!isValidOperation) {
        return res.status(400).send({ error: 'Could not save application, illegal update fields' })
      }
      updates.forEach(function (update) {
        existingIncompleteApp[update] = req.body[update]
      })
      await existingIncompleteApp.save()
      return res.status(201).send(existingIncompleteApp)
    }
    const incompleteApp = new IncompleteApplication(req.body)
    incompleteApp.owner = req.user._id
    await incompleteApp.save()
    res.status(200).send(incompleteApp)
  } catch (err) {
    res.status(500).send({ errorMessage: err.message })
  }
})

router.get('/incomplete-applications/saves/request', authMiddleware, async (req, res) => {
  try {
    const owner = req.user._id
    const incompleteApp = await IncompleteApplication.findOne({ owner })
    if (!incompleteApp) {
      return res.status(404).send({})
    }
    res.status(200).send(incompleteApp)
  } catch (err) {
    res.status(500).send({ errorMessage: err.message })
  }
})

module.exports = router
