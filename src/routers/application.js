const express = require('express')
const router = new express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/applications', authMiddleware, (req, res) => {
  console.log(req.user, req.token)
  res.status(200).send({ message: 'Successful Authentication' })
})

module.exports = router
