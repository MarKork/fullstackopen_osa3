const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
var uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI

console.log('connecting to', url)


mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required:true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required:true,
    unique:true
  } ,
  id: {
    type: Number
  }
})

contactSchema.plugin(uniqueValidator);

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)