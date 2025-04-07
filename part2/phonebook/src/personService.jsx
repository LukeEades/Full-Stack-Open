import axios from "axios"

const URL = "/api"

const uploadContact = (contact) => {
    return axios
      .post(URL+"/persons", contact)
      .then((response)=> response.data)
}
const getContacts = () => {
    return axios
        .get(URL + "/persons")
        .then((response) => response.data)
}

const deleteContact = (id) => {
    return axios
        .delete(`${URL}/persons/${id}`)
}

const replaceContact = (person) => {
    return axios
        .put(`${URL}/persons/${person.id}`, person)
        .then((response) => response.data)
}

export {uploadContact, getContacts, deleteContact, replaceContact}