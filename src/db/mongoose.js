const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('Mongoose connected successfully')
}).catch((err) => {
  console.log('Mongoose couldn\'t connect to database', err)
})
