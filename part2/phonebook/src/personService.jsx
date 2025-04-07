import axios from "axios"

const URL = "http://localhost:3001"

const uploadContact = (contact) => {
    return axios
      .post(URL+"/api/persons", contact)
      .then((response)=> response.data)
}
const getContacts = () => {
    return axios
        .get(URL + "/api/persons")
        .then((response) => response.data)
}

const deleteContact = (id) => {
    return axios
        .delete(`${URL}/api/persons/${id}`)
}

const replaceContact = (person) => {
    return axios
        .put(`${URL}/api/persons/${person.id}`, person)
        .then((response) => response.data)
}

export {uploadContact, getContacts, deleteContact, replaceContact}