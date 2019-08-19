const mongoose = require('mongoose')

const RSVP = mongoose.model('RSVP', {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  attending: {
    type: Boolean,
    required: true
  },
  shirt: {
    type: Number,
    min: 0,
    max: 4,
    required: function () { return this.attending }

  },
  travelType: {
    type: Number,
    min: 0,
    max: 2,
    required: function () { return this.attending }
  },
  bus: {
    type: Number,
    min: 0,
    max: 2,
    required: function () { return this.attending && this.travelType === 0 }
  },
  socal: {
    type: Number,
    min: 0,
    max: 2,
    required: function () { return this.attending && this.bus === 0 }
  },
  norcal: {
    type: Number,
    min: 0,
    max: 2,
    required: function () { return this.attending && this.bus === 1 }

  },
  flight: {
    type: String,
    required: function () { return this.attending && this.travelType === 1 }
  },
  misc: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = RSVP
