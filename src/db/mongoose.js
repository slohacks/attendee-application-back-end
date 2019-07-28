const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/slohacks-backend-api', {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('Mongoose connected successfully')
}).catch((err) => {
  console.log('Mongoose couldn\'t connect to database', err)
})
