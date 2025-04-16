import "./style.css"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import blogService from "./services/blogs"
import Notification from "./components/Notification"
import { setBlogs } from "./reducers/blogsReducer"
import { setUser, removeUser } from "./reducers/userReducer"
import Bloginfo from "./components/Bloginfo"
import { BrowserRouter, Routes, Route, useParams, Link } from "react-router"
import axios from "axios"
import Nav from "./components/Nav"
import UserPage from "./components/UserPage"
import Blog from "./components/Blog"
import UserList from "./components/UserList"
import { Typography, Container } from "@mui/material"

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(items => items.user)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      dispatch(setBlogs(blogs))
    })
  }, [])

  useEffect(() => {
    let userInfo = localStorage.getItem("user")
    if (userInfo) {
      let parsed = JSON.parse(userInfo)
      dispatch(setUser(parsed))
      blogService.setToken(parsed.token)
    }
  }, [])

  return (
    <BrowserRouter>
      <Nav />
      <Notification />
      <Container>
        <Typography fontSize={40}>Blog app</Typography>
      </Container>
      <Routes>
        <Route path="/" element={<Bloginfo />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/blogs/:id" element={<BlogPage />} />
      </Routes>
    </BrowserRouter>
  )
}

const BlogPage = () => {
  const id = useParams().id
  const blogs = useSelector(store => store.blogs)

  const blog = blogs.find(blog => blog.id === id)
  if (!blog) return null
  return <Blog blog={blog} />
}

export default App
