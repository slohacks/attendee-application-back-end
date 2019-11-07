const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const applicationRouter = require('./routers/application')
const emailRequestRouter = require('./routers/emailRequest')
const resumeRouter = require('./routers/resume')
const rsvpRouter = require('./routers/rsvp')
const forgotPasswordRequestRouter = require('./routers/forgotPasswordRequest')
const morgan = require('morgan')
const port = process.env.PORT
const app = require('./app')

app.use(express.json())
app.use(morgan('combined'))
app.use(userRouter)
app.use(applicationRouter)
app.use(emailRequestRouter)
app.use(forgotPasswordRequestRouter)
app.use(resumeRouter)
app.use(rsvpRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
