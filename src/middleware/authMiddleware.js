const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'SECRETFORJWTWILLBEHERE')
    const user = await User.findOne({ _id: decoded._id })

    if (!user || !user.emailVerified) {
      throw new Error('Unable to authenticate user')
    }

    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send({ errorMessage: "Couldn't authenticate the user" })
  }
}

module.exports = authMiddleware
