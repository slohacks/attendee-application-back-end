// import modules
const mongoose = require('mongoose')
const validator = require('validator')

// class definition
const Application = mongoose.model('Application', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: null
  },
  gender: {
    type: String,
    required: true,
    min: 0,
    max: 4
  },
  major: {
    type: String,
    required: true,
    trim: true
  },
  mlh: {
    type: Boolean,
    required: true
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
  timestamp: {
    type: Date,
    required: true
  },
  grad_date: { // dateInput?
    // mongoose stores dates in the format "1987-09-28"
    // potentially just store grad year
    // potentially delete this field
    type: Number,
    required: true,
    trim: true
  },
  grade: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  allergies: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  ethnicity: {
    type: Number,
    required: true,
    min: 0,
    max: 6
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Boolean,
    required: true
  },
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  diet: {
    type: Number,
    min: 0,
    max: 4
  },
  misc: {
    type: String,
    trim: true
  },
  project: {
    type: String,
    required: true,
    trim: true
  },
  challenge: {
    type: String,
    required: true,
    trim: true
  }
})

// export Application model
module.exports = Application

// NOTES
//  molter for resume field
//  blacklist things like "".:)(/" to clean textInput?
//  lowercase for text input?
