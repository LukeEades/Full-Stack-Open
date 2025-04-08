require("dotenv").config()
let express = require("express")
let mongoose = require("mongoose")
let morgan = require("morgan")
let cors = require("cors")
let logger = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"), "-",
        tokens["response-time"](req, res), "ms",
        req.method ===  "POST"?JSON.stringify(req.body):""
    ].join(" ")
})
let app = express()
app.use(express.json())
app.use(logger)
app.use(cors())
app.use(express.static("dist"))
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("succesfully connected to mongodb")
    })
    .catch((err) => {
        console.log("unable to connect to db:", err)
    })
// need to remember to connect on load
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return /(\d{2}|d{3})-\d*/.test(v) && v.length >= 8
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
})
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model("Person", personSchema)

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons).end()
        })
        .catch(err => next(err))
})

app.get("/info", (request, response, next) => {
    Person.find({})
        .then(persons => {
            let now = new Date()
            response.send(`<div>Phonebook has ${persons.length} entries</div><div>${now}</div>`).end()
        })
        .catch(err => next(err))
})

app.get("/api/persons/:id", (request, response, next) => {
    let id = request.params.id
    Person.findById(id)
        .then(person => {
            if (person) {
                return response.json(person).end()
            } else {
                return response.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.delete("/api/persons/:id", (request, response, next) => {
    let id = request.params.id
    Person.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(err => next(err))
})

app.put("/api/persons/:id", (request, response, next) => {
    let id = request.params.id
    let newPerson = {
        name: request.body.name,
        number: request.body.number,
    }
    Person.findByIdAndUpdate(id, newPerson, { new: true, runValidators: true })
        .then(person => {
            return response.json(person).end()
        })
        .catch(err => next(err))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "missing a field"
        }).end()
    }
    let person = Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(person => {
        console.log("saved person")
        return response.status(201).json(person).end()
    })
        .catch(err => next(err))
})

const errorHandler = (error, request, response) => {
    console.log(error)
    if (error.name === "CastError" || error.name === "ValidationError") {
        return response.status(400).send(error)
    }
    return response.status(500).send(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`live on port ${PORT}`)
})