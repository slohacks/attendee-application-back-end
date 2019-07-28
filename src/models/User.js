const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordKey: {
    type: String,
    default: null
  },
  verifyTime: {
    type: Date,
    default: null
  },
  resetPasswordTime: {
    type: String,
    default: null
  }
})

// Finds email in database and compared the given password to the hashed password in the database
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  if (!user.emailVerified) {
    throw new Error('Please verify your email before you login')
  }

  return user
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'SECRETFORJWTWILLBEHERE', {
    expiresIn: '1h'
  })

  return token
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.verifyKey
  delete userObject.resetPasswordKey

  return userObject
}

// Hashes password before saving
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
