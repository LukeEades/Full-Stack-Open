import axios from 'axios'
const uploadContact = (contact) => {
    return axios
      .post("http://localhost:3001/persons", contact)
      .then((response)=> response.data)
}
const getContacts = () => {
    return axios
        .get("http://localhost:3001/persons")
        .then((response) => response.data)
}

const deleteContact = (id) => {
    return axios
        .delete(`http://localhost:3001/persons/${id}`)
}

const replaceContact = (person) => {
    return axios
        .put(`http://localhost:3001/persons/${person.id}`, person)
        .then((response) => response.data)
}

export {uploadContact, getContacts, deleteContact, replaceContact}