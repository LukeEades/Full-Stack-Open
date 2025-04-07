let express = require("express")
let morgan = require("morgan")
let cors = require("cors")
let logger = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms",
        req.method=="POST"?JSON.stringify(req.body):""
    ].join(" ")
})
let app = express()
app.use(express.json())
app.use(logger)
app.use(cors())
let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(phonebook).end()
})

app.get("/info", (request, response) => {
    let num = phonebook.length
    let now = new Date()
    response.end(`<div>Phonebook has ${num} entries</div><div>${now}</div>`)
})

app.get("/api/persons/:id", (request, response) => {
    let id = request.params.id
    let person = phonebook.find((person)=>person.id === id)
    if (!person) {
        return response.status(404).end()
    } else {
        return response.json(person).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    let id = request.params.id
    phonebook = phonebook.filter((person) => person.id != id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "missing a field"
        }).end()
    }
    // check the name as well
    if (phonebook.find((person)=>person.name===body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        }).end()
    }
    let id = String(Math.floor(Math.random() * 500000))
    let person = {
        name: body.name,
        number: body.number,
        id: id
    }
    // insert into persons
    phonebook = phonebook.concat(person)
    response.status(201).json(person).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`live on port ${PORT}`);
})