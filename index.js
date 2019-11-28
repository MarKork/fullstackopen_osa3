const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('build'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1  
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2  
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3  
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
  ]

  const generateId = () => {
    return Math.floor(Math.random() * (1000 - 20)) + 20;
  }

  app.post('/api/persons', (req, res)=> {
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
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
    if(persons.find(p=>p.name===newPerson.name)){
      return res.status(400).json({
        error:'name must be unique'
      })
    }
    console.log(newPerson.name)
    persons = persons.concat(newPerson)
    res.json(newPerson)

    
  }) 

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)  
    res.status(204).end()
  })

  const PORT = process.env.PORT ||3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })