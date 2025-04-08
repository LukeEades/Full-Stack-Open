const mongoose = require("mongoose")

let args = process.argv.slice(2)
if (args.length === 0) {
    console.log("please supply password")
    return
}

let password = args[0]
let url = `mongodb+srv://luke:${password}@cluster0.25asvql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Contact = mongoose.model("Person", contactSchema)
if (args.length === 1) {
    // just return all available notes
    Contact.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}else if (args.length === 3) {
    let name = args[1]
    let number = args[2]
    let contact = Contact({
        name: name,
        number: number,
    })
    contact.save().then(result => {
        console.log("saved note", result)
        mongoose.connection.close()
    })
} else {
    // don't do anything
    console.log("improper syntax")
    mongoose.connection.close()
    return
}