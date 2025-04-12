
import { useState } from "react"
const Blogform = ({ handleForm }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async event => {
    event.preventDefault()
    let blogInfo = {
      title,
      author,
      url
    }
    handleForm(blogInfo)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <label>title: <input id="title" onChange={({ target }) => setTitle(target.value)}/></label>
        <label>author: <input id="author" onChange={({ target }) => setAuthor(target.value)}/></label>
        <label>url: <input id="url" onChange={({ target }) => setUrl(target.value)}/></label>
        <button>create</button>
      </form>
    </>
  )
}

export default Blogform