import axios from 'axios'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useReducer } from "react"
import NotificationContext from "./NotificationContext"

const reducer = (state, action) => {
  switch (action.type) {
    case "set": {
      return action.payload
    }
    default: {
      return state
    }
  }
}

const App = () => {
  const client = useQueryClient()
  const [notification, dispatch] = useReducer(reducer, {
    message: ""
  })
  const mutation = useMutation({
    mutationFn: item => axios.put(`http://localhost:3001/anecdotes/${item.id}`, item).then(response => response.data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["anecdotes"] })
    }
  })
  const handleVote = (anecdote) => {
    anecdote.votes++
    mutation.mutate(anecdote)
    dispatch({
      type: "set",
      payload: {
        message: `voted for "${anecdote.content}"`
      }
    })
    setTimeout(() => dispatch({type: "set", payload: {message:dispatch({type: "set", payload: {message: ""}})}}), 3000);
  }
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: () => axios.get("http://localhost:3001/anecdotes").then(res => res.data),
    retry: false
  })

  if (result.isLoading) {
    return <div>loading</div>
  }
  if (result.isError) {
    return <div>server communication unavailable</div>
  }
  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export default App
