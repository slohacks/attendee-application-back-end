const mongoose = require('mongoose')
const validator = require('validator')

const Application = mongoose.model('Application', {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate (value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error('Phone number is invalid')
      }
    }
  },
  university: {
    type: String,
    required: true,
    trim: true
  },
  major: {
    type: String,
    required: true,
    trim: true
  },
  classYear: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  shirtSize: {
    type: String,
    required: true,
    trim: true
  },
  ethnicity: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  pronouns: {
    type: String,
    required: true,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  personalSite: {
    type: String,
    trim: true
  },
  otherSite: {
    type: String,
    trim: true
  },
  originCity: {
    type: String,
    required: true
  },
  campusParking: {
    type: Boolean,
    required: true
  },
  travelSponsorship: {
    type: Boolean,
    required: true
  },
  validAge: {
    type: Boolean,
    required: true
  },
  dietaryRestrictions: {
    type: String,
    required: true,
    trim: true
  },
  allergies: {
    type: String,
    required: true
  },
  referral: {
    type: String,
    required: true,
    trim: true
  },
  personalProject: {
    type: String,
    required: true,
    trim: true
  },
  hackathonGoal: {
    type: String,
    required: true,
    trim: true
  },
  mlhSignature: {
    type: Boolean,
    required: true
  }
})

module.exports = Application
