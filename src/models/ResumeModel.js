const mongoose = require('mongoose')

const Resume = mongoose.model('Resume', {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  resume: {
    type: Buffer,
    required: true
  }
})

module.exports = Resume
