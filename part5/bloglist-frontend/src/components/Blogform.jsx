import { useState } from "react"
import { appendBlog } from "../reducers/blogsReducer"
import { setNotif } from "../reducers/notificationReducer"
import blogService from "../services/blogs"
import { useDispatch } from "react-redux"

const Blogform = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async event => {
    event.preventDefault()
    let blogInfo = {
      title,
      author,
      url,
    }
    try {
      let newBlog = await blogService.create(blogInfo)
      dispatch(appendBlog(newBlog))
      dispatch(
        setNotif({
          type: "success",
          message: `created new blog "${newBlog.title}"`,
        })
      )
    } catch (err) {
      dispatch(
        setNotif({
          type: "error",
          message: `error: ${err.message}"`,
        })
      )
    }
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <label>
          title:
          <input id="title" onChange={({ target }) => setTitle(target.value)} />
        </label>
        <label>
          author:
          <input
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          url:
          <input id="url" onChange={({ target }) => setUrl(target.value)} />
        </label>
        <button>create</button>
      </form>
    </>
  )
}

export default Blogform
