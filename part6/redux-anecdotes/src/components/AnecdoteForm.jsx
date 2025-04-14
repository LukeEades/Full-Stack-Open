import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const handleSubmit = (event) => {
    event.preventDefault()
    let content = event.target.anecdote.value
    dispatch(createAnecdote(content))
    dispatch(setNotification(`created anecdote "${content}"`))
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm