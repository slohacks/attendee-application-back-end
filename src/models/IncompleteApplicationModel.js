const mongoose = require('mongoose')

const IncompleteApplication = mongoose.model('Incomplete Application', {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    trim: true,
    default: null
  },
  email: {
    type: String,
    trim: true,
    default: null
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: null
  },
  university: {
    type: String,
    trim: true,
    default: null
  },
  major: {
    type: String,
    trim: true,
    default: null
  },
  classYear: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  shirtSize: {
    type: String,
    trim: true,
    default: null
  },
  ethnicity: {
    type: String,
    trim: true,
    default: null
  },
  gender: {
    type: String,
    trim: true,
    default: null
  },
  pronouns: {
    type: String,
    trim: true,
    default: null
  },
  github: {
    type: String,
    trim: true,
    default: null
  },
  linkedin: {
    type: String,
    trim: true,
    default: null
  },
  personalSite: {
    type: String,
    trim: true,
    default: null
  },
  otherSite: {
    type: String,
    trim: true,
    default: null
  },
  originCity: {
    type: String,
    default: null
  },
  campusParking: {
    type: Boolean,
    default: null
  },
  travelSponsorship: {
    type: Boolean,
    default: null
  },
  validAge: {
    type: Boolean,
    default: null
  },
  dietaryRestrictions: {
    type: String,
    trim: true,
    default: null
  },
  allergies: {
    type: String,
    default: null
  },
  referral: {
    type: String,
    trim: true,
    default: null
  },
  personalProject: {
    type: String,
    trim: true,
    default: null
  },
  hackathonGoal: {
    type: String,
    trim: true,
    default: null
  },
  mlhSignature: {
    type: Boolean,
    default: null
  }
})

module.exports = IncompleteApplication
