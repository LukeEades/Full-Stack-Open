import blogService from "../services/blogs.js"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { deleteBlog, updateBlog } from "../reducers/blogsReducer.js"
import { setNotif } from "../reducers/notificationReducer.js"
import axios from "axios"
import {
  Button,
  Typography,
  Input,
  List,
  Container,
  ListItem,
} from "@mui/material"

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const user = useSelector(items => items.user)
  const [comment, setComment] = useState("")
  const blogStyle = {}
  const removeBlog = async () => {
    if (!window.confirm(`are you sure that you want to delete ${blog.title}`)) {
      return
    }
    try {
      await blogService.deleteBlog(blog)
      dispatch(deleteBlog(blog))
    } catch (err) {
      console.log(err)
    }
  }
  const onLike = async () => {
    let updated = {
      ...blog,
      likes: blog.likes + 1,
    }
    delete updated.user
    try {
      let newBlog = await blogService.update(updated)
      dispatch(updateBlog(newBlog))
      dispatch(
        setNotif({
          type: "success",
          message: `liked blog "${newBlog.title}"`,
        })
      )
    } catch (err) {
      dispatch(
        setNotif({
          type: "error",
          message: `error: ${err.message}`,
        })
      )
    }
  }
  const addComment = async () => {
    let response = await axios.post(`/api/blogs/${blog.id}/comments`, {
      comment,
    })
    dispatch(updateBlog(response.data))
  }
  return (
    <Container style={blogStyle} className="blog">
      <Typography fontSize={30}>
        {blog.title} by {blog.author}
      </Typography>
      <Typography>
        <a href={blog.url}>{blog.url}</a>
      </Typography>
      <Typography className="likes">{blog.likes} likes</Typography>
      <Button
        size="small"
        variant="contained"
        className="like-button"
        onClick={onLike}
      >
        like
      </Button>
      <Typography>added by: {blog.user.username}</Typography>
      {user && user.id === blog.user.id && (
        <Button variant="contained" color="error" onClick={removeBlog}>
          remove
        </Button>
      )}
      <Typography fontSize={20}>comments:</Typography>
      <div>
        <Input type="text" onChange={e => setComment(e.target.value)} />
        <Button onClick={addComment}>add comment</Button>
      </div>
      <List>
        {blog.comments.map((comment, index) => (
          <ListItem key={index}>
            <Typography>{comment}</Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default Blog
