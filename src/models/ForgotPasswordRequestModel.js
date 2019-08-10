const mongoose = require('mongoose')

const ForgotPasswordRequest = mongoose.model('Forgot Password Request', {
  token: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = ForgotPasswordRequest
