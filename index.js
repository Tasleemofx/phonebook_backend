const express = require('express')
let contacts = require('./contacts')
const app = express();
app.use(express.json())


app.get("/info",(request, response)=>{
  const length = contacts.length
  const date = new Date()
    response.send(`<div>
      <p>Phonebook has ${length} contacts.</p>
      <p> ${date} </p>
      </div>`)
})

app.get('/api/contacts', (request, response)=>{
    response.json(contacts)
})

app.get('/api/contacts/:id',(request,response)=>{
  const contact = contacts.find(c=> c.id == Number(request.params.id))
  if(contact){
  response.json(contact)
} else {
  response.status(404).end()
}
})

app.post('/api/contacts', (request, response)=>{
  const body = request.body
  if(contacts.find(c=> c.name=== body.name)){
    response.status(204).json({
      error: 'please enter a unique name'
    })
  } else if(!body.name || !body.number ){
    response.status(204).json({
      error: "name and number fields must not be empty"
    })
  }else{
      contacts = contacts.concat(body)
      response.json(contacts)
  }
})

app.put('/api/contacts/:id', (request, response)=>{
  const newNumber = request.body
  const contact = contacts.find(c=> c.id == Number(request.params.id))
  if(contact && newNumber){
    const newContact = {...contact, number: newNumber}
    contact= newContact
    response.json(contact)
  }else{
    response.status(400).json({error: "please enter new number"})
  }
})

app.delete('/api/contacts/:id', (request,response)=>{
  const contact = contacts.find(c=> c.id == Number(request.params.id))
  const show = contacts.filter( c=> c !== contact)
  response.json(show)
})



const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`code now running on port ${PORT}`)
})
