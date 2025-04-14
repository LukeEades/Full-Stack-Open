import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
//const anecdotesAtStart = [
//  'If it hurts, do it more often',
//  'Adding manpower to a late software project makes it later!',
//  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//  'Premature optimization is the root of all evil.',
//  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
//]

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const slice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    increaseVote(state, action) {
      state.find(item => item.id == action.payload).votes++
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      return state.map(item => item.id == action.payload.id? action.payload: item)
    }
  }
})

export const increaseVote = anecdote => {
  return async dispatch => {
    let newAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    let response = await axios.put(`http://localhost:3001/anecdotes/${newAnecdote.id}`, newAnecdote)
    dispatch(updateAnecdote(response.data))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    let anecdote = asObject(content)
    let response = await axios.post("http://localhost:3001/anecdotes", anecdote)
    dispatch(appendAnecdote(response.data))
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const response = await axios.get("http://localhost:3001/anecdotes")
    dispatch(setAnecdotes(response.data))
  }
}
export const { updateAnecdote, appendAnecdote, setAnecdotes } = slice.actions
export default slice.reducer