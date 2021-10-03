require('dotenv').config()
const express = require('express')
let Contacts = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express();
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())




app.get("/info",(request, response)=>{
  const length = Contacts.count()
  const date = new Date()
    response.send(`<div>
      <p>Phonebook has ${length} contacts.</p>
      <p> ${date} </p>
      </div>`)
})

app.get('/api/contacts', (request, response)=>{
    Contacts.find({}).then(contact=>{
      response.json(contact)
    })
})

app.get('/api/contacts/:id',(request,response)=>{
 Contacts.findById(request.params.id)
  .then((c)=>{
    if (c) {
      console.log(c)
      response.json(c.toJSON())
    } else {
      response.status(404).end()
    }
  })
})

app.post('/api/contacts', (request, response)=>{
  const body = request.body

  const contact = new Contacts({
    name: body.name,
    number: body.number
  })
  if(body){
    contact.save()
    .then(response=> console.log(response))
  } else{
    response.status(400).json({ error: "number and name cannot be empty"})
  }
})
// PUT request needs fixing
app.put('/api/contacts/:id', (request, response)=>{
  const body = request.body

  const person = {
    number: body.number,
  }
  console.log( 'preEdit', person)

  Contacts.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/contacts/:id', (request,response)=>{
  Contacts.findByIdAndDelete(request.params.id)
  .then(response=> console.log(response))
})



const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`code now running on port ${PORT}`)
})
