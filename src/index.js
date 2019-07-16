const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user.js')
const morgan = require('morgan')
const app = express()
const port = 4000

app.use(express.json())
app.use(morgan('combined'))
app.use(userRouter)

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})
