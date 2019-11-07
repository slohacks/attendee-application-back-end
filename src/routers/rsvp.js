const express = require('express')
const RSVP = require('../models/RSVPModel')
const router = new express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/rsvp', authMiddleware, async (req, res) => {
  try {
    const rsvp = new RSVP(req.body)
    rsvp.owner = req.user._id
    const existingRSVP = await RSVP.findOne({ owner: req.user._id })
    if (existingRSVP) {
      throw new Error('This user has already RSVP\'d')
    }
    await rsvp.save()
    res.status(201).send(rsvp)
  } catch (err) {
    res.status(400).send({ errorMessage: err.message })
  }
})

router.get('/rsvp/:id', authMiddleware, async (req, res) => {
  try {
    const { id: userID } = req.params
    const rsvp = await RSVP.findOne({ owner: userID })
    if ((!req.admin && userID !== req.user._id.toString())) {
      throw new Error()
    }
    if (!rsvp) {
      res.status(404).send({})
    } else {
      res.status(200).send(rsvp)
    }
  } catch (err) {
    res.status(500).send({ errorMessage: err.message })
  }
})

module.exports = router
