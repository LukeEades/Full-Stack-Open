import { useDispatch, useSelector } from "react-redux"
import { increaseVote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(items => {
    return items.anecdotes.filter(item => {
      return item.content.toLowerCase().indexOf(items.filter.toLowerCase()) !== -1
    })
  })
  
  const addVote = (anecdote) => {
    dispatch(increaseVote(anecdote))
    dispatch(setNotification(`you voted for "${anecdote.content}"`, 5))
  }

  return (
    <div>
    {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => addVote(anecdote)}>vote</button>
        </div>
      </div>
    )}
    </div>
  )
}

export default AnecdoteList