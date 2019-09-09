/* eslint-env jest */
const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/UserModel')
const EmailRequest = require('../models/EmailRequestModel')

const userOne = {
  email: 'test@unverifiedemail.com',
  password: 'testpassword123'
}

const userTwo = {
  email: 'test@verifyemail.com',
  password: 'testpassword123'
}

beforeEach(async () => {
  await User.deleteMany()
  await EmailRequest.deleteMany()
  const unverifiedUser = new User(userOne)
  const verifiedUser = new User(userTwo)
  verifiedUser.emailVerified = true
  verifiedUser.lastLoginTimestamp = Date.now()
  await new User(unverifiedUser).save()
  await new User(verifiedUser).save()
})

afterEach(async () => {
  await User.deleteMany()
  await EmailRequest.deleteMany()
})

test('Should create a new user', async () => {
  const response = await request(app).post('/users/signup').send({
    email: 'test@testemail.com',
    password: 'funnypass123'
  }).expect(201)

  const user = await User.findById(response.body._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    emailVerified: false,
    verifyEmailTimestamp: null,
    resetPasswordTimestamp: null,
    lastLoginTimestamp: null,
    _id: user._id.toString(),
    email: 'test@testemail.com'
  })

  expect(user.password).not.toBe('funnypass123')
})

test('Should not create multiple accounts with the same email', async () => {
  await request(app).post('/users/signup').send({
    email: 'test@testemail.com',
    password: 'funnypass123'
  }).expect(201)

  await request(app).post('/users/signup').send({
    email: 'test@testemail.com',
    password: 'differentpass123'
  }).expect(400)

  const users = await User.find({ email: 'test@testemail.com' }).exec()
  expect(users.length).toBe(1)
})

test('Should not login user with incorrect credentials', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'fakepassword'
  }).expect(400)

  expect(response.body).toMatchObject({
    errorMessage: 'Invalid email or password'
  })
})

test('Should prevent an unverified account from logging in', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(400)

  expect(response.body).toMatchObject({
    errorMessage: 'Please verify your email before you login'
  })
})

test('Should allow verified account to log in', async () => {
  const response = await request(app).post('/users/login').send({
    email: userTwo.email,
    password: userTwo.password
  }).expect(200)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toEqual(expect.objectContaining({
    user: expect.objectContaining({
      emailVerified: true,
      verifyEmailTimestamp: null,
      resetPasswordTimestamp: null,
      lastLoginTimestamp: expect.any(String),
      email: userTwo.email,
      _id: user._id.toString()
    }),
    token: expect.any(String)
  }))

  const signedToken = jwt.verify(response.body.token, process.env.LOGIN_SECRET_KEY)
  expect(signedToken).toEqual(expect.objectContaining({
    _id: user._id.toString()
  }))
})
