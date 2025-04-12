import PropTypes from "prop-types"
import Toggleable from "./Toggleable"
import blogService from "../services/blogs.js"
const Blog = ({ blog, user, deleteBlog, addLike }) => {
  // should have method to alter blog info
  // should have method to delete blog by id
  const blogStyle = {
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    padding: 5,
  }
  const removeBlog = async () => {
    if(!window.confirm(`are you sure that you want to delete ${blog.title}`)) {
      return
    }
    try {
      await blogService.deleteBlog(blog)
      deleteBlog(blog)
    } catch (err) {
      console.log(err)
    }
  }
  const onLike = async () => {
    addLike(blog)
  }
  return(
    <div style={blogStyle} className="blog">
      <div>title: {blog.title}</div>
      <div>author: {blog.author}</div>
      <Toggleable buttonLabel="show">
        <div>url: <a href={blog.url}>{blog.url}</a></div>
        <div className="likes">likes: {blog.likes}</div><button className="like-button" onClick={onLike}>like</button>
        <div>added by: {blog.user.username}</div>
        {user.id === blog.user.id && <button onClick={removeBlog}>remove</button>}
      </Toggleable>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog