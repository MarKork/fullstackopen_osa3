require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contact')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

const generateId = () => {
  return Math.floor(Math.random() * (1000 - 20)) + 20
}

app.post('/api/persons', (req, res, next) => {
  console.log(req.body)
  const body = req.body
  if(!body.name){
    return res.status(400).json({
      error: 'name missing'
    })
  }
  if(!body.number){
    return res.status(400).json({
      error: 'number missing'
    })
  }
  const newPerson = new Contact({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  newPerson.save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
  console.log(newPerson.name)
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Contact.find({}).then(contacts => {
    res.json(contacts.map(contact => contact.toJSON()))
  })
    .catch(error => next(error))
})

app.get('/api/info', (req, res) => {
  Contact.find({}).then(contacts => {
    res.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${Date()}</p>`)})
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if(contact){
        response.json(contact.toJSON())
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  console.log(req.params.id)
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const contact = {
    name: body.name,
    number: body.number
  }
  const newPerson = new Contact({
    name: body.name,
    number: body.number,
  })
  console.log(newPerson)

  Contact.findByIdAndUpdate(req.params.id, contact, { new:true })
    .then(updatedContact => {
      res.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Contact.find({}).then(response =>{
    const total =`Phonebook has info for ${response.length} people`
    const now = new Date()
    res.send(`<p>${total}</p><p>${now}</p>`)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})