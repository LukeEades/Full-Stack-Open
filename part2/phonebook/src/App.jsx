import { useState, useEffect } from 'react'
import axios from 'axios'
import { uploadContact, getContacts, deleteContact, replaceContact } from "./personService"
import { Notification } from './Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterTerm, setFilterTerm] = useState('')
  const [notification, setNotification] = useState({type:null, message:null})
  let nextId = persons.reduce((acc, val)=>Math.max(acc, Number(val.id)), 0) + 1
  useEffect(() => {
    getContacts().then((contacts) => {
      console.log(contacts)
      setPersons(contacts)
    })
  }, [])
  
  function handleFormSubmit(event) {
    let newContact = {name:newName, number:newNumber}
    event.preventDefault()
    let oldPerson
    if ((oldPerson = persons.find((value) => value.name == newName)) != undefined) {
      let replace = window.confirm(`${newName} is already added to phonebook, do you want to replace the number`)
      if (replace) {
        newContact.id = oldPerson.id
        replaceContact(newContact)
          .then(person => {
            let replaced = persons.map((person) => {
              if (person.name == newName) {
                person.number = newNumber
              }
              return person
            })
            document.getElementById('name').value = ''
            document.getElementById('number').value = ''
            setNotification({type:'success', message: `Updated ${person.name}`})
            setTimeout(()=>setNotification(null), 2000)
            setNewName('')
            setPersons(replaced)
          })
          .catch(err => {
            setNotification({type: 'error', message: err.response.data.message})
            setTimeout(()=> setNotification(null), 2000)
          })
      }
      return
    }
    uploadContact(newContact)
      .then(person => {
        setPersons(persons.concat(person))
        setNotification({type: 'success', message: `Added ${newName}`})
        setTimeout(()=>setNotification(null), 2000)
        setNewName('')
        document.getElementById('name').value = ''
        document.getElementById('number').value = ''
      })
      .catch(err => {
        console.log(err)
        let message = String(err.response.data.message)
        setNotification({type: 'error', message: message})
        setTimeout(() => setNotification(null), 2000)
      })
  }

  function handleName(event) {
    setNewName(event.target.value)
  }

  function handleNumber(event) {
    setNewNumber(event.target.value)
  }

  function handleFilter(event) {
    setFilterTerm(event.target.value)
  }

  function deletePerson(person) {
    return (event) => {
      if (window.confirm(`are you sure you want to delete ${person.name}`)) {
        let filteredPersons = persons.filter((target) => target.id != person.id)
        setPersons(filteredPersons)
        deleteContact(person.id)
          .catch((err) => {
            // set an error message
            setNotification({type:'error', message:`${person.name} has already been removed from the server`})
            setTimeout(()=>setNotification(null), 2000)
          })
      }
    }
  }

  return(
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter persons={persons} handleFilter={handleFilter} filterTerm={filterTerm} setFilterTerm={setFilterTerm}/>
      <h3>Add new</h3>
      <PersonForm handleFormSubmit={handleFormSubmit} handleName={handleName} handleNumber={handleNumber} />
      <h3>Numbers</h3>
      <div>{persons.map((person) => <Person key={person.id} person={person} deletePerson={deletePerson(person)}/>)}</div>
    </div>
  )
}

const Person = ({person, deletePerson}) => {
  return (
    <div>{person.name} {person.number}<button onClick={deletePerson}>delete</button></div>
  )
}

const Filter = ({persons, filterTerm, handleFilter}) =>{
  let matches = persons.filter((person) => {
    if (filterTerm == '') return false
    return person.name.toLowerCase().indexOf(filterTerm.toLowerCase()) != -1
  })
  return (
    <div>
    <h3>Filter</h3>
    <input onChange={handleFilter} />
    <div>{matches.map((match)=> <Person key={match.name} person={match}/>)}</div>
    </div>
  )
}

const PersonForm = ({handleFormSubmit, handleName, handleNumber}) => {
  return (
      <form onSubmit={handleFormSubmit}>
        <div>
          name: <input id='name' onChange={handleName}/>
        </div>
        <div>
          number: <input id='number' onChange={handleNumber} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
  )
}

export default App