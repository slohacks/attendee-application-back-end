const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const applicationRouter = require('./routers/application')
const emailRequestRouter = require('./routers/emailRequest')
const resumeRouter = require('./routers/resume')
const morgan = require('morgan')
const app = express()
const port = 4000

app.use(express.json())
app.use(morgan('combined'))
app.use(userRouter)
app.use(applicationRouter)
app.use(emailRequestRouter)
app.use(resumeRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
