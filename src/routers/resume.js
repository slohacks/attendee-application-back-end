const express = require('express')
const multer = require('multer')
const objectId = require('mongodb').ObjectID
const Resume = require('../models/ResumeModel')
const router = new express.Router()
const authMiddleware = require('../middleware/authMiddleware')

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Please upload a PDF file'))
    }
    cb(undefined, true)
  }
})

router.post('/resumes', authMiddleware, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(500).send({ error: 'Please upload a file' })
  }
  const existingResume = await Resume.findOne({ owner: req.user._id })
  if (existingResume) {
    existingResume.resume = req.file.buffer
    existingResume.submittedAt = new Date()
    await existingResume.save()
    return res.status(201).send(existingResume)
  }
  const resume = new Resume({ owner: req.user._id, resume: req.file.buffer })
  await resume.save()
  res.status(201).send(resume)
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.get('/resumes/:id', authMiddleware, async (req, res) => {
  try {
    if (!objectId.isValid(req.params.id)) {
      throw new Error('Invalid userID')
    }
    const { id: userID } = req.params
    const resume = await Resume.findOne({ owner: userID })
    if (userID !== req.user._id.toString()) {
      throw new Error()
    }
    res.status(200).send(resume)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

module.exports = router
