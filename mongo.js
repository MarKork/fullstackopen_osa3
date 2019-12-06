const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://kaytt:${password}@cluster0-bkxhq.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
  })
  
const Contact = mongoose.model('Contact', contactSchema)
  
if ( process.argv.length===5 ) {
    const name=process.argv[3]
    const number=process.argv[4]
    const contact = new Contact({
      name: name,
      number: number
    })
    contact.save().then(response => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
}
else{
    console.log("phonebook:")
    Contact
      .find({})
      .then(result =>{
        result.forEach(contact => {
        console.log(`${contact.name} ${contact.number}`)
      })
      mongoose.connection.close()
    }) 
    
}
