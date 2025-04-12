import { useState, useEffect, useRef, useImperativeHandle } from "react"
import "./style.css"
import BlogList from "./components/BlogList"
import axios from "axios"
import blogService from "./services/blogs"
import Notification from "./components/Notification"
import Toggleable from "./components/Toggleable"
import Blogform from "./components/Blogform"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [notif, setNotif] = useState(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    let userInfo = localStorage.getItem("user")
    if (userInfo) {
      let parsed = JSON.parse(userInfo)
      setUser(parsed)
      blogService.setToken(parsed.token)
    }
  }, [])
  const handleLogin = async event => {
    event.preventDefault()
    // send login info here in a post request to the server; assume the user already exists
    try {
      let response = await axios.post("/api/login", { username, password })
      let userInfo = {
        ...response.data,
      }
      blogService.setToken(response.data.token)
      localStorage.setItem("user", JSON.stringify(userInfo))
      setUser(userInfo)
    } catch (err) {
      console.log(err)
      setNotif({
        type: "error",
        message: err.message
      })
      setTimeout(() => {
        setNotif(null)
      }, 3000)
    }
  }

  const createNotif = ({ type, message }) => {
    setNotif({
      type,
      message
    })
    setTimeout(() => setNotif(null), 3000)
  }

  const createBlog = (blogData) => {
    setBlogs(blogs.concat(blogData))
  }

  const loginForm = () => {
    return (
      <>
        <h2>login</h2>
        <form onSubmit={handleLogin}>
          <label>username:<input id="username" onChange={({ target }) => {setUsername(target.value)}} /></label>
          <label>password:<input id="password" onChange={({ target }) => {setPassword(target.value)}} /></label>
          <button>login</button>
        </form>
      </>
    )
  }
  const blogPosts = () => {
    return (
      <>
        <h2>blogs</h2>
        <h3>{user.username} logged in</h3>
        <button onClick={() => {
          localStorage.removeItem("user")
          blogService.setToken(null)
          setUser(null)
        }}>logout</button>
        <Toggleable buttonLabel="new note" toggleRef={toggleRef}>
          <Blogform createBlog={createBlog} createNotif={createNotif} user={user} toggle={toggleRef} handleForm={handleForm}/>
        </Toggleable>
        <BlogList blogs={blogs} setBlogs={setBlogs} user={user} />
      </>
    )
  }
  const handleForm = async (blogInfo) => {
    let response
    try {
      response = await blogService.create(blogInfo)
    } catch (err) {
      console.error(err)
      createNotif({
        type: "error",
        message: err.error
      })
      return
    }
    createBlog(response)
    createNotif({
      type: "success",
      message: `created new blog ${blogInfo.title} by ${blogInfo.author}`
    })
    toggleRef.current.toggleVisibility()
  }

  return (
    <div>
      <Notification notification={notif}/>
      {
        user === null ? loginForm(): blogPosts()
      }
    </div>
  )
}

export default App