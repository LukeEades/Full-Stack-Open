import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"
const AnecdoteForm = () => {
  const client = useQueryClient()
  const [notification, dispatchNotification] = useContext(NotificationContext)
  const mutation = useMutation({
    mutationFn: data => axios.post("http://localhost:3001/anecdotes", data).then(response => response.data),
    onSuccess: data => {
      client.invalidateQueries({queryKey: ["anecdotes"]})
      dispatchNotification({
        type: "set",
        payload: {
          message: `created anecdote "${data.content}"`
        }
      })
      setTimeout(() => dispatchNotification({type: "set", payload: {message: ""}}), 3000)
    },
    onError: err => {
      console.log(err)
      dispatchNotification({
        type: "set",
        payload: {
          message: `failed to create, must be at leasdt 5 characters in length`
        }
      })
      setTimeout(() => dispatchNotification({type: "set", payload: {message: ""}}), 3000)
    }
  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    mutation.mutate({
      votes: 0,
      content,
      id: Math.floor(Math.random() * 100000)
    })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
