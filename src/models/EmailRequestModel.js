const mongoose = require('mongoose')

const EmailRequest = mongoose.model('Email Request', {
  token: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = EmailRequest
